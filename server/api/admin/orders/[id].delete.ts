export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const orders = await readCollection('orders')
  await writeCollection('orders', orders.filter(o => o.id !== id))
  return { ok: true }
})
