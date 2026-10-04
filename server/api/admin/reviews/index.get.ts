// All reviews, newest first (filtering happens in the dashboard store)
export default defineEventHandler(async () => {
  const [reviews, products] = await Promise.all([readCollection('reviews'), readCollection('products')])
  return [...reviews]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(r => toAdminReview(r, products))
})
