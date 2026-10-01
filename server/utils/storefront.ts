import type { Discount } from '~/stores/discounts'
import type { ShippingRate } from '~/stores/shipping'
import type { PaymentMethodType } from '~/stores/payments'

// Business rules shared by the admin API (status display) and the storefront API
// (coupon validation, shipping quotes, payment methods).

const round = (n: number) => Math.round(n * 100) / 100

// Status shown in the dashboard is derived from the dates; only "disabled" is a manual flag
export function effectiveDiscountStatus(d: Discount, now = new Date()): Discount['status'] {
  if (d.status === 'disabled') return 'disabled'
  if (new Date(d.startDate) > now) return 'scheduled'
  if (d.endDate && new Date(d.endDate) < now) return 'expired'
  return 'active'
}

// Coupon codes are stored trimmed and upper-case so lookups and duplicate checks agree
export function normalizeDiscountInput(body: Partial<Discount>): Partial<Discount> {
  return typeof body.code === 'string' && body.method !== 'automatic'
    ? { ...body, code: body.code.trim().toUpperCase() }
    : body
}

export const withEffectiveStatus = (d: Discount): Discount => ({ ...d, status: effectiveDiscountStatus(d) })

// ---------- Coupons ----------

export interface CartLine {
  productId: string
  category?: string
  price: number
  quantity: number
}

export interface CouponRequest {
  code: string
  items: CartLine[]
  customerId?: string | null
}

// What we know about the customer from previous orders
export interface CustomerHistory {
  ordersCount: number
  usedCodes: string[]
}

export interface CouponResult {
  code: string
  name: string
  type: Discount['type']
  discountAmount: number
  freeShipping: boolean
}

export class CouponError extends Error {}

export function evaluateCoupon(discounts: Discount[], req: CouponRequest, history: CustomerHistory = { ordersCount: 0, usedCodes: [] }): CouponResult {
  const code = req.code?.trim().toUpperCase()
  const d = discounts.find(x => x.method === 'coupon' && x.code.toUpperCase() === code)
  if (!code || !d) throw new CouponError('كود الخصم غير صالح')

  const status = effectiveDiscountStatus(d)
  if (status === 'disabled') throw new CouponError('كود الخصم غير صالح')
  if (status === 'scheduled') throw new CouponError('هذا الكوبون لم يبدأ بعد')
  if (status === 'expired') throw new CouponError('انتهت صلاحية هذا الكوبون')
  if (d.usageLimit && d.usageCount >= d.usageLimit) {
    throw new CouponError('تم استنفاد الحد الأقصى لاستخدام هذا الكوبون')
  }

  // These rules need to know who the customer is
  if (d.customerEligibility !== 'all' || d.firstOrderOnly || d.onePerCustomer) {
    if (!req.customerId) throw new CouponError('سجّل الدخول لاستخدام هذا الكوبون')
    if (d.customerEligibility === 'specific' && !d.selectedCustomers?.includes(req.customerId)) {
      throw new CouponError('هذا الكوبون غير متاح لحسابك')
    }
    if ((d.customerEligibility === 'new' || d.firstOrderOnly) && history.ordersCount > 0) {
      throw new CouponError('هذا الكوبون متاح لأول طلب فقط')
    }
    if (d.customerEligibility === 'returning' && history.ordersCount === 0) {
      throw new CouponError('هذا الكوبون متاح للعملاء السابقين فقط')
    }
    if (d.onePerCustomer && history.usedCodes.includes(d.code.toUpperCase())) {
      throw new CouponError('لقد استخدمت هذا الكوبون من قبل')
    }
  }

  const items = req.items ?? []
  const eligible = items.filter(i =>
    d.scope === 'all' ||
    (d.scope === 'products' && d.selectedProducts?.includes(i.productId)) ||
    (d.scope === 'categories' && !!i.category && d.selectedCategories?.includes(i.category))
  )
  if (eligible.length === 0) throw new CouponError('الكوبون لا ينطبق على المنتجات الموجودة في السلة')

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const eligibleSubtotal = eligible.reduce((s, i) => s + i.price * i.quantity, 0)
  const eligibleQty = eligible.reduce((s, i) => s + i.quantity, 0)

  if (d.minOrderValue && subtotal < d.minOrderValue) {
    throw new CouponError(`الحد الأدنى للطلب لاستخدام هذا الكوبون ${d.minOrderValue} ج.م`)
  }
  if (d.minQuantity && eligibleQty < d.minQuantity) {
    throw new CouponError(`يجب أن تحتوي السلة على ${d.minQuantity} قطع على الأقل`)
  }

  let amount = 0
  if (d.type === 'percentage') {
    amount = eligibleSubtotal * d.value / 100
    if (d.maxValue) amount = Math.min(amount, d.maxValue)
  } else if (d.type === 'fixed') {
    amount = Math.min(d.value, eligibleSubtotal)
  }

  return {
    code: d.code,
    name: d.name,
    type: d.type,
    discountAmount: round(amount),
    freeShipping: d.type === 'free_shipping'
  }
}

