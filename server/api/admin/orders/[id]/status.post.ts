import type { OrderDetails } from '~/stores/orders'

const STATUSES: OrderDetails['status'][] = ['new', 'review', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded']

// { status, note? } — also used for cancel (with the reason as note) and refund
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { status, note } = await readBody<{ status: OrderDetails['status'], note?: string }>(event)
  if (!STATUSES.includes(status)) throw createError({ statusCode: 400, statusMessage: 'Bad status', data: { message: 'حالة غير صالحة' } })

  const orders = await readCollection('orders')
  const order = orders.find(o => o.id === id)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الطلب غير موجود' } })

  applyStatusChange(order, status, note)
  await writeCollection('orders', orders)
  return order
})
