import { randomUUID } from 'node:crypto'
import type { Discount } from '~/stores/discounts'
import type { OrderDetails, OrderItem, OrderTimelineEvent } from '~/stores/orders'
import type { ShippingData, PaymentsData } from './seed'
import type { CustomerHistory, CouponResult } from './storefront'
import type { StoredProduct } from './catalog'

// Orders are stored in the dashboard's OrderDetails shape; the storefront gets
// its own shape through toStorefrontOrder().

export const TAX_RATE = 0.14 // TODO: read from the store settings once they live in the shared store
const CURRENCY = 'ج.م'

type Status = OrderDetails['status']

const round = (n: number) => Math.round(n * 100) / 100

export class OrderError extends Error {}

// ---------- Seed ----------

const SEED_STEPS: Status[] = ['new', 'processing', 'shipped', 'delivered']

function seedTimeline(status: Status, createdAt: string): OrderTimelineEvent[] {
  const start = new Date(createdAt).getTime()
  const at = (i: number) => new Date(start + i * 5 * 3600_000).toISOString()

  if (status === 'cancelled' || status === 'refunded' || status === 'review') {
    return [
      { id: 't1', status: 'new', timestamp: at(0), actor: 'النظام' },
      { id: 't2', status, timestamp: at(1), actor: 'مدير المتجر' }
    ]
  }
  const reached = status === 'completed' ? SEED_STEPS.length : SEED_STEPS.indexOf(status) + 1
  return SEED_STEPS.slice(0, reached).map((s, i) => ({ id: `t${i + 1}`, status: s, timestamp: at(i), actor: i === 0 ? 'النظام' : 'مدير المتجر' }))
}

interface SeedInput {
  number: number
  customer: OrderDetails['customer']
  items: [name: string, price: number, quantity: number][]
  status: Status
  paymentStatus: OrderDetails['payment']['status']
  method: string
  methodType: NonNullable<OrderDetails['payment']['methodType']>
  createdAt: string
  address: { state: string, city: string, street: string }
  shipping?: number
}

function seedOrder(o: SeedInput): OrderDetails {
  const items: OrderItem[] = o.items.map(([name, price, quantity], i) => ({
    id: `i${i + 1}`,
    productId: `p${o.number}-${i + 1}`,
    name,
    sku: `SKU-${o.number}-${i + 1}`,
    quantity,
    unitPrice: price,
    total: price * quantity
  }))
  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const shipping = o.shipping ?? 50
  const tax = round(subtotal * TAX_RATE)

  return {
    id: `seed-${o.number}`,
    orderNumber: `#EDX-${o.number}`,
    customer: o.customer,
    items,
    pricing: { subtotal, shipping, tax, total: round(subtotal + shipping + tax), currency: CURRENCY },
    payment: { status: o.paymentStatus, method: o.method, methodType: o.methodType, paidAt: o.paymentStatus === 'paid' ? o.createdAt : undefined },
    shipping: {
      address: { name: o.customer.name, country: 'مصر', ...o.address },
      method: 'توصيل عادي',
      trackingNumber: ['shipped', 'delivered', 'completed'].includes(o.status) ? `TRK-${o.number}00` : undefined
    },
    status: o.status,
    timeline: seedTimeline(o.status, o.createdAt),
    notes: [],
    source: 'المتجر الإلكتروني',
    createdAt: o.createdAt,
    updatedAt: o.createdAt
  }
}

// The storefront's demo account (E-commerce-v2 authService mock user)
const DEMO_CUSTOMER = { id: 'usr_123', name: 'أحمد محمود', email: 'user@example.com', phone: '01012345678' }

