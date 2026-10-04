import type { Category } from '~/stores/categories'
import type { SavedProduct } from '~/stores/products'
import type { ProductForm } from '~/composables/useProductForm'

// Products are stored in the dashboard editor's shape (form + resolved variants),
// plus a few storefront-only fields. Categories are a flat list (tree built on read).

export interface StoredProduct extends SavedProduct {
  id: string
  brand?: string
  rating: number
  reviewsCount: number
  sold: number
  createdAt: string
  updatedAt: string
}

export type StoredCategory = Omit<Category, 'children' | 'productCount'>

export class StockError extends Error {}

// ---------- Seed: the storefront's bag catalog ----------

const IMG = {
  handbag: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop',
  handbag2: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
  shoulder: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  crossbody: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  evening: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
  tote: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
}

export const seedCategories = (): StoredCategory[] => {
  const at = '2026-01-10T10:00:00.000Z'
  const cat = (id: string, name: string, slug: string, image: string, sortOrder: number, description: string): StoredCategory => ({
    id, name, slug, image, description, parentId: null, status: 'visible', sortOrder, type: 'main', createdAt: at, updatedAt: at
  })
  return [
    cat('cat-handbags', 'حقائب يد', 'handbags', IMG.handbag, 1, 'حقائب يد أنيقة لكل يوم'),
    cat('cat-shoulder', 'حقائب كتف', 'shoulder-bags', IMG.shoulder, 2, 'حقائب كتف وكروس عملية'),
    cat('cat-backpacks', 'حقائب ظهر', 'backpacks', IMG.backpack, 3, 'حقائب ظهر للعمل والسفر'),
    cat('cat-evening', 'حقائب مسائية', 'evening-bags', IMG.evening, 4, 'حقائب سهرة ومناسبات'),
    cat('cat-accessories', 'إكسسوارات', 'accessories', IMG.wallet, 5, 'محافظ وإكسسوارات جلدية')
  ]
}

interface SeedProduct {
  id: string
  name: string
  slug: string
  categoryId: string
  price: number
  compareAtPrice?: number
  images: string[]
  brand: string
  rating: number
  reviewsCount: number
  sold: number
  daysOld: number
  stock?: number                 // simple products
  colors?: [string, number][]     // variable products: color -> stock per size
  sizes?: string[]
  description?: string
}

const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(seedCategories().map(c => [c.id, c.name]))

function buildSeedProduct(s: SeedProduct): StoredProduct {
  const isVariable = !!s.colors?.length
  const options = isVariable
    ? [
        { id: 'opt-color', name: 'اللون', values: s.colors!.map(([c]) => c) },
        ...(s.sizes?.length ? [{ id: 'opt-size', name: 'المقاس', values: s.sizes }] : [])
      ]
    : []

  const combos: Record<string, string>[] = []
  if (isVariable) {
    for (const [color] of s.colors!) {
      if (s.sizes?.length) for (const size of s.sizes) combos.push({ 'opt-color': color, 'opt-size': size })
      else combos.push({ 'opt-color': color })
    }
  }
  const stockFor = (values: Record<string, string>) => s.colors!.find(([c]) => c === values['opt-color'])![1]
  const keyFor = (values: Record<string, string>) => options.map(o => `${o.id}=${values[o.id]}`).join('|')

  const form: ProductForm = {
    name: s.name,
    description: s.description ?? 'تجمع هذه الحقيبة بين الأناقة والعملية، مصنوعة من خامات عالية الجودة بتفاصيل متقنة وتصميم عصري يناسب جميع إطلالاتك.',
    shortDescription: '',
    images: s.images.map((url, i) => ({ id: `img${i + 1}`, url, name: s.name })),
    type: isVariable ? 'variable' : 'simple',
    price: s.price,
    compareAtPrice: s.compareAtPrice ?? null,
    cost: Math.round(s.price * 0.55),
    sku: s.id.toUpperCase(),
    trackInventory: true,
    stock: isVariable ? null : s.stock ?? 10,
    lowStockThreshold: 5,
    allowBackorders: false,
    categoryId: s.categoryId,
    tags: [],
    options,
    variants: combos.map(values => ({ key: keyFor(values), values, sku: '', price: null, stock: stockFor(values) })),
    weight: 0.6,
    dimensions: { length: 30, width: 12, height: 22 },
    status: 'published',
    visibility: 'visible',
    seo: { title: '', description: '', slug: s.slug }
  }

  const createdAt = new Date(Date.UTC(2026, 9, 1) - s.daysOld * 86_400_000).toISOString()
  return {
    id: s.id,
    form,
    variants: form.variants.map((v, i) => ({
      key: v.key,
      label: Object.values(v.values).join(' / '),
      sku: `${form.sku}-${i + 1}`,
      price: v.price ?? s.price,
      stock: v.stock ?? 0
    })),
    categoryName: CATEGORY_NAMES[s.categoryId] ?? null,
    brand: s.brand,
    rating: s.rating,
    reviewsCount: s.reviewsCount,
    sold: s.sold,
    createdAt,
    updatedAt: createdAt
  }
}

