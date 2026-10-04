import type { CategoryInput } from '~/stores/categories'

export default defineEventHandler(async (event) => {
  const input = await readBody<CategoryInput>(event)
  const categories = await readCollection('categories')
  assertUniqueCategorySlug(input.slug, categories)

  const now = new Date().toISOString()
  const category: StoredCategory = {
    ...input,
    id: `cat-${Date.now()}`,
    parentId: input.parentId || null,
    type: input.parentId ? 'sub' : 'main',
    createdAt: now,
    updatedAt: now
  }
  await writeCollection('categories', [...categories, category])
  return { ...category, productCount: 0 }
})