export const seedOrders = (): OrderDetails[] => [
  seedOrder({ number: 10482, customer: DEMO_CUSTOMER, items: [['حقيبة يد جلدية أنيقة', 1200, 1], ['محفظة جلدية', 625, 2]], status: 'processing', paymentStatus: 'paid', method: 'البطاقات الائتمانية', methodType: 'card', createdAt: '2026-09-26T10:24:00Z', address: { state: 'القاهرة', city: 'مدينة نصر', street: 'شارع مكرم عبيد، عمارة 15' } }),
  seedOrder({ number: 10481, customer: { id: 'c2', name: 'محمد علي', phone: '01012345679' }, items: [['ساعة يد كلاسيكية', 850, 1]], status: 'shipped', paymentStatus: 'pending', method: 'الدفع عند الاستلام', methodType: 'cod', createdAt: '2026-09-26T07:10:00Z', address: { state: 'الجيزة', city: 'الدقي', street: 'شارع التحرير 22' } }),
  seedOrder({ number: 10480, customer: { id: 'c3', name: 'سارة أحمد', email: 'sara@example.com' }, items: [['فستان صيفي', 875, 2]], status: 'delivered', paymentStatus: 'paid', method: 'البطاقات الائتمانية', methodType: 'card', createdAt: '2026-09-25T15:00:00Z', address: { state: 'الإسكندرية', city: 'سموحة', street: 'شارع فوزي معاذ 8' } }),
  seedOrder({ number: 10479, customer: { id: 'c4', name: 'علي حسن', email: 'ali@example.com' }, items: [['حذاء رياضي', 640, 5]], status: 'review', paymentStatus: 'refunded', method: 'المحافظ الإلكترونية', methodType: 'wallet', createdAt: '2026-09-25T09:30:00Z', address: { state: 'الدقهلية', city: 'المنصورة', street: 'شارع الجمهورية 3' } }),
  seedOrder({ number: 10478, customer: DEMO_CUSTOMER, items: [['نظارة شمسية', 645, 1]], status: 'delivered', paymentStatus: 'paid', method: 'الدفع عند الاستلام', methodType: 'cod', createdAt: '2026-09-18T12:00:00Z', address: { state: 'القاهرة', city: 'مدينة نصر', street: 'شارع مكرم عبيد، عمارة 15' } }),
  seedOrder({ number: 10477, customer: { id: 'c6', name: 'خالد إبراهيم', email: 'khaled@example.com' }, items: [['سماعات لاسلكية', 1320, 1]], status: 'cancelled', paymentStatus: 'pending', method: 'الدفع عند الاستلام', methodType: 'cod', createdAt: '2026-09-24T18:45:00Z', address: { state: 'الشرقية', city: 'الزقازيق', street: 'شارع الجلاء 11' } }),
  seedOrder({ number: 10476, customer: { id: 'c7', name: 'مريم ياسر', email: 'mariam@example.com' }, items: [['حقيبة ظهر', 745, 4]], status: 'new', paymentStatus: 'failed', method: 'البطاقات الائتمانية', methodType: 'card', createdAt: '2026-09-23T08:15:00Z', address: { state: 'الغربية', city: 'طنطا', street: 'شارع البحر 40' } })
]

// ---------- Helpers ----------

export function nextOrderNumber(orders: OrderDetails[]) {
  const max = Math.max(10000, ...orders.map(o => Number(o.orderNumber.replace(/\D/g, '')) || 0))
  return `#EDX-${max + 1}`
}

// Previous (non-cancelled) orders of a customer, for coupon rules
export function customerHistory(orders: OrderDetails[], customerId?: string | null): CustomerHistory {
  if (!customerId) return { ordersCount: 0, usedCodes: [] }
  const mine = orders.filter(o => o.customer.id === customerId && o.status !== 'cancelled')
  return {
    ordersCount: mine.length,
    usedCodes: mine.map(o => o.couponCode?.toUpperCase()).filter((c): c is string => !!c)
  }
}

export function addTimelineEvent(order: OrderDetails, status: string, actor: string, note?: string) {
  const now = new Date().toISOString()
  order.timeline.push({ id: `t${Date.now()}${Math.floor(Math.random() * 100)}`, status, timestamp: now, actor, note })
  order.updatedAt = now
  order.updateCount = (order.updateCount || 0) + 1
}

