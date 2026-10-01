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

  await writeCollection('orders', [...orders, order])
  return order
})
