// Recovery link sent to the customer: the cart's lines with current prices, and their contact
// details to prefill checkout. The token is random and only shared with that customer.
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  const [carts, products] = await Promise.all([readCollection('carts'), readCollection('products')])
  const cart = carts.find(c => c.token === token)
  if (!cart || cart.status !== 'open') {
    throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'رابط السلة غير صالح أو تم إتمام الطلب بالفعل' } })
  }
  return { customer: cart.customer, governorate: cart.governorate, items: resolveCartItems(cart, products) }
})
