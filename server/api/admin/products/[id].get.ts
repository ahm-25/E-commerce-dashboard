export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const product = (await readCollection('products')).find(p => p.id === id)
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'المنتج غير موجود' } })
  return product
})
