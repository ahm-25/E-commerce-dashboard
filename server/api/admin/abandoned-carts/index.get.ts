// All saved checkouts, most recent activity first
export default defineEventHandler(async () => {
  const [carts, products] = await Promise.all([readCollection('carts'), readCollection('products')])
  return [...carts]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(c => toAdminCart(c, products))
})
