import type { Discount } from '~/stores/discounts'
import type { OrderDetails } from '~/stores/orders'

// Tiny JSON-file "database" shared by the dashboard and the storefront (which
// reads settings and creates orders). Backed by the `db` storage mount in nuxt.config.ts.
// Swap these helpers for real API/DB calls when the backend is ready.

interface Collections {
  discounts: Discount[]
  shipping: ShippingData
  payments: PaymentsData
  orders: OrderDetails[]
}

const seeds: { [K in keyof Collections]: () => Collections[K] } = {
  discounts: seedDiscounts,
  shipping: seedShipping,
  payments: seedPayments,
  orders: seedOrders
}

export async function readCollection<K extends keyof Collections>(key: K): Promise<Collections[K]> {
  const storage = useStorage('db')
  const stored = await storage.getItem<Collections[K]>(key)
  if (stored) return stored

  const initial = seeds[key]()
  await storage.setItem(key, initial)
  return initial
}

export async function writeCollection<K extends keyof Collections>(key: K, value: Collections[K]) {
  await useStorage('db').setItem(key, value)
  return value
}
