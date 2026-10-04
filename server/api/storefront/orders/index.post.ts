// Checkout: validates everything against the dashboard data and stores the order
export default defineEventHandler(async (event) => {
  const input = await readBody<PlaceOrderInput & { cartToken?: string | null }>(event)
  const [orders, discounts, shipping, payments, products, carts] = await Promise.all([
    readCollection('orders'), readCollection('discounts'), readCollection('shipping'), readCollection('payments'), readCollection('products'), readCollection('carts')
  ])

  try {
    const { order, discountId, lines } = placeOrder(input, { orders, discounts, shipping, payments, products })

    reserveStock(lines)
    await writeCollection('products', products)

    if (discountId) {
      const discount = discounts.find(d => d.id === discountId)!
      discount.usageCount += 1
      await writeCollection('discounts', discounts)
    }
    await writeCollection('orders', [...orders, order])
    if (markRecovered(carts, order, input.cartToken)) await writeCollection('carts', carts)

    return toStorefrontOrder(order)
  } catch (err) {
    if (err instanceof OrderError) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid order', data: { message: err.message } })
    }
    throw err
  }
})
