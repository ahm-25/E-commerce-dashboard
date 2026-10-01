// GET /api/storefront/orders?customerId=usr_123 — a customer's orders, newest first
// TODO: take the customer from a verified auth token instead of the query once auth is real
export default defineEventHandler(async (event) => {
  const customerId = String(getQuery(event).customerId ?? '')
  if (!customerId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const orders = await readCollection('orders')
  return orders
    .filter(o => o.customer.id === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toStorefrontOrder)
})