export const seedProducts = (): StoredProduct[] => ([
  { id: 'p-luxury-leather', name: 'حقيبة يد جلدية فاخرة', slug: 'luxury-leather-bag', categoryId: 'cat-handbags', price: 2499, compareAtPrice: 3499, images: [IMG.handbag, IMG.handbag2, IMG.shoulder], brand: 'Coach', rating: 4.8, reviewsCount: 124, sold: 310, daysOld: 40, colors: [['بيج', 4], ['أسود', 6], ['بني', 2]], sizes: ['صغير', 'متوسط', 'كبير'] },
  { id: 'p-classic-tote', name: 'حقيبة توت كلاسيكية', slug: 'classic-tote', categoryId: 'cat-handbags', price: 1899, images: [IMG.tote, IMG.handbag2], brand: 'Michael Kors', rating: 4.6, reviewsCount: 88, sold: 205, daysOld: 70, colors: [['أسود', 8], ['بيج', 5]] },
  { id: 'p-mini-handbag', name: 'حقيبة يد ميني', slug: 'mini-handbag', categoryId: 'cat-handbags', price: 1350, compareAtPrice: 1650, images: [IMG.handbag2, IMG.handbag], brand: 'Charles & Keith', rating: 4.4, reviewsCount: 41, sold: 96, daysOld: 6, colors: [['وردي', 7], ['أبيض', 3]] },
  { id: 'p-structured-bag', name: 'حقيبة يد مهيكلة', slug: 'structured-handbag', categoryId: 'cat-handbags', price: 3200, images: [IMG.handbag], brand: 'Guess', rating: 4.7, reviewsCount: 33, sold: 54, daysOld: 12, stock: 9 },
  { id: 'p-black-crossbody', name: 'حقيبة كروس سوداء', slug: 'black-crossbody', categoryId: 'cat-shoulder', price: 1899, images: [IMG.crossbody, IMG.shoulder], brand: 'Guess', rating: 4.5, reviewsCount: 67, sold: 240, daysOld: 55, stock: 22 },
  { id: 'p-stylish-shoulder', name: 'حقيبة كتف أنيقة', slug: 'stylish-shoulder-bag', categoryId: 'cat-shoulder', price: 3599, compareAtPrice: 4200, images: [IMG.shoulder, IMG.crossbody], brand: 'Coach', rating: 4.9, reviewsCount: 152, sold: 280, daysOld: 90, colors: [['أسود', 5], ['بني', 4], ['كحلي', 0]], sizes: ['متوسط', 'كبير'] },
  { id: 'p-chain-shoulder', name: 'حقيبة كتف بسلسلة', slug: 'chain-shoulder-bag', categoryId: 'cat-shoulder', price: 2150, images: [IMG.crossbody], brand: 'Charles & Keith', rating: 4.3, reviewsCount: 29, sold: 61, daysOld: 3, stock: 4 },
  { id: 'p-comfort-backpack', name: 'حقيبة ظهر مريحة', slug: 'comfortable-backpack', categoryId: 'cat-backpacks', price: 2799, images: [IMG.backpack], brand: 'Other', rating: 4.6, reviewsCount: 74, sold: 190, daysOld: 120, colors: [['رمادي', 9], ['أسود', 11]] },
  { id: 'p-laptop-backpack', name: 'حقيبة ظهر للابتوب', slug: 'laptop-backpack', categoryId: 'cat-backpacks', price: 1999, compareAtPrice: 2499, images: [IMG.backpack], brand: 'Other', rating: 4.4, reviewsCount: 58, sold: 150, daysOld: 20, stock: 30 },
  { id: 'p-travel-backpack', name: 'حقيبة ظهر للسفر', slug: 'travel-backpack', categoryId: 'cat-backpacks', price: 3450, images: [IMG.backpack], brand: 'Michael Kors', rating: 4.2, reviewsCount: 18, sold: 22, daysOld: 9, stock: 0 },
  { id: 'p-evening-clutch', name: 'حقيبة سهرة كلاتش', slug: 'evening-clutch', categoryId: 'cat-evening', price: 1250, compareAtPrice: 1600, images: [IMG.evening], brand: 'Charles & Keith', rating: 4.8, reviewsCount: 47, sold: 133, daysOld: 15, colors: [['ذهبي', 6], ['فضي', 6], ['أسود', 2]] },
  { id: 'p-pearl-clutch', name: 'كلاتش باللؤلؤ', slug: 'pearl-clutch', categoryId: 'cat-evening', price: 1750, images: [IMG.evening], brand: 'Guess', rating: 4.5, reviewsCount: 12, sold: 30, daysOld: 2, stock: 7 },
  { id: 'p-satin-evening', name: 'حقيبة سهرة ساتان', slug: 'satin-evening-bag', categoryId: 'cat-evening', price: 990, images: [IMG.evening], brand: 'Other', rating: 4.1, reviewsCount: 9, sold: 17, daysOld: 30, stock: 14 },
  { id: 'p-leather-wallet', name: 'محفظة جلدية', slug: 'leather-wallet', categoryId: 'cat-accessories', price: 625, images: [IMG.wallet], brand: 'Coach', rating: 4.7, reviewsCount: 95, sold: 260, daysOld: 100, colors: [['بني', 15], ['أسود', 12]] },
  { id: 'p-card-holder', name: 'حافظة بطاقات', slug: 'card-holder', categoryId: 'cat-accessories', price: 350, compareAtPrice: 450, images: [IMG.wallet], brand: 'Michael Kors', rating: 4.3, reviewsCount: 21, sold: 88, daysOld: 5, stock: 40 },
  { id: 'p-bag-charm', name: 'ميدالية حقيبة', slug: 'bag-charm', categoryId: 'cat-accessories', price: 220, images: [IMG.wallet], brand: 'Other', rating: 4.0, reviewsCount: 6, sold: 12, daysOld: 1, stock: 3 }
] as SeedProduct[]).map(buildSeedProduct)

