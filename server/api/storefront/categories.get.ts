export default defineEventHandler(async () => {
  const [categories, products] = await Promise.all([readCollection('categories'), readCollection('products')])
  return categories
    .filter(c => c.status === 'visible')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(c => toStorefrontCategory(c, products))
})
