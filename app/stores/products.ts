import { defineStore } from 'pinia'

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
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    totalProducts: 248,
    publishedCount: 218,
    draftCount: 18,
    outOfStockCount: 12,
    
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
      
      // Mock API call
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.products = [
          {
            id: '1',
            name: 'سماعات لاسلكية Pro',
            slug: 'wireless-headphones-pro',
            sku: 'EDX-00124',
            price: 1299,
            stock: 24,
            status: 'published',
            category: { id: 'c1', name: 'إلكترونيات' },
            updatedAt: 'منذ ساعتين',
            image: ''
          },
          {
            id: '2',
            name: 'ساعة ذكية',
            slug: 'smart-watch',
            sku: 'EDX-00231',
            price: 2499,
            stock: 8,
            status: 'published',
            category: { id: 'c1', name: 'إلكترونيات' },
            updatedAt: 'منذ 5 ساعات',
            image: ''
          },
          {
            id: '3',
            name: 'حقيبة ظهر',
            slug: 'backpack',
            sku: 'EDX-00345',
            price: 899,
            stock: 45,
            status: 'published',
            category: { id: 'c2', name: 'حقائب' },
            updatedAt: 'منذ 6 ساعات',
            image: ''
          },
          {
            id: '4',
            name: 'كيبورد ميكانيكي',
            slug: 'mechanical-keyboard',
            sku: 'EDX-00412',
            price: 1750,
            stock: 0,
            status: 'draft',
            category: { id: 'c1', name: 'إلكترونيات' },
            updatedAt: 'منذ يوم',
            image: ''
          },
          {
            id: '5',
            name: 'ماوس لاسلكي',
            slug: 'wireless-mouse',
            sku: 'EDX-00567',
            price: 650,
            stock: 12,
            status: 'published',
            category: { id: 'c1', name: 'إلكترونيات' },
            updatedAt: 'منذ يوم',
            image: ''
          },
          {
            id: '6',
            name: 'شاحن سريع',
            slug: 'fast-charger',
            sku: 'EDX-00678',
            price: 450,
            stock: 3,
            status: 'published',
            category: { id: 'c3', name: 'إكسسوارات' },
            updatedAt: 'منذ يومين',
            image: ''
          },
          {
            id: '7',
            name: 'حقيبة لابتوب',
            slug: 'laptop-bag',
            sku: 'EDX-00789',
            price: 1200,
            stock: 18,
            status: 'draft',
            category: { id: 'c2', name: 'حقائب' },
            updatedAt: 'منذ 3 أيام',
            image: ''
          }
        ]
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل المنتجات'
      } finally {
        this.loading = false
      }
    },
    
    async deleteProduct(id: string) {
      this.products = this.products.filter(p => p.id !== id)
      this.selectedProducts = this.selectedProducts.filter(pid => pid !== id)
    },
    
    async bulkDelete() {
      this.products = this.products.filter(p => !this.selectedProducts.includes(p.id))
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
