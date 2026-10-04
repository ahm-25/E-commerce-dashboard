// CSV import from the dashboard: { products: ImportProduct[], updateExisting }
export default defineEventHandler(async (event) => {
  const { products: input, updateExisting } = await readBody<{ products: ImportProduct[], updateExisting?: boolean }>(event)
  const [products, categories] = await Promise.all([readCollection('products'), readCollection('categories')])

  const result = importProducts(input, !!updateExisting, products, categories)

  const writes: Promise<unknown>[] = []
  if (result.created || result.updated) writes.push(writeCollection('products', products))
  if (result.categoriesCreated.length) writes.push(writeCollection('categories', categories))
  await Promise.all(writes)
  return result
})
