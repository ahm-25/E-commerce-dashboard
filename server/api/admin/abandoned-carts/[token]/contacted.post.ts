// The merchant reached out (WhatsApp / call)
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  const [carts, products] = await Promise.all([readCollection('carts'), readCollection('products')])
  const cart = carts.find(c => c.token === token)
  if (!cart) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'السلة غير موجودة' } })

  cart.contactedAt = new Date().toISOString()
  cart.contactCount += 1
  await writeCollection('carts', carts)
  return toAdminCart(cart, products)
})