// ---------- Helpers ----------

export const productSlug = (p: StoredProduct) => p.form.seo.slug || p.id

export const isPublic = (p: StoredProduct) => p.form.status === 'published' && p.form.visibility === 'visible'

export const variantPrice = (p: StoredProduct, key?: string | null) =>
  key ? (p.variants.find(v => v.key === key)?.price ?? p.form.price ?? 0) : (p.form.price ?? 0)

export function availableStock(p: StoredProduct, key?: string | null): number {
  if (!p.form.trackInventory) return Infinity
  if (p.form.type === 'variable') {
    if (key) return p.form.variants.find(v => v.key === key)?.stock ?? 0
    return p.form.variants.reduce((s, v) => s + (v.stock ?? 0), 0)
  }
  return p.form.stock ?? 0
}

// Applies a stock change to the form (source of truth) and the resolved variants copy
export function changeStock(p: StoredProduct, key: string | null | undefined, apply: (current: number) => number) {
  if (p.form.type === 'variable') {
    const v = p.form.variants.find(x => x.key === key)
    if (!v) throw new StockError('الاختيار المطلوب غير موجود')
    v.stock = apply(v.stock ?? 0)
    const resolved = p.variants.find(x => x.key === key)
    if (resolved) resolved.stock = v.stock
  } else {
    p.form.stock = apply(p.form.stock ?? 0)
  }
  p.updatedAt = new Date().toISOString()
}

