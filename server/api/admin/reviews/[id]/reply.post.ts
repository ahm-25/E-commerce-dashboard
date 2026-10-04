// Store reply shown under the review on the product page: { content }
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { content, authorName } = await readBody<{ content: string, authorName?: string }>(event)
  if (!content?.trim()) throw createError({ statusCode: 400, statusMessage: 'Empty reply', data: { message: 'اكتب نص الرد' } })

  const [reviews, products] = await Promise.all([readCollection('reviews'), readCollection('products')])
  const review = reviews.find(r => r.id === id)
  if (!review) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'التقييم غير موجود' } })

  const now = new Date().toISOString()
  review.reply = review.reply
    ? { ...review.reply, content: content.trim(), updatedAt: now }
    : { id: `rep-${Date.now()}`, content: content.trim(), createdAt: now, authorName: authorName?.trim() || 'إدارة المتجر' }
  review.updatedAt = now
  await writeCollection('reviews', reviews)
  return toAdminReview(review, products)
})
