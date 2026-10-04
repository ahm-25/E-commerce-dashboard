// Sub-categories move up to the top level; products become uncategorised
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const [categories, products] = await Promise.all([readCollection('categories'), readCollection('products')])

  const remaining = categories
    .filter(c => c.id !== id)
    .map(c => (c.parentId === id ? { ...c, parentId: null, type: 'main' as const } : c))
  for (const p of products.filter(p => p.form.categoryId === id)) {
    p.form.categoryId = null
    p.categoryName = null
  }

  await writeCollection('products', products)
  await writeCollection('categories', remaining)
  return { ok: true }
})
