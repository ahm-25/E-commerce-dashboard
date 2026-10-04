import type { ProductForm } from '~/composables/useProductForm'
import type { StoredProduct, StoredCategory } from './catalog'

// Bulk product import (from the dashboard's CSV import). The dashboard parses and checks the
// file; this checks again and turns each product into the editor's saved shape.

export interface ImportProduct {
  name: string
  slug?: string
  description?: string
  category?: string        // category name; created when it doesn't exist
  brand?: string
  price: number | null
  compareAtPrice?: number | null
  cost?: number | null
  sku?: string
  stock?: number | null
  images?: string[]
  status?: 'published' | 'draft'
  tags?: string[]
  weight?: number | null
  options?: { name: string, values: string[] }[]
  variants?: { values: Record<string, string>, price: number | null, stock: number | null, sku?: string }[] // values keyed by option name
}

export interface ImportResult {
  created: number
  updated: number
  skipped: { name: string, reason: string }[]
  categoriesCreated: string[]
}

const MAX_PRODUCTS = 2000

export const slugify = (text: string) =>
  text.trim().toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const num = (v: unknown) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v))
const isUrl = (u: string) => /^https?:\/\/\S+$/i.test(u)

function problem(p: ImportProduct): string | null {
  if (!p?.name?.trim()) return 'اسم المنتج مطلوب'
  const variable = !!p.options?.length
  const price = num(p.price)
  if (!variable && (price === null || price < 0)) return 'السعر غير صالح'
  if (variable) {
    if (!p.variants?.length) return 'لا توجد اختيارات (variants)'
    if (p.variants.some(v => (num(v.price) ?? price) === null)) return 'سعر أحد الاختيارات غير صالح'
    const keys = p.variants.map(v => p.options!.map(o => v.values[o.name]).join('|'))
    if (new Set(keys).size !== keys.length) return 'يوجد اختيار مكرر بنفس القيم'
  }
  if ((p.images ?? []).some(u => !isUrl(u))) return 'رابط صورة غير صالح'
  return null
}

function buildForm(p: ImportProduct, categoryId: string | null, slug: string, existing?: ProductForm): ProductForm {
  const options = (p.options ?? []).map((o, i) => ({ id: `opt-${i + 1}`, name: o.name.trim(), values: [...new Set(o.values.map(v => v.trim()).filter(Boolean))] }))
  const optionId = (name: string) => options.find(o => o.name === name)!.id
  const variants = options.length
    ? (p.variants ?? []).map(v => {
        const values = Object.fromEntries(Object.entries(v.values).map(([name, value]) => [optionId(name), value.trim()]))
        return {
          key: options.map(o => `${o.id}=${values[o.id]}`).join('|'),
          values,
          sku: v.sku?.trim() ?? '',
          price: num(v.price),
          stock: num(v.stock) ?? 0
        }
      })
    : []
  const images = (p.images ?? []).map((url, i) => ({ id: `img${i + 1}`, url, name: p.name }))

  return {
    name: p.name.trim(),
    description: p.description?.trim() ?? existing?.description ?? '',
    shortDescription: existing?.shortDescription ?? '',
    images: images.length ? images : existing?.images ?? [],
    type: options.length ? 'variable' : 'simple',
    price: num(p.price) ?? (variants[0]?.price ?? null),
    compareAtPrice: num(p.compareAtPrice),
    cost: num(p.cost),
    sku: p.sku?.trim() ?? existing?.sku ?? '',
    trackInventory: true,
    stock: options.length ? null : num(p.stock) ?? 0,
    lowStockThreshold: existing?.lowStockThreshold ?? 5,
    allowBackorders: existing?.allowBackorders ?? false,
    categoryId,
    tags: p.tags?.length ? p.tags : existing?.tags ?? [],
    options,
    variants,
    weight: num(p.weight) ?? existing?.weight ?? null,
    dimensions: existing?.dimensions ?? { length: null, width: null, height: null },
    status: p.status ?? existing?.status ?? 'published',
    visibility: existing?.visibility ?? 'visible',
    seo: { title: existing?.seo.title ?? '', description: existing?.seo.description ?? '', slug }
  }
}

// Same resolution as the editor's save (useProductForm resolvedVariants)
function resolveVariants(form: ProductForm): StoredProduct['variants'] {
  const base = (form.sku.trim() || 'SKU').toUpperCase()
  return form.variants.map((v, i) => ({
    key: v.key,
    label: form.options.map(o => v.values[o.id]).filter(Boolean).join(' / '),
    sku: v.sku.trim() || `${base}-${String(i + 1).padStart(2, '0')}`,
    price: v.price ?? form.price,
    stock: v.stock ?? 0
  }))
}

export function importProducts(input: ImportProduct[], updateExisting: boolean, products: StoredProduct[], categories: StoredCategory[]): ImportResult {
  if (!Array.isArray(input) || input.length === 0) throw createError({ statusCode: 400, statusMessage: 'Empty', data: { message: 'الملف لا يحتوي على منتجات' } })
  if (input.length > MAX_PRODUCTS) throw createError({ statusCode: 400, statusMessage: 'Too many', data: { message: `الحد الأقصى ${MAX_PRODUCTS} منتج في الملف الواحد` } })

  const result: ImportResult = { created: 0, updated: 0, skipped: [], categoriesCreated: [] }
  const now = new Date().toISOString()

  const categoryFor = (name?: string) => {
    const n = name?.trim()
    if (!n) return null
    let category = categories.find(c => c.name.trim().toLowerCase() === n.toLowerCase())
    if (!category) {
      let slug = slugify(n) || `cat-${categories.length + 1}`
      while (categories.some(c => c.slug === slug)) slug += '-1'
      category = { id: `cat-${Date.now()}-${categories.length}`, name: n, slug, image: '', description: '', parentId: null, status: 'visible', sortOrder: categories.length + 1, type: 'main', createdAt: now, updatedAt: now }
      categories.push(category)
      result.categoriesCreated.push(n)
    }
    return category
  }

  input.forEach((p, index) => {
    const error = problem(p)
    if (error) {
      result.skipped.push({ name: p?.name || `منتج رقم ${index + 1}`, reason: error })
      return
    }

    const wantedSlug = slugify(p.slug || '') || slugify(p.name)
    const existing = products.find(x => productSlug(x) === wantedSlug) ??
      (p.sku?.trim() ? products.find(x => x.form.sku && x.form.sku === p.sku!.trim()) : undefined)

    if (existing && !updateExisting) {
      result.skipped.push({ name: p.name, reason: 'منتج بنفس الرابط أو SKU موجود بالفعل' })
      return
    }

    const category = categoryFor(p.category)
    if (existing) {
      const form = buildForm(p, category?.id ?? existing.form.categoryId, productSlug(existing), existing.form)
      Object.assign(existing, { form, variants: resolveVariants(form), categoryName: category?.name ?? existing.categoryName, brand: p.brand?.trim() || existing.brand, updatedAt: now })
      result.updated++
      return
    }

    let slug = wantedSlug || `product-${products.length + 1}`
    for (let n = 2; products.some(x => productSlug(x) === slug); n++) slug = `${wantedSlug}-${n}`
    const form = buildForm(p, category?.id ?? null, slug)
    products.push({
      id: `p-${Date.now()}-${index}`,
      form,
      variants: resolveVariants(form),
      categoryName: category?.name ?? null,
      brand: p.brand?.trim() || undefined,
      rating: 0,
      reviewsCount: 0,
      sold: 0,
      createdAt: now,
      updatedAt: now
    })
    result.created++
  })

  return result
}