// Active automatic "free shipping" discount that applies to the whole store
function hasAutomaticFreeShipping(discounts: Discount[], subtotal: number) {
  return discounts.some(d =>
    d.method === 'automatic' &&
    d.type === 'free_shipping' &&
    d.scope === 'all' &&
    d.customerEligibility === 'all' &&
    effectiveDiscountStatus(d) === 'active' &&
    subtotal >= (d.minOrderValue ?? 0)
  )
}

// ---------- Shipping ----------

export interface ShippingOption {
  id: string
  name: string
  duration: string
  cost: number
  description?: string
  estimatedDays?: number // processing + max delivery days
}

const daysLabel = (n: number) => {
  if (n === 1) return 'يوم عمل واحد'
  if (n === 2) return 'يومي عمل'
  if (n <= 10) return `${n} أيام عمل`
  return `${n} يوم عمل`
}

function formatDuration(minDays: number, maxDays: number) {
  if (maxDays === 0) return 'في نفس اليوم'
  if (minDays === maxDays) return `خلال ${daysLabel(maxDays)}`
  return `خلال ${minDays} إلى ${daysLabel(maxDays)}`
}

function rateCost(rate: ShippingRate, subtotal: number, weightKg: number) {
  if (rate.type === 'free') return 0
  if (rate.freeAbove != null && subtotal >= rate.freeAbove) return 0
  if (rate.type === 'weight') {
    const extraKg = Math.max(0, Math.ceil(weightKg - (rate.includedKg ?? 0)))
    return rate.price + extraKg * (rate.pricePerKg ?? 0)
  }
  return rate.price
}

export function quoteShipping(
  shipping: ShippingData,
  discounts: Discount[],
  governorate: string,
  subtotal: number,
  itemsCount: number
): ShippingOption[] {
  const { zones, settings } = shipping
  const zone = zones.find(z => z.isActive && z.regions.includes(governorate))
  if (!zone) return []

  const weightKg = itemsCount * settings.defaultWeightKg
  const freeShipping = hasAutomaticFreeShipping(discounts, subtotal)

  const options: ShippingOption[] = zone.rates.map(rate => {
    const cost = freeShipping ? 0 : rateCost(rate, subtotal, weightKg)
    return {
      id: rate.id,
      name: rate.name,
      cost,
      duration: settings.showDeliveryEstimate
        ? formatDuration(rate.minDays + settings.processingDays, rate.maxDays + settings.processingDays)
        : '',
      description: cost === 0 && rate.type !== 'free' ? 'شحن مجاني لطلبك' : undefined,
      estimatedDays: rate.maxDays + settings.processingDays
    }
  })

  if (settings.localPickupEnabled) {
    options.push({
      id: 'pickup',
      name: 'استلام من الفرع',
      cost: 0,
      duration: settings.localPickupAddress || 'من مقر المتجر'
    })
  }

  return options
}

// Governorates the store currently delivers to (active zones only)
export const coveredGovernorates = (shipping: ShippingData) =>
  [...new Set(shipping.zones.filter(z => z.isActive).flatMap(z => z.regions))]

// ---------- Payments ----------

export interface StorefrontPaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  isDefault: boolean
}

const PAYMENT_PRESENTATION: Record<PaymentMethodType, { description: string, icon: string }> = {
  cod: { description: 'ادفع نقداً عند استلام طلبك', icon: 'Banknote' },
  card: { description: 'Visa / Mastercard', icon: 'CreditCard' },
  wallet: { description: 'فودافون كاش - أورانج كاش - اتصالات كاش', icon: 'Wallet' },
  bank_transfer: { description: 'حوّل المبلغ إلى حساب المتجر البنكي', icon: 'Landmark' },
  other: { description: '', icon: 'CreditCard' }
}

const OFFLINE_TYPES: PaymentMethodType[] = ['cod', 'bank_transfer']

export function availablePaymentMethods(payments: PaymentsData): StorefrontPaymentMethod[] {
  const connectedProviders = new Set(
    payments.gateways.filter(g => g.status === 'connected').map(g => g.providerName)
  )

  return payments.methods
    .filter(m => m.status === 'active')
    .filter(m => OFFLINE_TYPES.includes(m.type) || payments.settings.enableElectronicPayments)
    // Online methods need their gateway to be connected
    .filter(m => !m.provider || connectedProviders.has(m.provider))
    .sort((a, b) => a.order - b.order)
    .map(m => ({
      id: m.id,
      name: m.name,
      ...PAYMENT_PRESENTATION[m.type],
      isDefault: m.isDefault
    }))
}
