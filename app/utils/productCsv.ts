// Product CSV import: parsing, column mapping and row checks (the server checks again).
// One row = one product, or one variant: rows sharing a slug (or a name, when there's no slug)
// are the variants of one product, told apart by their option values.

export interface ImportProduct {
  name: string
  slug?: string
  description?: string
  category?: string
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
  variants?: { values: Record<string, string>, price: number | null, stock: number | null, sku?: string }[]
}

export interface RowIssue {
  row: number // line number in the file (header = 1)
  message: string
}

export interface ParsedImport {
  products: ImportProduct[]
  errors: RowIssue[]   // the row's product is left out
  warnings: RowIssue[] // imported anyway
  rowCount: number
}

type Field = 'name' | 'slug' | 'description' | 'category' | 'brand' | 'price' | 'compareAtPrice' | 'cost' | 'sku' | 'stock'
  | 'images' | 'status' | 'tags' | 'weight' | 'option1Name' | 'option1Value' | 'option2Name' | 'option2Value' | 'option3Name' | 'option3Value'

// Arabic and English headers (case/spacing-insensitive), so files from Excel or other platforms work
const ALIASES: Record<Field, string[]> = {
  name: ['name', 'title', 'product name', 'اسم المنتج', 'الاسم', 'المنتج'],
  slug: ['slug', 'handle', 'url', 'الرابط', 'رابط المنتج'],
  description: ['description', 'body', 'body (html)', 'الوصف', 'وصف المنتج'],
  category: ['category', 'type', 'product type', 'القسم', 'التصنيف'],
  brand: ['brand', 'vendor', 'الماركة', 'العلامة التجارية'],
  price: ['price', 'variant price', 'السعر', 'سعر البيع'],
  compareAtPrice: ['compare_at_price', 'compare at price', 'variant compare at price', 'السعر قبل الخصم', 'السعر الأصلي'],
  cost: ['cost', 'cost per item', 'التكلفة', 'سعر التكلفة'],
  sku: ['sku', 'variant sku', 'كود المنتج', 'رمز المنتج'],
  stock: ['stock', 'quantity', 'inventory', 'variant inventory qty', 'الكمية', 'المخزون'],
  images: ['images', 'image', 'image src', 'الصور', 'الصورة', 'روابط الصور'],
  status: ['status', 'الحالة'],
  tags: ['tags', 'الوسوم', 'الكلمات المفتاحية'],
  weight: ['weight', 'الوزن', 'الوزن (كجم)'],
  option1Name: ['option1_name', 'option1 name', 'اسم الخيار 1'],
  option1Value: ['option1_value', 'option1 value', 'قيمة الخيار 1'],
  option2Name: ['option2_name', 'option2 name', 'اسم الخيار 2'],
  option2Value: ['option2_value', 'option2 value', 'قيمة الخيار 2'],
  option3Name: ['option3_name', 'option3 name', 'اسم الخيار 3'],
  option3Value: ['option3_value', 'option3 value', 'قيمة الخيار 3']
}

const norm = (h: string) => h.replace(/^﻿/, '').trim().toLowerCase().replace(/\s+/g, ' ')

// RFC 4180: quoted cells may contain the delimiter, quotes ("") and line breaks
export function parseCsv(text: string): string[][] {
  text = text.replace(/^﻿/, '')
  const firstLine = text.slice(0, text.search(/\r?\n|$/))
  // Excel in Arabic/European locales saves with ";"
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ','

  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"' && cell === '') quoted = true
    else if (ch === delimiter) { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += ch
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim() !== ''))
}

const toNum = (v: string | undefined): number | null | 'invalid' => {
  const t = (v ?? '').trim().replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/,/g, '')
  if (!t) return null
  const n = Number(t)
  return Number.isFinite(n) && n >= 0 ? n : 'invalid'
}

const STATUS: Record<string, 'published' | 'draft'> = {
  published: 'published', active: 'published', منشور: 'published', نشط: 'published',
  draft: 'draft', مسودة: 'draft', archived: 'draft', مخفي: 'draft'
}

