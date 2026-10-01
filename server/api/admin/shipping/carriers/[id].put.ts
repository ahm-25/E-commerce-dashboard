import type { ShippingCarrier } from '~/stores/shipping'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<ShippingCarrier>>(event)
  const shipping = await readCollection('shipping')

  const carrier = shipping.carriers.find(c => c.id === id)
  if (!carrier) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'شركة الشحن غير موجودة' } })
  Object.assign(carrier, body, { id: carrier.id })

  await writeCollection('shipping', shipping)
  return carrier
})
