// Moderation: { status: 'approved' | 'hidden' | 'rejected' | 'pending' }
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { status } = await readBody<{ status: ReviewStatus }>(event)
  if (!REVIEW_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad status', data: { message: 'حالة غير صالحة' } })
  }

  const [reviews, products] = await Promise.all([readCollection('reviews'), readCollection('products')])
  const review = reviews.find(r => r.id === id)
  if (!review) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'التقييم غير موجود' } })

  review.status = status
  review.updatedAt = new Date().toISOString()
  syncProductRatings(products, reviews, [review.productId])
  await Promise.all([writeCollection('reviews', reviews), writeCollection('products', products)])
  return toAdminReview(review, products)
})
