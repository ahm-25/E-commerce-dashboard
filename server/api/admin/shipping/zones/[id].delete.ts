export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const shipping = await readCollection('shipping')
  shipping.zones = shipping.zones.filter(z => z.id !== id)
  await writeCollection('shipping', shipping)
  return { ok: true }
})
