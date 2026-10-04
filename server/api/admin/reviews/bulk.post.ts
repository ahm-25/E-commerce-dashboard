// Bulk moderation: { ids: string[], status }
export default defineEventHandler(async (event) => {
  const { ids, status } = await readBody<{ ids: string[], status: ReviewStatus }>(event)
  if (!Array.isArray(ids) || !REVIEW_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad request', data: { message: 'طلب غير صالح' } })
  }

  const [reviews, products] = await Promise.all([readCollection('reviews'), readCollection('products')])
  const now = new Date().toISOString()
  const changed = reviews.filter(r => ids.includes(r.id))
  for (const review of changed) {
    review.status = status
    review.updatedAt = now
  }
  syncProductRatings(products, reviews, changed.map(r => r.productId))
  await Promise.all([writeCollection('reviews', reviews), writeCollection('products', products)])
  return changed.map(r => toAdminReview(r, products))
})
