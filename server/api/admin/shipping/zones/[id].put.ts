import type { ShippingZone } from '~/stores/shipping'

// Create or update a zone
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const zone: ShippingZone = { ...(await readBody<ShippingZone>(event)), id }
  const shipping = await readCollection('shipping')

  const index = shipping.zones.findIndex(z => z.id === id)
  if (index === -1) shipping.zones.push(zone)
  else shipping.zones[index] = zone

  await writeCollection('shipping', shipping)
  return zone
})
