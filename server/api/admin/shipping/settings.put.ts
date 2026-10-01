import type { ShippingSettings } from '~/stores/shipping'

export default defineEventHandler(async (event) => {
  const shipping = await readCollection('shipping')
  shipping.settings = { ...shipping.settings, ...(await readBody<Partial<ShippingSettings>>(event)) }
  await writeCollection('shipping', shipping)
  return shipping.settings
})