// ---------- Storefront shape (E-commerce-v2 types/index.ts Product) ----------

const COLOR_HEX: Record<string, string> = {
  'أسود': '#111111', 'أبيض': '#f5f5f5', 'بيج': '#eaddd5', 'بني': '#8b5a2b', 'كحلي': '#1f2a44',
  'رمادي': '#8a8a8a', 'وردي': '#f4b6c2', 'أحمر': '#b91c1c', 'ذهبي': '#d4af37', 'فضي': '#c0c0c0', 'أخضر': '#2f6b3a', 'أزرق': '#2563eb'
}
const isColorOption = (name: string) => /لون|color/i.test(name)
const isSizeOption = (name: string) => /مقاس|حجم|size/i.test(name)

export function toStorefrontCategory(c: StoredCategory, products: StoredProduct[]) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? '',
    description: c.description ?? '',
    productCount: products.filter(p => isPublic(p) && p.form.categoryId === c.id).length
  }
}

export function toStorefrontProduct(p: StoredProduct, categories: StoredCategory[], detailed = false) {
  const f = p.form
  const category = categories.find(c => c.id === f.categoryId)
  const price = f.type === 'variable'
    ? Math.min(...p.variants.map(v => v.price ?? f.price ?? 0), f.price ?? Infinity)
    : f.price ?? 0
  const stock = availableStock(p)
  const discount = f.compareAtPrice && f.compareAtPrice > price ? Math.round((1 - price / f.compareAtPrice) * 100) : 0
  const colorOption = f.options.find(o => isColorOption(o.name))

  const base = {
    id: p.id,
    slug: productSlug(p),
    name: f.name,
    description: f.description,
    images: f.images.map(img => ({ id: img.id, url: img.url, alt: img.name || f.name })),
    price,
    compareAtPrice: f.compareAtPrice ?? undefined,
    currency: 'ج.م',
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    category: category ? { id: category.id, name: category.name, slug: category.slug, image: category.image ?? '' } : undefined,
    stock: Number.isFinite(stock) ? stock : 999,
    isNew: Date.now() - new Date(p.createdAt).getTime() < 14 * 86_400_000,
    badge: discount ? `خصم ${discount}%` : undefined,
    colors: colorOption?.values.map(v => COLOR_HEX[v] ?? '#cccccc'),
    brand: p.brand,
    hasVariants: f.type === 'variable' && f.variants.length > 0
  }
  if (!detailed) return base

  return {
    ...base,
    options: f.options.filter(o => o.name.trim() && o.values.length).map(o => ({
      id: o.id,
      name: o.name,
      type: isColorOption(o.name) ? 'color' : isSizeOption(o.name) ? 'size' : 'button',
      values: o.values.map(v => ({ id: v, label: v, value: isColorOption(o.name) ? (COLOR_HEX[v] ?? '#cccccc') : v }))
    })),
    variants: f.variants.map((v, i) => ({
      id: v.key,
      sku: p.variants[i]?.sku ?? v.sku,
      price: v.price ?? f.price ?? 0,
      compareAtPrice: f.compareAtPrice ?? undefined,
      stock: f.trackInventory ? v.stock ?? 0 : 999,
      options: v.values
    })),
    specifications: [
      category && { name: 'القسم', value: category.name },
      p.brand && p.brand !== 'Other' && { name: 'الماركة', value: p.brand },
      f.weight && { name: 'الوزن', value: `${f.weight} كجم` },
      f.dimensions.length && f.dimensions.width && f.dimensions.height && { name: 'الأبعاد', value: `${f.dimensions.length} × ${f.dimensions.height} × ${f.dimensions.width} سم` }
    ].filter(Boolean),
    reviews: []
  }
}

