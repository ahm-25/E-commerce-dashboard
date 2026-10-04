import type { SavedProduct } from '~/stores/products'

// Saves the editor data; storefront stats (rating, sold...) are kept
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const saved = await readBody<SavedProduct>(event)
  const products = await readCollection('products')

  const index = products.findIndex(p => p.id === id)
  if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'المنتج غير موجود' } })

  const current = products[index]!
  const product: StoredProduct = { ...current, ...saved, id: current.id, updatedAt: new Date().toISOString() }
  ensureUniqueSlug(product, products)

  products[index] = product
  await writeCollection('products', products)
  return product
})
