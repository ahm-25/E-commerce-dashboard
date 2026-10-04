import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import type { ProductForm } from '~/composables/useProductForm'

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  image?: string
  price: number
  compareAtPrice?: number
  stock: number
  status: 'published' | 'draft' | 'archived'
  category?: {
    id: string
    name: string
  }
  updatedAt: string
  type?: 'simple' | 'variable'
  variantsCount?: number
}

export interface SavedProduct {
  form: ProductForm
  // Resolved at save time: SKU and price filled in for every variant
  variants: { key: string, label: string, sku: string, price: number | null, stock: number }[]
  categoryName: string | null
}

// Product as stored by the API: editor data + storefront stats
export interface ApiProduct extends SavedProduct {
  id: string
  sold: number
  createdAt: string
  updatedAt: string
}

// List row from saved editor data; variable products show the lowest price and total stock
const toListItem = ({ id, form, variants, categoryName, updatedAt }: ApiProduct): Product => {
  const prices = variants.map(v => v.price).filter((p): p is number => p != null)
  return {
    id,
    name: form.name,
    slug: form.seo.slug || id,
    sku: form.type === 'variable' ? (form.sku || variants[0]?.sku || '') : form.sku,
    image: form.images[0]?.url,
    price: form.type === 'variable' ? (prices.length ? Math.min(...prices) : 0) : form.price ?? 0,
    compareAtPrice: form.compareAtPrice ?? undefined,
    stock: form.type === 'variable' ? variants.reduce((s, v) => s + v.stock, 0) : form.stock ?? 0,
    status: form.status,
    category: form.categoryId ? { id: form.categoryId, name: categoryName || '' } : undefined,
    updatedAt: new Date(updatedAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' }),
    type: form.type,
    variantsCount: variants.length
  }
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    totalProducts: 0,
    publishedCount: 0,
    draftCount: 0,
    outOfStockCount: 0,
    
    // Filters and Pagination
    currentPage: 1,
    itemsPerPage: 20,
    searchQuery: '',
    selectedStatus: 'الكل',
    selectedCategory: '',
    selectedStock: '',
    selectedPrice: '',
    selectedType: '',
    sortBy: 'الأحدث',
    
    // View state
    viewMode: 'table' as 'table' | 'grid',
    
    selectedProducts: [] as string[]
  }),
  
  getters: {
    filteredProducts: (state) => {
      // Mock filtering logic for UI
      let result = [...state.products]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.sku.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedStatus && state.selectedStatus !== 'الكل') {
        const statusMap: Record<string, string> = {
          'منشور': 'published',
          'مسودة': 'draft',
          'غير متوفر': 'archived' // using archived for this mock
        }
        const mappedStatus = statusMap[state.selectedStatus]
        if (mappedStatus) {
           result = result.filter(p => p.status === mappedStatus)
        }
      }
      
      if (state.selectedCategory) {
        result = result.filter(p => p.category?.name === state.selectedCategory)
      }
      
      if (state.selectedStock) {
        if (state.selectedStock === 'متوفر') result = result.filter(p => p.stock > 10)
        if (state.selectedStock === 'مخزون منخفض') result = result.filter(p => p.stock > 0 && p.stock <= 10)
        if (state.selectedStock === 'نفد المخزون') result = result.filter(p => p.stock === 0)
      }
      
      return result
    },
    
    hasActiveFilters: (state) => {
      return state.searchQuery !== '' || 
             (state.selectedStatus !== '' && state.selectedStatus !== 'الكل') || 
             state.selectedCategory !== '' || 
             state.selectedStock !== '' || 
             state.selectedPrice !== '' || 
             state.selectedType !== ''
    }
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const products = await $fetch<ApiProduct[]>('/api/admin/products')
        this.products = products.map(toListItem)
        this.computeStats()
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل المنتجات')
      } finally {
        this.loading = false
      }
    },

    computeStats() {
      this.totalProducts = this.products.length
      this.publishedCount = this.products.filter(p => p.status === 'published').length
      this.draftCount = this.products.filter(p => p.status === 'draft').length
      this.outOfStockCount = this.products.filter(p => p.stock === 0).length
    },
    
    // Editor data for a product
    async getProductForm(id: string): Promise<ProductForm | null> {
      try {
        const product = await $fetch<ApiProduct>(`/api/admin/products/${encodeURIComponent(id)}`)
        return structuredClone(product.form)
      } catch (err: any) {
        if (err?.statusCode === 404) return null
        throw new Error(apiError(err, 'تعذر تحميل المنتج'))
      }
    },

    async saveProduct(id: string | null, saved: SavedProduct) {
      // TODO: images are saved as URLs; real uploads need a multipart endpoint
      const body = structuredClone(toRaw(saved))
      try {
        const product = id
          ? await $fetch<ApiProduct>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', body })
          : await $fetch<ApiProduct>('/api/admin/products', { method: 'POST', body })

        const row = toListItem(product)
        const index = this.products.findIndex(p => p.id === product.id)
        if (index === -1) this.products.unshift(row)
        else this.products[index] = row
        this.computeStats()
        return product.id
      } catch (err: any) {
        throw new Error(apiError(err, 'حدث خطأ أثناء حفظ المنتج'))
      }
    },

    async deleteProduct(id: string) {
      await $fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
      this.products = this.products.filter(p => p.id !== id)
      this.selectedProducts = this.selectedProducts.filter(pid => pid !== id)
      this.computeStats()
    },
    
    async bulkDelete() {
      for (const id of [...this.selectedProducts]) {
        await this.deleteProduct(id)
      }
      this.selectedProducts = []
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedStatus = 'الكل'
      this.selectedCategory = ''
      this.selectedStock = ''
      this.selectedPrice = ''
      this.selectedType = ''
    },
    
    removeFilter(filterName: string) {
      if (filterName === 'status') this.selectedStatus = 'الكل'
      if (filterName === 'category') this.selectedCategory = ''
      if (filterName === 'stock') this.selectedStock = ''
      if (filterName === 'price') this.selectedPrice = ''
      if (filterName === 'type') this.selectedType = ''
    },
    
    toggleProductSelection(id: string) {
      const index = this.selectedProducts.indexOf(id)
      if (index === -1) {
        this.selectedProducts.push(id)
      } else {
        this.selectedProducts.splice(index, 1)
      }
    },
    
    selectAll(isAll: boolean) {
      if (isAll) {
        this.selectedProducts = this.filteredProducts.map(p => p.id)
      } else {
        this.selectedProducts = []
      }
    }
  }
})
