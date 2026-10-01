import { ref, reactive, computed, watch, nextTick, provide, inject, type InjectionKey } from 'vue'

export const MAX_VARIANTS = 100

export interface VariantOption {
  id: string
  name: string
  values: string[]
}

export interface ProductVariant {
  key: string                    // stable id of the combination, built from option ids + values
  values: Record<string, string> // option id -> value
  sku: string                    // empty = generated from the product SKU on save
  price: number | null           // null = same as the product price
  stock: number | null
}

export interface ProductImage {
  id: string
  url: string
  name: string
}

export interface ProductForm {
  name: string
  description: string
  shortDescription: string
  images: ProductImage[]
  type: 'simple' | 'variable'
  price: number | null
  compareAtPrice: number | null
  cost: number | null
  sku: string
  trackInventory: boolean
  stock: number | null
  lowStockThreshold: number | null
  allowBackorders: boolean
  categoryId: string | null
  tags: string[]
  options: VariantOption[]
  variants: ProductVariant[]
  weight: number | null
  dimensions: {
    length: number | null
    width: number | null
    height: number | null
  }
  status: 'draft' | 'published' | 'archived'
  visibility: 'visible' | 'hidden'
  seo: {
    title: string
    description: string
    slug: string
  }
}

// A factory, so nested arrays/objects are never shared between forms
export const createDefaultForm = (): ProductForm => ({
  name: '',
  description: '',
  shortDescription: '',
  images: [],
  type: 'simple',
  price: null,
  compareAtPrice: null,
  cost: null,
  sku: '',
  trackInventory: true,
  stock: null,
  lowStockThreshold: null,
  allowBackorders: false,
  categoryId: null,
  tags: [],
  options: [],
  variants: [],
  weight: null,
  dimensions: { length: null, width: null, height: null },
  status: 'draft',
  visibility: 'visible',
  seo: { title: '', description: '', slug: '' }
})

// Number inputs give '' when cleared
export const toNumber = (v: unknown): number | null => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v))

const uid = () => Math.random().toString(36).slice(2, 9)

