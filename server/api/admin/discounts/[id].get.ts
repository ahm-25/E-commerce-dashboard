export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const discount = (await readCollection('discounts')).find(d => d.id === id)
  if (!discount) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الخصم غير موجود' } })
  return withEffectiveStatus(discount)
})
