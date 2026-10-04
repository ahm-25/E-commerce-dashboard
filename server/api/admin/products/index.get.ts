// Most recently updated first
export default defineEventHandler(async () => {
  const products = await readCollection('products')
  return [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
})