const createProductEditor = () => {
  const form = reactive<ProductForm>(createDefaultForm())
  const isEditing = ref(false)
  const isDirty = ref(false)
  const loading = ref(false)
  const errors = reactive<Record<string, string>>({})

  // Any change after the form is loaded marks it dirty; replacing the form pauses this
  let tracking = true
  watch(form, () => { if (tracking) isDirty.value = true }, { deep: true })

  const replaceForm = async (data: ProductForm) => {
    tracking = false
    Object.assign(form, data)
    await nextTick()
    tracking = true
    isDirty.value = false
  }

  // ---------- Variants ----------

  // Options that take part in combinations
  const activeOptions = computed(() => form.options.filter(o => o.name.trim() && o.values.length))

  const combinationCount = (options: VariantOption[]) =>
    options.length ? options.reduce((n, o) => n * o.values.length, 1) : 0

  const variantKey = (values: Record<string, string>) =>
    activeOptions.value.map(o => `${o.id}=${values[o.id]}`).join('|')

  // Rebuilds the combinations, keeping what was typed for combinations that still exist
  const syncVariants = () => {
    const options = activeOptions.value
    if (!options.length) {
      form.variants = []
      return
    }
    const previous = new Map(form.variants.map(v => [v.key, v]))
    const combos: Record<string, string>[] = options.reduce<Record<string, string>[]>(
      (acc, option) => acc.flatMap(combo => option.values.map(value => ({ ...combo, [option.id]: value }))),
      [{}]
    )
    // A variant from before an option was added/removed, agreeing on every option both have
    const related = (values: Record<string, string>) =>
      form.variants.find(v =>
        Object.keys(v.values).some(id => id in values) &&
        Object.entries(v.values).every(([id, val]) => !(id in values) || values[id] === val)
      )

    form.variants = combos.map(values => {
      const key = variantKey(values)
      const existing = previous.get(key)
      if (existing) return { ...existing, values }
      // Inherit only the price: copying stock or SKU would duplicate them
      return { key, values, sku: '', price: related(values)?.price ?? null, stock: null }
    })
  }

  // Re-sync when an option starts/stops taking part (named + has values) or its values change.
  // Renaming keeps variants, since keys use option ids.
  watch(
    () => form.options.map(o => `${o.id}:${o.name.trim() ? 1 : 0}:${o.values.join(',')}`).join('|'),
    syncVariants
  )

  const variantLabel = (variant: ProductVariant) =>
    activeOptions.value.map(o => variant.values[o.id]).filter(Boolean).join(' / ')

  const addOption = () => {
    form.options.push({ id: uid(), name: '', values: [] })
  }

  const removeOption = (id: string) => {
    form.options = form.options.filter(o => o.id !== id)
  }

  // Returns an error message, or null when the value was added
  const addOptionValue = (optionId: string, raw: string): string | null => {
    const option = form.options.find(o => o.id === optionId)
    const value = raw.trim()
    if (!option || !value) return null
    if (option.values.some(v => v.toLowerCase() === value.toLowerCase())) return 'القيمة دي موجودة بالفعل'

    // Count as if this option is already named, so typing the name later can't exceed the cap
    const after = form.options
      .map(o => (o.id === optionId ? { ...o, values: [...o.values, value] } : o))
      .filter(o => o.values.length && (o.name.trim() || o.id === optionId))
    if (combinationCount(after) > MAX_VARIANTS) return `الحد الأقصى ${MAX_VARIANTS} متغير. قسّم المنتج لأكتر من منتج.`

    option.values.push(value)
    return null
  }

  const removeOptionValue = (optionId: string, value: string) => {
    const option = form.options.find(o => o.id === optionId)
    if (!option) return
    option.values = option.values.filter(v => v !== value)
  }

  // Effective values used for saving and for the preview
  const resolvedVariants = computed(() => {
    const base = (form.sku.trim() || 'SKU').toUpperCase()
    return form.variants.map((v, i) => ({
      ...v,
      label: variantLabel(v),
      sku: v.sku.trim() || `${base}-${String(i + 1).padStart(2, '0')}`,
      price: toNumber(v.price) ?? toNumber(form.price),
      stock: toNumber(v.stock) ?? 0
    }))
  })

  const totalStock = computed(() =>
    form.type === 'variable'
      ? resolvedVariants.value.reduce((s, v) => s + v.stock, 0)
      : toNumber(form.stock) ?? 0
  )

  const priceRange = computed(() => {
    if (form.type !== 'variable') {
      const p = toNumber(form.price)
      return p == null ? null : { min: p, max: p }
    }
    const prices = resolvedVariants.value.map(v => v.price).filter((p): p is number => p != null)
    return prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null
  })

  // ---------- Validation ----------

  const clearErrors = () => Object.keys(errors).forEach(key => delete errors[key])

  // `forPublish` = full rules; drafts only need a name
  const validate = (forPublish = true) => {
    clearErrors()
    if (!form.name.trim()) errors.name = 'اسم المنتج مطلوب'
    if (!forPublish) return !Object.keys(errors).length

    const price = toNumber(form.price)
    const compareAt = toNumber(form.compareAtPrice)

    if (form.type === 'simple') {
      if (price == null || price < 0) errors.price = 'السعر مطلوب ويجب ألا يكون سالباً'
      if (form.trackInventory) {
        const stock = toNumber(form.stock)
        if (stock == null || stock < 0 || !Number.isInteger(stock)) errors.stock = 'اكتب كمية المخزون (رقم صحيح)'
      }
    } else {
      const named = form.options.filter(o => o.values.length)
      if (named.some(o => !o.name.trim())) errors.variants = 'اكتب اسم لكل خيار (مثلاً: اللون)'
      else if (new Set(named.map(o => o.name.trim())).size !== named.length) errors.variants = 'فيه خيارين بنفس الاسم'
      else if (!form.variants.length) errors.variants = 'ضيف خيار واحد على الأقل بقيمه (مثلاً: اللون: أسود، أبيض)'
      else {
        const variants = resolvedVariants.value
        if (variants.some(v => v.price == null || v.price < 0)) errors.variants = 'كل متغير محتاج سعر. اكتب سعر أساسي أو سعر لكل متغير'
        else if (new Set(variants.map(v => v.sku.toUpperCase())).size !== variants.length) errors.variants = 'فيه SKU متكرر بين المتغيرات'
        else if (form.trackInventory && form.variants.some(v => { const s = toNumber(v.stock); return s != null && (s < 0 || !Number.isInteger(s)) })) errors.variants = 'المخزون لازم يكون رقم صحيح مش سالب'
      }
      if (price != null && price < 0) errors.price = 'السعر يجب ألا يكون سالباً'
    }

    if (compareAt != null && price != null && compareAt <= price) {
      errors.compareAtPrice = 'السعر قبل الخصم لازم يكون أكبر من السعر الحالي'
    }

    return !Object.keys(errors).length
  }

  // Brings the first error into view
  const focusFirstError = async () => {
    await nextTick()
    document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const resetForm = () => replaceForm(createDefaultForm()).then(() => { isEditing.value = false; clearErrors() })

  const setProduct = (data: Partial<ProductForm>) =>
    replaceForm({ ...createDefaultForm(), ...structuredClone(data) }).then(() => { isEditing.value = true })

  return {
    form, isEditing, isDirty, loading, errors,
    activeOptions, addOption, removeOption, addOptionValue, removeOptionValue, variantLabel,
    resolvedVariants, totalStock, priceRange,
    validate, focusFirstError, resetForm, setProduct
  }
}

type ProductEditorState = ReturnType<typeof createProductEditor>
const KEY: InjectionKey<ProductEditorState> = Symbol('productEditor')

// Called once by ProductEditor; every section shares this one form
export const provideProductForm = () => {
  const editor = createProductEditor()
  provide(KEY, editor)
  return editor
}

export const useProductForm = () => {
  const editor = inject(KEY)
  if (!editor) throw new Error('useProductForm() must be used inside ProductEditor')
  return editor
}