export function parseProductCsv(text: string): ParsedImport {
  const rows = parseCsv(text)
  const result: ParsedImport = { products: [], errors: [], warnings: [], rowCount: Math.max(rows.length - 1, 0) }
  if (rows.length < 2) {
    result.errors.push({ row: 1, message: 'الملف فارغ أو لا يحتوي إلا على صف العناوين' })
    return result
  }

  const header = rows[0]!.map(norm)
  const col = {} as Record<Field, number>
  for (const field of Object.keys(ALIASES) as Field[]) {
    col[field] = header.findIndex(h => ALIASES[field].includes(h))
  }
  if (col.name === -1) {
    result.errors.push({ row: 1, message: 'لم يتم العثور على عمود "اسم المنتج" (name)' })
    return result
  }
  if (col.price === -1) {
    result.errors.push({ row: 1, message: 'لم يتم العثور على عمود "السعر" (price)' })
    return result
  }

  // Rows grouped into products, in file order
  const groups = new Map<string, { row: number, cells: string[] }[]>()
  rows.slice(1).forEach((cells, i) => {
    const get = (f: Field) => (col[f] >= 0 ? cells[col[f]] ?? '' : '').trim()
    const key = (get('slug') || get('name')).toLowerCase()
    if (!key) {
      result.errors.push({ row: i + 2, message: 'الصف بدون اسم منتج' })
      return
    }
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push({ row: i + 2, cells })
  })

  for (const lines of groups.values()) {
    const at = (cells: string[], f: Field) => (col[f] >= 0 ? cells[col[f]] ?? '' : '').trim()
    const first = lines[0]!
    const fail = (row: number, message: string) => result.errors.push({ row, message })
    const name = at(first.cells, 'name')

    // Option names come from the first row that has them (other platforms leave them blank on later rows)
    const optionNames = ([['option1Name', 'option1Value'], ['option2Name', 'option2Value'], ['option3Name', 'option3Value']] as const)
      .map(([n, v]) => ({ name: lines.map(l => at(l.cells, n)).find(Boolean) ?? '', valueField: v }))
      .filter(o => o.name)
    const isVariable = optionNames.length > 0 && lines.some(l => optionNames.some(o => at(l.cells, o.valueField)))

    let broken = false
    const numberAt = (l: typeof first, f: Field, label: string) => {
      const n = toNum(at(l.cells, f))
      if (n === 'invalid') { fail(l.row, `${label} "${at(l.cells, f)}" ليس رقماً صحيحاً`); broken = true; return null }
      return n
    }

    const price = numberAt(first, 'price', 'السعر')
    const compareAtPrice = numberAt(first, 'compareAtPrice', 'السعر قبل الخصم')
    const cost = numberAt(first, 'cost', 'التكلفة')
    const weight = numberAt(first, 'weight', 'الوزن')

    const images = [...new Set(lines.flatMap(l => at(l.cells, 'images').split(/[|\n]/).map(s => s.trim()).filter(Boolean)))]
    const badImage = images.find(u => !/^https?:\/\/\S+$/i.test(u))
    if (badImage) { fail(first.row, `رابط الصورة غير صالح: ${badImage.slice(0, 60)}`); broken = true }

    const statusText = at(first.cells, 'status').toLowerCase()
    const status = statusText ? STATUS[statusText] : 'published'
    if (statusText && !status) result.warnings.push({ row: first.row, message: `حالة غير معروفة "${statusText}"، سيتم نشر المنتج` })

    const product: ImportProduct = {
      name,
      slug: at(first.cells, 'slug') || undefined,
      description: at(first.cells, 'description') || undefined,
      category: at(first.cells, 'category') || undefined,
      brand: at(first.cells, 'brand') || undefined,
      price,
      compareAtPrice,
      cost,
      sku: at(first.cells, 'sku') || undefined,
      images,
      status: status ?? 'published',
      tags: at(first.cells, 'tags').split(/[|,،]/).map(s => s.trim()).filter(Boolean),
      weight
    }

    if (isVariable) {
      product.options = optionNames.map(o => ({ name: o.name, values: [] as string[] }))
      product.variants = []
      const seen = new Set<string>()
      for (const l of lines) {
        const values: Record<string, string> = {}
        for (const o of optionNames) {
          const v = at(l.cells, o.valueField)
          if (!v) { fail(l.row, `قيمة "${o.name}" فارغة`); broken = true }
          values[o.name] = v
          const option = product.options.find(x => x.name === o.name)!
          if (v && !option.values.includes(v)) option.values.push(v)
        }
        const key = optionNames.map(o => values[o.name]).join('|')
        if (seen.has(key)) { fail(l.row, `الاختيار "${key.replace(/\|/g, ' / ')}" مكرر`); broken = true }
        seen.add(key)
        const variantPrice = numberAt(l, 'price', 'السعر')
        if (variantPrice === null && price === null) { fail(l.row, 'السعر مطلوب'); broken = true }
        product.variants.push({ values, price: variantPrice ?? price, stock: numberAt(l, 'stock', 'الكمية') ?? 0, sku: l === first ? undefined : at(l.cells, 'sku') || undefined })
      }
      // The first row's SKU is the product SKU; give its variant the same one only if it's alone
      if (product.variants.length === 1) product.variants[0]!.sku = product.sku
    } else {
      if (lines.length > 1) {
        lines.slice(1).forEach(l => result.warnings.push({ row: l.row, message: `تكرار للمنتج "${name}" بدون خيارات (لون/مقاس)، سيتم تجاهل الصف` }))
      }
      if (price === null && !broken) { fail(first.row, 'السعر مطلوب'); broken = true }
      const stock = numberAt(first, 'stock', 'الكمية')
      if (stock !== null && !Number.isInteger(stock)) { fail(first.row, 'الكمية يجب أن تكون رقماً صحيحاً'); broken = true }
      product.stock = stock ?? 0
    }

    if (compareAtPrice !== null && price !== null && compareAtPrice <= price) {
      result.warnings.push({ row: first.row, message: 'السعر قبل الخصم أقل من أو يساوي السعر، لن يظهر كخصم' })
    }

    if (!broken) result.products.push(product)
  }

  result.errors.sort((a, b) => a.row - b.row)
  result.warnings.sort((a, b) => a.row - b.row)
  return result
}

