import type { SavedProduct } from '~/stores/products'

export default defineEventHandler(async (event) => {
  const saved = await readBody<SavedProduct>(event)
  const products = await readCollection('products')

  const id = `p-${Date.now()}`
  const now = new Date().toISOString()
  const product: StoredProduct = { ...saved, id, rating: 0, reviewsCount: 0, sold: 0, createdAt: now, updatedAt: now }
  ensureUniqueSlug(product, products)

  await writeCollection('products', [...products, product])
  return product
})
