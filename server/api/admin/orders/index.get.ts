// Newest first
export default defineEventHandler(async () => {
  const orders = await readCollection('orders')
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})
