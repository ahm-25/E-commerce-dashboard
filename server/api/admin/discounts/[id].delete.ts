export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const discounts = await readCollection('discounts')
  await writeCollection('discounts', discounts.filter(d => d.id !== id))
  return { ok: true }
})
