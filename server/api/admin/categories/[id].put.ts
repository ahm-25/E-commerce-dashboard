import type { CategoryInput } from '~/stores/categories'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const input = await readBody<Partial<CategoryInput>>(event)
  const [categories, products] = await Promise.all([readCollection('categories'), readCollection('products')])

  const index = categories.findIndex(c => c.id === id)
  if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'القسم غير موجود' } })
  if (input.slug) assertUniqueCategorySlug(input.slug, categories, id)
  if (input.parentId === id) throw createError({ statusCode: 400, statusMessage: 'Bad parent', data: { message: 'لا يمكن أن يكون القسم أباً لنفسه' } })

  const current = categories[index]!
  const parentId = input.parentId === undefined ? current.parentId : input.parentId || null
  const category: StoredCategory = { ...current, ...input, id: current.id, parentId, type: parentId ? 'sub' : 'main', updatedAt: new Date().toISOString() }
  categories[index] = category

  // Keep the category name shown on products in sync
  if (input.name && input.name !== current.name) {
    products.filter(p => p.form.categoryId === id).forEach(p => { p.categoryName = input.name! })
    await writeCollection('products', products)
  }
  await writeCollection('categories', categories)
  return { ...category, productCount: products.filter(p => p.form.categoryId === id).length }
})
