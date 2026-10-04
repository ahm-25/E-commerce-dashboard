// Saves the WhatsApp button and tracking pixels
export default defineEventHandler(async (event) => {
  const { settings, error } = validateMarketing(await readBody<MarketingSettings>(event))
  if (error) throw createError({ statusCode: 422, statusMessage: 'Invalid settings', data: { message: error } })
  return writeCollection('marketing', settings)
})
