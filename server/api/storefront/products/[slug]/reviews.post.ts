// A customer's review: saved as pending until approved from the dashboard
// TODO: take the customer from a verified auth token instead of the body once auth is real
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const input = await readBody<ReviewInput>(event)
  const [products, reviews, orders] = await Promise.all([readCollection('products'), readCollection('reviews'), readCollection('orders')])

  const product = products.find(p => isPublic(p) && (productSlug(p) === slug || p.id === slug))
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'المنتج غير موجود' } })

  try {
    const review = createReview(input, product, reviews, orders)
    await writeCollection('reviews', [...reviews, review])
    return { id: review.id, status: review.status }
  } catch (err) {
    if (err instanceof ReviewError) throw createError({ statusCode: 422, statusMessage: 'Invalid review', data: { message: err.message } })
    throw err
  }
})
