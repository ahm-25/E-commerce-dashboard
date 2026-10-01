import { reactive, computed, watch, provide, inject, type InjectionKey } from 'vue'
import type { Product } from '~/stores/products'
import type { Customer } from '~/stores/customers'
import { useOrdersStore } from '~/stores/orders'
import { useShippingStore, type ShippingRate } from '~/stores/shipping'
import { useStoreSettingsStore } from '~/stores/storeSettings'
import { calculateRateCost } from '~/composables/useShippingFormat'

export interface LineItem {
  productId: string
  name: string
  sku: string
  image?: string
  unitPrice: number
  quantity: number
  stock: number
}

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'الدفع عند الاستلام' },
  { value: 'bank_transfer', label: 'تحويل بنكي' },
  { value: 'cash', label: 'نقداً في المتجر' },
  { value: 'payment_link', label: 'رابط دفع إلكتروني' }
] as const

const CURRENCY = 'ج.م'
const round2 = (v: number) => Math.round(v * 100) / 100

const createManualOrder = () => {
  const shipping = useShippingStore()
  const settings = useStoreSettingsStore()
  const orders = useOrdersStore()

  const form = reactive({
    customerMode: 'existing' as 'existing' | 'new',
    customer: null as Customer | null,
    newCustomer: { name: '', phone: '', email: '' },

    items: [] as LineItem[],

    address: { governorate: '', city: '', street: '' },
    pickup: false,
    rateId: null as string | null,

    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 0,

    paymentMethod: 'cod' as typeof PAYMENT_METHODS[number]['value'],
    paymentStatus: 'pending' as 'pending' | 'paid',
    status: 'new' as 'new' | 'processing',
    internalNote: ''
  })

  // Line items
  const addProduct = (product: Product) => {
    const existing = form.items.find(i => i.productId === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, product.stock)
      return
    }
    form.items.push({
      productId: product.id, name: product.name, sku: product.sku, image: product.image,
      unitPrice: product.price, quantity: 1, stock: product.stock
    })
  }

  const removeItem = (productId: string) => {
    form.items = form.items.filter(i => i.productId !== productId)
  }

  // Pricing
  const subtotal = computed(() => round2(form.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)))

  const discount = computed(() => {
    const value = Number(form.discountValue) || 0
    const amount = form.discountType === 'percentage' ? subtotal.value * Math.min(value, 100) / 100 : value
    return round2(Math.min(Math.max(amount, 0), subtotal.value))
  })

  const weightKg = computed(() => form.items.reduce((s, i) => s + i.quantity * shipping.settings.defaultWeightKg, 0))

  // Rates of the active zone that covers the selected governorate
  const availableRates = computed<ShippingRate[]>(() => {
    if (!form.address.governorate) return []
    const zone = shipping.zones.find(z => z.isActive && z.regions.includes(form.address.governorate))
    return zone?.rates || []
  })

  const selectedRate = computed(() => availableRates.value.find(r => r.id === form.rateId) || null)

  // Pick the zone's first rate when the governorate changes
  watch(availableRates, (rates) => {
    if (!rates.some(r => r.id === form.rateId)) form.rateId = rates[0]?.id ?? null
  })

  // Cash on delivery can't already be paid
  watch(() => form.paymentMethod, (method) => {
    if (method === 'cod') form.paymentStatus = 'pending'
  })

  const shippingCost = computed(() => {
    if (form.pickup || !selectedRate.value) return 0
    return calculateRateCost(selectedRate.value, subtotal.value - discount.value, weightKg.value)
  })

  const tax = computed(() => {
    const s = settings.settings
    if (!s?.taxEnabled) return { amount: 0, rate: 0, included: true }
    const taxable = subtotal.value - discount.value
    const amount = s.pricesIncludeTax ? taxable - taxable / (1 + s.taxRate / 100) : taxable * s.taxRate / 100
    return { amount: round2(amount), rate: s.taxRate, included: s.pricesIncludeTax }
  })

  const total = computed(() =>
    round2(subtotal.value - discount.value + shippingCost.value + (tax.value.included ? 0 : tax.value.amount))
  )

  // Validation: a list of what's still missing, shown next to the save button
  const problems = computed(() => {
    const list: string[] = []
    if (form.customerMode === 'existing' && !form.customer) list.push('اختار العميل')
    if (form.customerMode === 'new') {
      if (!form.newCustomer.name.trim()) list.push('اكتب اسم العميل')
      if (!/^01[0125]\d{8}$/.test(form.newCustomer.phone.trim())) list.push('رقم موبايل العميل غير صحيح')
    }
    if (!form.items.length) list.push('ضيف منتج واحد على الأقل')
    if (form.items.some(i => i.quantity < 1 || i.quantity > i.stock)) list.push('كمية منتج أكبر من المخزون المتاح')
    if (form.items.some(i => !(i.unitPrice >= 0))) list.push('سعر منتج غير صحيح')
    if (!form.pickup) {
      if (!form.address.governorate) list.push('اختار المحافظة')
      else if (!availableRates.value.length) list.push('مفيش شحن مفعّل للمحافظة دي')
      else if (!selectedRate.value) list.push('اختار طريقة الشحن')
      if (!form.address.street.trim()) list.push('اكتب العنوان')
    }
    return list
  })

  const submit = async () => {
    const customer = form.customerMode === 'existing' && form.customer
      ? { id: form.customer.id, name: form.customer.name, email: form.customer.email, phone: form.customer.phone }
      // TODO: The API should create (or match by phone) the customer record
      : { id: `CUS-NEW-${Date.now()}`, name: form.newCustomer.name.trim(), phone: form.newCustomer.phone.trim(), email: form.newCustomer.email.trim() || undefined }

    const paymentLabel = PAYMENT_METHODS.find(m => m.value === form.paymentMethod)!.label
    const now = new Date().toISOString()

    return orders.createManualOrder({
      customer,
      items: form.items.map((i, index) => ({
        id: `i${index + 1}`, name: i.name, sku: i.sku, image: i.image,
        quantity: i.quantity, unitPrice: i.unitPrice, total: round2(i.unitPrice * i.quantity)
      })),
      pricing: {
        subtotal: subtotal.value,
        discount: discount.value || undefined,
        shipping: shippingCost.value,
        tax: tax.value.amount || undefined,
        total: total.value,
        currency: CURRENCY
      },
      payment: {
        status: form.paymentStatus,
        method: paymentLabel,
        paidAt: form.paymentStatus === 'paid' ? now : undefined
      },
      shipping: {
        address: form.pickup
          ? undefined
          : { name: customer.name, street: form.address.street.trim(), city: form.address.city.trim(), state: form.address.governorate, country: 'مصر' },
        method: form.pickup ? 'استلام من المتجر' : selectedRate.value?.name
      },
      status: form.status,
      notes: form.internalNote.trim()
        ? [{ id: 'n1', authorName: 'فريق المتجر', createdAt: now, content: form.internalNote.trim(), type: 'internal' }]
        : [],
      source: 'لوحة التحكم'
    })
  }

  return {
    form, addProduct, removeItem,
    subtotal, discount, availableRates, selectedRate, shippingCost, tax, total, weightKg,
    problems, submit, currency: CURRENCY
  }
}

type ManualOrder = ReturnType<typeof createManualOrder>
const KEY: InjectionKey<ManualOrder> = Symbol('manualOrder')

// The create page owns the order; its sections read it with useManualOrder()
export const provideManualOrder = () => {
  const order = createManualOrder()
  provide(KEY, order)
  return order
}

export const useManualOrder = () => {
  const order = inject(KEY)
  if (!order) throw new Error('useManualOrder() must be used inside the create-order page')
  return order
}