// Status change from the dashboard (also handles cancel / refund side effects)
export function applyStatusChange(order: OrderDetails, status: Status, note?: string) {
  order.status = status
  addTimelineEvent(order, status, 'مدير المتجر', note)

  if (status === 'refunded' && order.payment.status === 'paid') {
    order.payment.status = 'refunded'
  }
  // Cash on delivery is collected when the order is delivered
  if ((status === 'delivered' || status === 'completed') && order.payment.methodType === 'cod' && order.payment.status === 'pending') {
    order.payment.status = 'paid'
    order.payment.paidAt = new Date().toISOString()
    addTimelineEvent(order, 'paid', 'تحصيل عند الاستلام')
  }
}

// ---------- Placing an order from the storefront ----------

export interface PlaceOrderInput {
  customerId?: string | null
  customer: { name: string, phone: string, email?: string }
  shippingAddress: { governorate: string, city: string, region?: string, addressDetails: string }
  shippingMethodId: string
  paymentMethodId: string
  orderNotes?: string
  couponCode?: string | null
  // Only productId / variantId / quantity are used: name, price and image come from the catalog
  items: { productId: string, variantId?: string | null, quantity: number }[]
}

export interface PlaceOrderContext {
  products: StoredProduct[]
  orders: OrderDetails[]
  discounts: Discount[]
  shipping: ShippingData
  payments: PaymentsData
}

// One order line resolved against the catalog
interface ResolvedLine {
  product: StoredProduct
  variantKey: string | null
  productId: string
  slug: string
  name: string
  image?: string
  color?: string
  size?: string
  price: number
  quantity: number
}

function resolveLines(input: PlaceOrderInput['items'], products: StoredProduct[]): ResolvedLine[] {
  const raw = input ?? []
  if (raw.length === 0 || raw.some(i => !i || !Number.isInteger(i.quantity) || i.quantity < 1)) {
    throw new OrderError('السلة فارغة أو تحتوي على منتجات غير صالحة')
  }

  // Same product/variant on several lines counts once for the stock check
  const requested = new Map<string, number>()
  const lines = raw.map(i => {
    const product = products.find(p => p.id === i.productId)
    if (!product || !isPublic(product)) throw new OrderError('أحد المنتجات في السلة لم يعد متاحاً')

    const variantKey = product.form.type === 'variable' ? (i.variantId ?? null) : null
    const variant = variantKey ? product.form.variants.find(v => v.key === variantKey) : null
    if (product.form.type === 'variable' && !variant) throw new OrderError(`اختر اللون/المقاس لمنتج "${product.form.name}"`)

    const optionValue = (re: RegExp) => {
      const option = product.form.options.find(o => re.test(o.name))
      return option && variant ? variant.values[option.id] : undefined
    }
    const key = `${product.id}|${variantKey ?? ''}`
    requested.set(key, (requested.get(key) ?? 0) + i.quantity)

    return {
      product,
      variantKey,
      productId: product.id,
      slug: productSlug(product),
      name: product.form.name,
      image: product.form.images[0]?.url,
      color: optionValue(/لون|color/i),
      size: optionValue(/مقاس|حجم|size/i),
      price: variantPrice(product, variantKey),
      quantity: i.quantity
    }
  })

  for (const line of lines) {
    const wanted = requested.get(`${line.productId}|${line.variantKey ?? ''}`)!
    const available = availableStock(line.product, line.variantKey)
    if (!line.product.form.allowBackorders && wanted > available) {
      throw new OrderError(available > 0
        ? `الكمية المتاحة من "${line.name}" هي ${available} فقط`
        : `"${line.name}" غير متوفر حالياً`)
    }
  }
  return lines
}

