import type { Discount } from '~/stores/discounts'

export default defineEventHandler(async (event) => {
  const body = normalizeDiscountInput(await readBody<Partial<Discount>>(event))
  const discounts = await readCollection('discounts')

  if (body.method === 'coupon' && discounts.some(d => d.code.toUpperCase() === body.code?.toUpperCase())) {
    throw createError({ statusCode: 409, statusMessage: 'Duplicate code', data: { message: 'كود الخصم مستخدم بالفعل' } })
  }

  const nextNumber = Math.max(0, ...discounts.map(d => Number(d.id.replace(/\D/g, '')) || 0)) + 1
  const discount = {
    ...body,
    id: `DSC-${String(nextNumber).padStart(5, '0')}`,
    usageCount: 0,
    status: body.status === 'disabled' ? 'disabled' : 'active'
  } as Discount

  await writeCollection('discounts', [...discounts, discount])
  return withEffectiveStatus(discount)
})
