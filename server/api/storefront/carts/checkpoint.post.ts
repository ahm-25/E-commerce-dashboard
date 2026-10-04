// Saves the checkout in progress (cart + contact) so the store can follow up if it's abandoned
export default defineEventHandler(async (event) => {
  const input = await readBody<CheckpointInput>(event)
  const carts = await readCollection('carts')
  try {
    const cart = saveCheckpoint(input, carts)
    if (cart) await writeCollection('carts', carts)
    return { saved: !!cart }
  } catch (err) {
    if (err instanceof CartError) throw createError({ statusCode: 422, statusMessage: 'Invalid cart', data: { message: err.message } })
    throw err
  }
})
