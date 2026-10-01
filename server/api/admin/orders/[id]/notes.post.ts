export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { content, type } = await readBody<{ content: string, type: 'internal' | 'customer' }>(event)
  if (!content?.trim()) throw createError({ statusCode: 400, statusMessage: 'Empty note', data: { message: 'الملاحظة فارغة' } })

  const orders = await readCollection('orders')
  const order = orders.find(o => o.id === id)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'الطلب غير موجود' } })

  const note = { id: `n${Date.now()}`, authorName: 'فريق المتجر', createdAt: new Date().toISOString(), content: content.trim(), type }
  order.notes = [note, ...(order.notes ?? [])]
  order.updatedAt = note.createdAt
  await writeCollection('orders', orders)
  return note
})
