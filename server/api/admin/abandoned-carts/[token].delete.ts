export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  const carts = await readCollection('carts')
  if (!carts.some(c => c.token === token)) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'السلة غير موجودة' } })
  await writeCollection('carts', carts.filter(c => c.token !== token))
  return { ok: true }
})
