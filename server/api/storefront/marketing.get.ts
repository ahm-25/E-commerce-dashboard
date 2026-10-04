// Public: WhatsApp button + pixel ids the storefront loads on every page
export default defineEventHandler(async () => toStorefrontMarketing(await readCollection('marketing')))
