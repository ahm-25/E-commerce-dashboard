import { defineStore } from 'pinia'

export interface Discount {
  id: string
  name: string
  code: string | 'تلقائي'
  method: 'coupon' | 'automatic'
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  maxValue?: number
  scope: 'all' | 'products' | 'categories'
  selectedProducts?: string[]
  selectedCategories?: string[]
  customerEligibility: 'all' | 'specific' | 'new' | 'returning'
  selectedCustomers?: string[]
  minOrderValue?: number
  minQuantity?: number
  firstOrderOnly: boolean
  usageCount: number
  usageLimit?: number
  onePerCustomer: boolean
  startDate: string
  endDate?: string
  status: 'active' | 'scheduled' | 'expired' | 'disabled'
}

export const useDiscountsStore = defineStore('discounts', {
  state: () => ({
    discounts: [] as Discount[],
    loading: false,
    error: null as string | null,
    
    // Stats
    totalDiscounts: 0,
    activeDiscounts: 0,
    scheduledDiscounts: 0,
    expiredDiscounts: 0,
    totalUses: 0,
    totalValue: 0,
    
    // Filters and Pagination
    currentPage: 1,
    itemsPerPage: 20,
    searchQuery: '',
    selectedTab: 'all', // 'all', 'active', 'scheduled', 'expired', 'coupon', 'automatic'
    selectedType: 'all',
    selectedStatus: 'all',
    selectedScope: 'all',
    selectedUsage: 'all',
    selectedDate: 'all',
    
    selectedDiscounts: [] as string[],
    
    // UI State
    isDeleteDialogOpen: false,
    isDisableDialogOpen: false,
    discountActionTarget: null as Discount | null,
  }),
  
  getters: {
    filteredDiscounts: (state) => {
      let result = [...state.discounts]
      
      // Tab filter
      if (state.selectedTab !== 'all') {
        if (state.selectedTab === 'active') result = result.filter(d => d.status === 'active')
        if (state.selectedTab === 'scheduled') result = result.filter(d => d.status === 'scheduled')
        if (state.selectedTab === 'expired') result = result.filter(d => d.status === 'expired')
        if (state.selectedTab === 'coupon') result = result.filter(d => d.method === 'coupon')
        if (state.selectedTab === 'automatic') result = result.filter(d => d.method === 'automatic')
      }
      
      // Search
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(d => 
          d.name.toLowerCase().includes(query) || 
          d.code.toLowerCase().includes(query) ||
          d.id.toLowerCase().includes(query)
        )
      }
      
      // Type
      if (state.selectedType && state.selectedType !== 'all') {
        result = result.filter(d => d.type === state.selectedType)
      }
      
      // Status
      if (state.selectedStatus && state.selectedStatus !== 'all') {
        result = result.filter(d => d.status === state.selectedStatus)
      }
      
      // Scope
      if (state.selectedScope && state.selectedScope !== 'all') {
        result = result.filter(d => d.scope === state.selectedScope)
      }
      
      // Pagination (mock)
      const start = (state.currentPage - 1) * state.itemsPerPage
      return result.slice(start, start + state.itemsPerPage)
    },
    
    hasActiveFilters: (state) => {
      return state.searchQuery !== '' || 
             state.selectedType !== 'all' || 
             state.selectedStatus !== 'all' || 
             state.selectedScope !== 'all' ||
             state.selectedUsage !== 'all' ||
             state.selectedDate !== 'all'
    },
    
    totalPages: (state) => {
      return Math.ceil(state.discounts.length / state.itemsPerPage)
    }
  },
  
  actions: {
    async fetchDiscounts() {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.discounts = [
          {
            id: 'DSC-00042',
            name: 'خصم الصيف',
            code: 'SUMMER25',
            method: 'coupon',
            type: 'percentage',
            value: 25,
            scope: 'all',
            customerEligibility: 'all',
            firstOrderOnly: false,
            usageCount: 142,
            usageLimit: 500,
            onePerCustomer: true,
            startDate: '2026-09-01T00:00:00.000Z',
            endDate: '2026-09-30T23:59:59.000Z',
            status: 'active'
          },
          {
            id: 'DSC-00043',
            name: 'شحن مجاني للطلبات الكبيرة',
            code: 'تلقائي',
            method: 'automatic',
            type: 'free_shipping',
            value: 0,
            scope: 'all',
            minOrderValue: 1000,
            customerEligibility: 'all',
            firstOrderOnly: false,
            usageCount: 28,
            onePerCustomer: false,
            startDate: '2026-09-10T00:00:00.000Z',
            status: 'active'
          },
          {
            id: 'DSC-00044',
            name: 'خصم العودة للمدارس',
            code: 'SCHOOL26',
            method: 'coupon',
            type: 'fixed',
            value: 350,
            scope: 'categories',
            selectedCategories: ['أدوات مدرسية', 'حقائب'],
            customerEligibility: 'all',
            firstOrderOnly: false,
            usageCount: 0,
            usageLimit: 100,
            onePerCustomer: true,
            startDate: '2026-10-01T00:00:00.000Z',
            endDate: '2026-10-15T23:59:59.000Z',
            status: 'scheduled'
          },
          {
            id: 'DSC-00045',
            name: 'خصم الشتاء',
            code: 'WINTER25',
            method: 'coupon',
            type: 'percentage',
            value: 15,
            scope: 'products',
            customerEligibility: 'all',
            firstOrderOnly: false,
            usageCount: 450,
            usageLimit: 500,
            onePerCustomer: false,
            startDate: '2025-12-01T00:00:00.000Z',
            endDate: '2026-02-28T23:59:59.000Z',
            status: 'expired'
          }
        ]
        
        this.fetchDiscountStats()
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل الخصومات'
      } finally {
        this.loading = false
      }
    },
    
    async fetchDiscountStats() {
      // Mock stats
      this.totalDiscounts = 48
      this.activeDiscounts = 18
      this.scheduledDiscounts = 7
      this.expiredDiscounts = 23
      this.totalUses = 2846
      this.totalValue = 184500
    },

    async fetchDiscount(id: string) {
      // In real app, fetch from API. Here we find in store or mock.
      const discount = this.discounts.find(d => d.id === id)
      if (discount) return discount
      return null
    },
    
    async createDiscount(discountData: any) {
      // TODO: Connect to backend create endpoint
      await new Promise(resolve => setTimeout(resolve, 800))
      return true
    },
    
    async updateDiscount(id: string, discountData: any) {
      // TODO: Connect to backend update endpoint
      await new Promise(resolve => setTimeout(resolve, 800))
      return true
    },
    
    async enableDiscount(id: string) {
      // TODO: Connect to backend enable endpoint
      const discount = this.discounts.find(d => d.id === id)
      if (discount) discount.status = 'active'
    },
    
    async disableDiscount(id: string) {
      // TODO: Connect to backend disable endpoint
      const discount = this.discounts.find(d => d.id === id)
      if (discount) discount.status = 'disabled'
    },
    
    async deleteDiscount(id: string) {
      // TODO: Connect to backend delete endpoint
      this.discounts = this.discounts.filter(d => d.id !== id)
      this.selectedDiscounts = this.selectedDiscounts.filter(dId => dId !== id)
    },
    
    async duplicateDiscount(id: string) {
      // TODO: Connect to backend duplicate endpoint
    },
    
    async exportDiscounts(type: 'current' | 'all', format: 'csv' | 'excel') {
      // TODO: Connect to backend export endpoint
      await new Promise(resolve => setTimeout(resolve, 800))
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedType = 'all'
      this.selectedStatus = 'all'
      this.selectedScope = 'all'
      this.selectedUsage = 'all'
      this.selectedDate = 'all'
      this.currentPage = 1
    },
    
    removeFilter(filterName: string) {
      if (filterName === 'type') this.selectedType = 'all'
      if (filterName === 'status') this.selectedStatus = 'all'
      if (filterName === 'scope') this.selectedScope = 'all'
      if (filterName === 'usage') this.selectedUsage = 'all'
      if (filterName === 'date') this.selectedDate = 'all'
    },
    
    toggleDiscountSelection(id: string) {
      const index = this.selectedDiscounts.indexOf(id)
      if (index === -1) {
        this.selectedDiscounts.push(id)
      } else {
        this.selectedDiscounts.splice(index, 1)
      }
    },
    
    selectAll(isAll: boolean) {
      if (isAll) {
        this.selectedDiscounts = this.filteredDiscounts.map(d => d.id)
      } else {
        this.selectedDiscounts = []
      }
    },
    
    async bulkEnable() {
      for (const id of this.selectedDiscounts) {
        await this.enableDiscount(id)
      }
      this.selectedDiscounts = []
    },
    
    async bulkDisable() {
      for (const id of this.selectedDiscounts) {
        await this.disableDiscount(id)
      }
      this.selectedDiscounts = []
    },
    
    async bulkDelete() {
      this.discounts = this.discounts.filter(d => !this.selectedDiscounts.includes(d.id))
      this.selectedDiscounts = []
    }
  }
})
