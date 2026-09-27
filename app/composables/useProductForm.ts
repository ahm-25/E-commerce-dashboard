import { ref, reactive } from 'vue'

export interface ProductVariant {
  id?: string
  options: Record<string, string>
  sku: string
  price: number | null
  stock: number | null
}

export interface ProductForm {
  name: string
  description: string
  shortDescription: string
  images: any[] // would be File[] or existing image objects
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

const defaultForm: ProductForm = {
  name: '',
  description: '',
  shortDescription: '',
  images: [],
  type: 'simple',
  price: null,
  compareAtPrice: null,
  cost: null,
  sku: '',
  trackInventory: false,
  stock: null,
  lowStockThreshold: null,
  allowBackorders: false,
  categoryId: null,
  tags: [],
  variants: [],
  weight: null,
  dimensions: { length: null, width: null, height: null },
  status: 'draft',
  visibility: 'visible',
  seo: { title: '', description: '', slug: '' }
}

export const useProductForm = () => {
  const form = reactive<ProductForm>({ ...defaultForm })
  const isEditing = ref(false)
  const isDirty = ref(false)
  const loading = ref(false)
  const errors = reactive<Record<string, string>>({})

  const validate = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    let valid = true
    
    if (!form.name.trim()) {
      errors.name = 'اسم المنتج مطلوب'
      valid = false
    }
    
    if (form.price === null || form.price < 0) {
      errors.price = 'يجب أن يكون السعر أكبر من أو يساوي صفر'
      valid = false
    }
    
    if (form.compareAtPrice !== null && form.compareAtPrice < (form.price || 0)) {
      errors.compareAtPrice = 'السعر قبل الخصم يجب أن يكون أكبر من أو يساوي السعر الحالي'
      valid = false
    }
    
    return valid
  }

  const resetForm = () => {
    Object.assign(form, defaultForm)
    isDirty.value = false
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const setProduct = (productData: Partial<ProductForm>) => {
    Object.assign(form, { ...defaultForm, ...productData })
    isEditing.value = true
    isDirty.value = false
  }

  return {
    form,
    isEditing,
    isDirty,
    loading,
    errors,
    validate,
    resetForm,
    setProduct
  }
}
