// GET /api/storefront/products?search=&category=&brands=a,b&colors=%23111111&minPrice=&maxPrice=&rating=&inStock=1&onSale=1&ids=a,b&sort=popular&page=1&perPage=12
const list = (v: unknown) => (v ? String(v).split(',').filter(Boolean) : undefined)
const num = (v: unknown) => (v === undefined || v === '' ? undefined : Number(v) || undefined)

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const [products, categories] = await Promise.all([readCollection('products'), readCollection('categories')])

  return queryProducts(products, categories, {
    search: q.search ? String(q.search) : undefined,
    category: q.category ? String(q.category) : undefined,
    brands: list(q.brands),
    colors: list(q.colors),
    minPrice: num(q.minPrice),
    maxPrice: num(q.maxPrice),
    rating: num(q.rating),
    inStock: q.inStock === '1' || q.inStock === 'true',
    onSale: q.onSale === '1' || q.onSale === 'true',
    ids: list(q.ids),
    sort: q.sort ? String(q.sort) : undefined,
    page: num(q.page),
    perPage: num(q.perPage)
  })
})
