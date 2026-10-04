// Guest order tracking: GET /orders/track?orderNumber=10482&phone=01012345678
// Both must match, so an order number alone (printed on invoices, shared on WhatsApp) isn't enough.
// TODO: rate-limit by IP on the real backend to stop phone/number guessing
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const number = String(query.orderNumber ?? '').replace(/\D/g, '')
  const phone = normalizePhone(String(query.phone ?? ''))
  if (!number || phone.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Bad request', data: { message: 'أدخل رقم الطلب ورقم الموبايل' } })
  }

  const order = (await readCollection('orders')).find(o =>
    o.orderNumber.replace(/\D/g, '') === number &&
    [o.customer.phone, o.shipping?.address?.phone].some(p => p && normalizePhone(p) === phone)
  )
  // Same answer for a wrong number and a wrong phone
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'لم نجد طلباً بهذه البيانات. تأكد من رقم الطلب ورقم الموبايل المستخدم في الطلب.' } })
  return toStorefrontOrder(order)
})
