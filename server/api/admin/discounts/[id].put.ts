import type { Discount } from '~/stores/discounts'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = normalizeDiscountInput(await readBody<Partial<Discount>>(event))
  const discounts = await readCollection('discounts')

  const index = discounts.findIndex(d => d.id === id)
  if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الخصم غير موجود' } })

  if (body.method === 'coupon' && discounts.some(d => d.id !== id && d.code.toUpperCase() === body.code?.toUpperCase())) {
    throw createError({ statusCode: 409, statusMessage: 'Duplicate code', data: { message: 'كود الخصم مستخدم بالفعل' } })
  }

  // id and usage count are owned by the server
  const current = discounts[index]!
  const updated = { ...current, ...body, id: current.id, usageCount: current.usageCount } as Discount
  discounts[index] = updated
  await writeCollection('discounts', discounts)
  return withEffectiveStatus(updated)
})
