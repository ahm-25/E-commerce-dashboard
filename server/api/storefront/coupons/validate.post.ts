// POST /api/storefront/coupons/validate  { code, items: [{ productId, category?, price, quantity }], customerId? }
export default defineEventHandler(async (event) => {
  const body = await readBody<CouponRequest>(event)
  try {
    const [discounts, orders] = await Promise.all([readCollection('discounts'), readCollection('orders')])
    return evaluateCoupon(discounts, body, customerHistory(orders, body.customerId))
  } catch (err) {
    if (err instanceof CouponError) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid coupon', data: { message: err.message } })
    }
    throw err
  }
})
