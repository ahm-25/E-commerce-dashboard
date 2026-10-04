import type { OrderDetails } from '~/stores/orders'
import type { StoredProduct } from './catalog'

// A checkout the customer started but didn't finish. The storefront saves it once the customer
// typed a valid phone at checkout (the only way to reach them), keyed by a random token kept
// in their browser. Placing an order marks it recovered.

export interface AbandonedCart {
  token: string
  customerId: string | null
  customer: { name: string, phone: string, email?: string }
  governorate?: string
  items: { productId: string, variantId: string | null, quantity: number }[]
  status: 'open' | 'recovered'
  recoveredOrderId?: string
  recoveredOrderNumber?: string
  contactedAt?: string
  contactCount: number
  createdAt: string
  updatedAt: string
}

export class CartError extends Error {}

// After this long without activity an open checkout counts as abandoned
export const ABANDONED_AFTER_MINUTES = 30

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// ---------- Seed ----------

export const seedAbandonedCarts = (): AbandonedCart[] => {
  const ago = (hours: number) => new Date(Date.UTC(2026, 9, 3, 18) - hours * 3_600_000).toISOString()
  const cart = (n: number, name: string, phone: string, items: AbandonedCart['items'], hours: number, extra: Partial<AbandonedCart> = {}): AbandonedCart => ({
    token: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
    customerId: null,
    customer: { name, phone },
    governorate: 'القاهرة',
    items,
    status: 'open',
    contactCount: 0,
    createdAt: ago(hours + 0.3),
    updatedAt: ago(hours),
    ...extra
  })
  return [
    cart(1, 'ندى السيد', '01098765432', [{ productId: 'p-luxury-leather', variantId: 'opt-color=أسود|opt-size=متوسط', quantity: 1 }], 3),
    cart(2, 'محمود فتحي', '01112223334', [{ productId: 'p-laptop-backpack', variantId: null, quantity: 2 }, { productId: 'p-card-holder', variantId: null, quantity: 1 }], 20, { governorate: 'الجيزة' }),
    cart(3, 'آية حمدي', '01223344556', [{ productId: 'p-evening-clutch', variantId: 'opt-color=ذهبي', quantity: 1 }], 52, { governorate: 'الإسكندرية', contactedAt: ago(30), contactCount: 1 }),
    cart(4, 'شريف عادل', '01556677889', [{ productId: 'p-stylish-shoulder', variantId: 'opt-color=بني|opt-size=كبير', quantity: 1 }], 70, { status: 'recovered', recoveredOrderNumber: '#EDX-10476', contactedAt: ago(60), contactCount: 1 })
  ]
}

// ---------- Storefront ----------

export interface CheckpointInput {
  token: string
  customerId?: string | null
  customer: { name?: string, phone: string, email?: string }
  governorate?: string
  items: { productId: string, variantId?: string | null, quantity: number }[]
}

// Creates or updates the open cart for this token
export function saveCheckpoint(input: CheckpointInput, carts: AbandonedCart[]): AbandonedCart | null {
  if (!TOKEN.test(input?.token ?? '')) throw new CartError('رمز السلة غير صالح')
  const phone = String(input.customer?.phone ?? '').trim()
  if (!/^1[0125]\d{8}$/.test(normalizePhone(phone))) throw new CartError('رقم الموبايل غير صحيح')
  const items = (input.items ?? [])
    .filter(i => i && typeof i.productId === 'string' && Number.isInteger(i.quantity) && i.quantity > 0)
    .slice(0, 50)
    .map(i => ({ productId: i.productId, variantId: i.variantId ?? null, quantity: Math.min(i.quantity, 99) }))

  const now = new Date().toISOString()
  const existing = carts.find(c => c.token === input.token)
  if (existing?.status === 'recovered') return null // the order already went through

  const data = {
    customerId: input.customerId || null,
    customer: {
      name: String(input.customer.name ?? '').trim().slice(0, 80),
      phone,
      email: String(input.customer.email ?? '').trim().slice(0, 120) || undefined
    },
    governorate: input.governorate?.trim() || undefined,
    items
  }

  if (existing) {
    Object.assign(existing, data, { updatedAt: now })
    return existing
  }
  if (!items.length) return null
  const cart: AbandonedCart = { token: input.token, ...data, status: 'open', contactCount: 0, createdAt: now, updatedAt: now }
  carts.push(cart)
  return cart
}

// Called when an order is placed: the cart of this checkout, and older open carts of the same
// phone (started on another device), are now recovered
export function markRecovered(carts: AbandonedCart[], order: OrderDetails, token?: string | null) {
  const phone = normalizePhone(order.customer.phone ?? '')
  let changed = false
  for (const cart of carts) {
    if (cart.status !== 'open') continue
    if ((token && cart.token === token) || (phone && normalizePhone(cart.customer.phone) === phone)) {
      cart.status = 'recovered'
      cart.recoveredOrderId = order.id
      cart.recoveredOrderNumber = order.orderNumber
      cart.updatedAt = new Date().toISOString()
      changed = true
    }
  }
  return changed
}

// Cart lines with current catalog data; lines whose product or variant is gone are skipped
export function resolveCartItems(cart: AbandonedCart, products: StoredProduct[]) {
  return cart.items.flatMap(i => {
    const product = products.find(p => p.id === i.productId)
    if (!product || !isPublic(product)) return []
    const isVariable = product.form.type === 'variable'
    const variant = isVariable ? product.form.variants.find(v => v.key === i.variantId) : null
    if (isVariable && !variant) return []

    const optionValue = (re: RegExp) => {
      const option = product.form.options.find(o => re.test(o.name))
      return option && variant ? variant.values[option.id] : undefined
    }
    const stock = availableStock(product, isVariable ? i.variantId : null)
    return [{
      productId: product.id,
      variantId: isVariable ? i.variantId : null,
      slug: productSlug(product),
      name: product.form.name,
      image: product.form.images[0]?.url ?? '',
      price: variantPrice(product, isVariable ? i.variantId : null),
      compareAtPrice: product.form.compareAtPrice ?? undefined,
      color: optionValue(/لون|color/i),
      size: optionValue(/مقاس|حجم|size/i),
      quantity: i.quantity,
      inStock: product.form.allowBackorders || stock >= i.quantity
    }]
  })
}

// ---------- Dashboard ----------

export function toAdminCart(cart: AbandonedCart, products: StoredProduct[]) {
  const items = resolveCartItems(cart, products)
  const minutesIdle = (Date.now() - new Date(cart.updatedAt).getTime()) / 60_000
  return {
    ...cart,
    items,
    value: Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100,
    itemsCount: items.reduce((s, i) => s + i.quantity, 0),
    // 'active': the customer may still be on the checkout page
    stage: cart.status === 'recovered' ? 'recovered' : minutesIdle < ABANDONED_AFTER_MINUTES ? 'active' : 'abandoned'
  }
}
