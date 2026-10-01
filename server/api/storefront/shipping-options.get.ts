// GET /api/storefront/shipping-options?governorate=...&subtotal=1200&itemsCount=3
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const governorate = String(query.governorate ?? '')
  const subtotal = Number(query.subtotal) || 0
  const itemsCount = Number(query.itemsCount) || 1

  const [shipping, discounts] = await Promise.all([readCollection('shipping'), readCollection('discounts')])
  return quoteShipping(shipping, discounts, governorate, subtotal, itemsCount)
})
