// Order ids are random UUIDs, so knowing the id is what grants access (confirmation page, guests)
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const order = (await readCollection('orders')).find(o => o.id === id)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الطلب غير موجود' } })
  return toStorefrontOrder(order)
})
