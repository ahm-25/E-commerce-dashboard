// Inventory adjustment: { variantKey?, type: 'add' | 'subtract' | 'set', quantity }
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { variantKey, type, quantity } = await readBody<{ variantKey?: string | null, type: 'add' | 'subtract' | 'set', quantity: number }>(event)
  if (!Number.isInteger(quantity) || quantity < 0 || !['add', 'subtract', 'set'].includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad adjustment', data: { message: 'كمية غير صالحة' } })
  }

  const products = await readCollection('products')
  const product = products.find(p => p.id === id)
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: 'المنتج غير موجود' } })

  try {
    changeStock(product, variantKey, current =>
      type === 'add' ? current + quantity : type === 'subtract' ? Math.max(0, current - quantity) : quantity
    )
  } catch (err) {
    if (err instanceof StockError) throw createError({ statusCode: 404, statusMessage: 'Not found', data: { message: err.message } })
    throw err
  }

  await writeCollection('products', products)
  return product
})
