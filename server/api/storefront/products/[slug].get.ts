// Product page: full product (options, variants, specs) + related products from its category
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const [products, categories] = await Promise.all([readCollection('products'), readCollection('categories')])

  const product = products.find(p => isPublic(p) && (productSlug(p) === slug || p.id === slug))
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'المنتج غير موجود' } })

  const related = products
    .filter(p => p.id !== product.id && isPublic(p) && p.form.categoryId === product.form.categoryId)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4)
    .map(p => toStorefrontProduct(p, categories))

  return { product: toStorefrontProduct(product, categories, true), related }
})
