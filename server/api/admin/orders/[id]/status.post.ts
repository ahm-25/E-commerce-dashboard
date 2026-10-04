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

  const wasCancelled = order.status === 'cancelled'
  applyStatusChange(order, status, note)

  // Cancelling gives the items back to stock (refunds are restocked from the inventory page)
  if (status === 'cancelled' && !wasCancelled) {
    const products = await readCollection('products')
    restockOrder(order, products)
    await writeCollection('products', products)
  }
  await writeCollection('orders', orders)
  return order
})
