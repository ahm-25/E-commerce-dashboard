export default defineEventHandler(async () => {
  const discounts = await readCollection('discounts')
  return discounts.map(withEffectiveStatus)
})
