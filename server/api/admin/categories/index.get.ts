// Flat list with product counts; the dashboard builds the tree
export default defineEventHandler(async () => {
  const [categories, products] = await Promise.all([readCollection('categories'), readCollection('products')])
  return categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(c => ({ ...c, productCount: products.filter(p => p.form.categoryId === c.id).length }))
})