// ---------- Storefront listing ----------

export interface ProductQuery {
  search?: string
  category?: string
  brands?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  onSale?: boolean
  ids?: string[]
  sort?: string
  page?: number
  perPage?: number
}

export function queryProducts(products: StoredProduct[], categories: StoredCategory[], q: ProductQuery) {
  let list = products.filter(isPublic).map(p => ({ stored: p, view: toStorefrontProduct(p, categories) }))

  if (q.ids?.length) list = list.filter(x => q.ids!.includes(x.view.id))
  if (q.search) {
    const s = q.search.toLowerCase()
    list = list.filter(x => x.view.name.toLowerCase().includes(s) || x.view.description.toLowerCase().includes(s) || x.view.brand?.toLowerCase().includes(s) || x.view.category?.name.includes(q.search!))
  }
  if (q.category) list = list.filter(x => x.view.category?.slug === q.category)
  if (q.brands?.length) list = list.filter(x => x.view.brand && q.brands!.includes(x.view.brand))
  if (q.colors?.length) list = list.filter(x => x.view.colors?.some(c => q.colors!.includes(c)))
  if (q.minPrice) list = list.filter(x => x.view.price >= q.minPrice!)
  if (q.maxPrice) list = list.filter(x => x.view.price <= q.maxPrice!)
  if (q.rating) list = list.filter(x => x.view.rating >= q.rating!)
  if (q.inStock) list = list.filter(x => x.view.stock > 0)
  if (q.onSale) list = list.filter(x => x.view.compareAtPrice && x.view.compareAtPrice > x.view.price)

  const sorters: Record<string, (a: typeof list[number], b: typeof list[number]) => number> = {
    'price-asc': (a, b) => a.view.price - b.view.price,
    'price-desc': (a, b) => b.view.price - a.view.price,
    'rating-desc': (a, b) => b.view.rating - a.view.rating,
    'newest': (a, b) => b.stored.createdAt.localeCompare(a.stored.createdAt),
    'popular': (a, b) => b.stored.sold - a.stored.sold
  }
  list.sort(sorters[q.sort ?? 'popular'] ?? sorters.popular)

  const total = list.length
  const perPage = Math.min(Math.max(q.perPage ?? 12, 1), 100)
  const page = Math.max(q.page ?? 1, 1)
  return { items: list.slice((page - 1) * perPage, page * perPage).map(x => x.view), total, page, perPage }
}

// ---------- Validation ----------

export function ensureUniqueSlug(product: StoredProduct, products: StoredProduct[]) {
  if (!product.form.seo.slug) product.form.seo.slug = product.id
  if (products.some(p => p.id !== product.id && productSlug(p) === product.form.seo.slug)) {
    throw createError({ statusCode: 409, statusMessage: 'Duplicate slug', data: { message: 'رابط المنتج (slug) مستخدم لمنتج آخر' } })
  }
}

export function assertUniqueCategorySlug(slug: string, categories: StoredCategory[], exceptId?: string) {
  if (categories.some(c => c.id !== exceptId && c.slug === slug)) {
    throw createError({ statusCode: 409, statusMessage: 'Duplicate slug', data: { message: 'رابط القسم (slug) مستخدم لقسم آخر' } })
  }
}