// Totals are recomputed here from the catalog: the client's numbers are never trusted.
export function placeOrder(input: PlaceOrderInput, ctx: PlaceOrderContext): { order: OrderDetails, discountId?: string, lines: ResolvedLine[] } {
  const items = resolveLines(input.items, ctx.products)
  if (!input.customer?.name?.trim() || !input.customer?.phone?.trim()) throw new OrderError('يرجى إدخال الاسم ورقم الهاتف')
  const address = input.shippingAddress
  if (!address?.governorate || !address.city?.trim() || !address.addressDetails?.trim()) throw new OrderError('يرجى إدخال عنوان الشحن كاملاً')

  const subtotal = round(items.reduce((s, i) => s + i.price * i.quantity, 0))
  const itemsCount = items.reduce((s, i) => s + i.quantity, 0)

  const shippingOption = quoteShipping(ctx.shipping, ctx.discounts, address.governorate, subtotal, itemsCount)
    .find(o => o.id === input.shippingMethodId)
  if (!shippingOption) throw new OrderError('طريقة الشحن المختارة غير متاحة لهذه المحافظة')

  const paymentMethod = availablePaymentMethods(ctx.payments).find(m => m.id === input.paymentMethodId)
  const paymentRecord = ctx.payments.methods.find(m => m.id === input.paymentMethodId)
  if (!paymentMethod || !paymentRecord) throw new OrderError('طريقة الدفع المختارة غير متاحة')

  let coupon: CouponResult | null = null
  let discountId: string | undefined
  if (input.couponCode) {
    try {
      coupon = evaluateCoupon(
        ctx.discounts,
        { code: input.couponCode, items: items.map(i => ({ productId: i.productId, category: i.product.categoryName ?? undefined, price: i.price, quantity: i.quantity })), customerId: input.customerId },
        customerHistory(ctx.orders, input.customerId)
      )
      discountId = ctx.discounts.find(d => d.method === 'coupon' && d.code.toUpperCase() === coupon!.code.toUpperCase())?.id
    } catch (err) {
      if (err instanceof CouponError) throw new OrderError(`كود الخصم: ${err.message}`)
      throw err
    }
  }

  const discount = Math.min(coupon?.discountAmount ?? 0, subtotal)
  const shippingCost = coupon?.freeShipping ? 0 : shippingOption.cost
  const tax = round((subtotal - discount) * TAX_RATE)
  const total = round(subtotal - discount + shippingCost + tax)

  const now = new Date()
  const estimatedDelivery = shippingOption.estimatedDays != null
    ? new Date(now.getTime() + shippingOption.estimatedDays * 86_400_000).toISOString()
    : undefined
  const customerId = input.customerId || `guest-${randomUUID().slice(0, 8)}`

  const order: OrderDetails = {
    id: randomUUID(), // unguessable: the confirmation page is reachable by id
    orderNumber: nextOrderNumber(ctx.orders),
    customer: {
      id: customerId,
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      email: input.customer.email?.trim() || undefined
    },
    items: items.map((i, index) => ({
      id: `i${index + 1}`,
      productId: i.productId,
      variantKey: i.variantKey ?? undefined,
      slug: i.slug,
      name: i.name,
      sku: i.product.variants.find(v => v.key === i.variantKey)?.sku ?? i.product.form.sku,
      image: i.image,
      color: i.color,
      size: i.size,
      variant: [i.color && `اللون: ${i.color}`, i.size && `المقاس: ${i.size}`].filter(Boolean).join(' | ') || undefined,
      quantity: i.quantity,
      unitPrice: i.price,
      total: round(i.price * i.quantity)
    })),
    pricing: { subtotal, discount: discount || undefined, shipping: shippingCost, tax, total, currency: CURRENCY },
    payment: { status: 'pending', method: paymentMethod.name, methodType: paymentRecord.type },
    shipping: {
      address: {
        name: input.customer.name.trim(),
        phone: input.customer.phone.trim(),
        street: address.addressDetails.trim(),
        region: address.region?.trim() || undefined,
        city: address.city.trim(),
        state: address.governorate,
        country: 'مصر'
      },
      method: shippingOption.name,
      estimatedDelivery
    },
    status: 'new',
    timeline: [{ id: 't1', status: 'new', timestamp: now.toISOString(), actor: 'المتجر الإلكتروني' }],
    notes: input.orderNotes?.trim()
      ? [{ id: 'n1', authorName: input.customer.name.trim(), createdAt: now.toISOString(), content: input.orderNotes.trim(), type: 'customer' }]
      : [],
    source: 'المتجر الإلكتروني',
    couponCode: coupon?.code,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }

  return { order, discountId, lines: items }
}

