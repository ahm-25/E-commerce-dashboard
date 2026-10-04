// Customers can cancel only before the order is being prepared
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { customerId } = await readBody<{ customerId?: string }>(event)

  const orders = await readCollection('orders')
  const order = orders.find(o => o.id === id)
  if (!order || !customerId || order.customer.id !== customerId) {
    throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الطلب غير موجود' } })
  }
  if (order.status !== 'new' && order.status !== 'review') {
    throw createError({ statusCode: 409, statusMessage: 'Too late', data: { message: 'لا يمكن إلغاء الطلب بعد بدء تجهيزه' } })
  }

  order.status = 'cancelled'
  addTimelineEvent(order, 'cancelled', order.customer.name, 'تم الإلغاء بواسطة العميل')
  const products = await readCollection('products')
  restockOrder(order, products)
  await writeCollection('products', products)
  await writeCollection('orders', orders)
  return toStorefrontOrder(order)
})
