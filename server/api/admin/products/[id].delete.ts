export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const products = await readCollection('products')
  await writeCollection('products', products.filter(p => p.id !== id))
  return { ok: true }
})