// Takes the ordered quantities out of stock (and counts them as sold)
export function reserveStock(lines: ResolvedLine[]) {
  for (const line of lines) {
    if (line.product.form.trackInventory) changeStock(line.product, line.variantKey, s => s - line.quantity)
    line.product.sold += line.quantity
  }
}

// Puts a cancelled order's items back in stock
export function restockOrder(order: OrderDetails, products: StoredProduct[]) {
  for (const item of order.items) {
    const product = products.find(p => p.id === item.productId)
    if (!product || !product.form.trackInventory) continue
    try {
      changeStock(product, item.variantKey, s => s + item.quantity)
      product.sold = Math.max(0, product.sold - item.quantity)
    } catch {
      // The variant was removed from the product since; nothing to restock
    }
  }
}

// ---------- Storefront shape (E-commerce-v2 types/order.ts) ----------

const STOREFRONT_STATUS: Record<Status, string> = {
  new: 'pending',
  review: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  completed: 'delivered',
  cancelled: 'cancelled',
  refunded: 'returned'
}

const formatDate = (iso?: string) => iso
  ? new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  : undefined

const formatDay = (iso?: string) => iso
  ? new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))
  : undefined

function storefrontTimeline(o: OrderDetails) {
  const eventDate = (...statuses: string[]) => formatDate(o.timeline.find(t => statuses.includes(t.status))?.timestamp)

  const stages = [
    { status: 'pending', title: 'تم استلام الطلب', date: eventDate('new') },
    { status: 'processing', title: 'قيد التجهيز', date: eventDate('processing') },
    { status: 'shipped', title: 'تم الشحن', date: eventDate('shipped') },
    { status: 'delivered', title: 'تم التسليم', date: eventDate('delivered', 'completed') }
  ]

  if (o.status === 'cancelled' || o.status === 'refunded') {
    return [
      { ...stages[0]!, isCompleted: true, isCurrent: false },
      {
        status: STOREFRONT_STATUS[o.status],
        title: o.status === 'cancelled' ? 'تم إلغاء الطلب' : 'تم استرجاع الطلب',
        date: eventDate(o.status),
        isCompleted: true,
        isCurrent: true
      }
    ]
  }

  const rank: Record<string, number> = { new: 0, review: 0, processing: 1, shipped: 2, delivered: 3, completed: 3 }
  const current = rank[o.status] ?? 0
  return stages.map((s, i) => ({ ...s, isCompleted: i < current || (i === current && i === stages.length - 1), isCurrent: i === current }))
}

export function toStorefrontOrder(o: OrderDetails) {
  const address = o.shipping?.address
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt,
    status: STOREFRONT_STATUS[o.status],
    paymentStatus: o.payment.status,
    paymentMethod: o.payment.method ?? '',
    paymentInfo: { method: o.payment.method ?? '', status: o.payment.status, date: o.payment.paidAt },
    shippingMethod: o.shipping?.method ?? '',
    estimatedDelivery: formatDay(o.shipping?.estimatedDelivery),
    items: o.items.map(i => ({
      id: i.id,
      productId: i.productId ?? i.id,
      slug: i.slug ?? '',
      name: i.name,
      image: i.image ?? '',
      price: i.unitPrice,
      quantity: i.quantity,
      color: i.color,
      size: i.size
    })),
    customer: { name: o.customer.name, phone: o.customer.phone ?? '', email: o.customer.email ?? '' },
    shippingAddress: {
      governorate: address?.state ?? '',
      city: address?.city ?? '',
      region: address?.region ?? '',
      addressDetails: address?.street ?? ''
    },
    tracking: o.shipping?.trackingNumber
      ? { carrier: o.shipping.method ?? '', trackingNumber: o.shipping.trackingNumber }
      : undefined,
    timeline: storefrontTimeline(o),
    subtotal: o.pricing.subtotal,
    discount: o.pricing.discount ?? 0,
    shippingCost: o.pricing.shipping ?? 0,
    tax: o.pricing.tax ?? 0,
    total: o.pricing.total,
    notes: o.notes?.find(n => n.type === 'customer')?.content
  }
}