// Example file with Arabic headers (Excel-friendly)
export const TEMPLATE_HEADERS = ['اسم المنتج', 'الرابط', 'الوصف', 'القسم', 'الماركة', 'السعر', 'السعر قبل الخصم', 'التكلفة', 'كود المنتج', 'الكمية', 'الصور', 'الحالة', 'اسم الخيار 1', 'قيمة الخيار 1', 'اسم الخيار 2', 'قيمة الخيار 2']

export const TEMPLATE_ROWS: string[][] = [
  ['محفظة جلد طبيعي', 'leather-wallet-classic', 'محفظة رجالي جلد طبيعي بـ 8 جيوب', 'إكسسوارات', 'Other', '450', '600', '250', 'WAL-001', '25', 'https://example.com/wallet-1.jpg|https://example.com/wallet-2.jpg', 'منشور', '', '', '', ''],
  ['تيشيرت قطن', 'cotton-tshirt', 'تيشيرت قطن مصري 100%', 'ملابس', '', '299', '', '120', 'TSH-001', '10', 'https://example.com/tshirt.jpg', 'منشور', 'اللون', 'أبيض', 'المقاس', 'M'],
  ['تيشيرت قطن', 'cotton-tshirt', '', '', '', '299', '', '', 'TSH-001-WL', '8', '', '', 'اللون', 'أبيض', 'المقاس', 'L'],
  ['تيشيرت قطن', 'cotton-tshirt', '', '', '', '319', '', '', 'TSH-001-BXL', '0', '', '', 'اللون', 'أسود', 'المقاس', 'XL']
]
