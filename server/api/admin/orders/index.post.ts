import { randomUUID } from 'node:crypto'
import type { OrderDetails } from '~/stores/orders'

// Manual order created from the dashboard (totals are computed by the form)
export default defineEventHandler(async (event) => {
  const input = await readBody<Omit<OrderDetails, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'>>(event)
  const orders = await readCollection('orders')

  const now = new Date().toISOString()
  const order: OrderDetails = {
    ...input,
    id: randomUUID(),
    orderNumber: nextOrderNumber(orders),
    timeline: [{ id: 't1', status: input.status, timestamp: now, icon: 'ph:check-circle', actor: 'إنشاء يدوي من لوحة التحكم' }],
    createdAt: now,
    updatedAt: now
  }

  // Manual orders take their (simple) products out of stock as well
  const products = await readCollection('products')
  for (const item of order.items) {
    const product = products.find(p => p.id === item.productId)
    if (product?.form.trackInventory && product.form.type === 'simple') {
      changeStock(product, null, s => s - item.quantity)
      product.sold += item.quantity
    }
  }
  await writeCollection('products', products)
  await writeCollection('orders', [...orders, order])
  return order
})
