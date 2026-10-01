import { defineStore } from 'pinia'

export interface Discount {
  id: string
  name: string
  description?: string
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
  endDate?: string | null
  status: 'active' | 'scheduled' | 'expired' | 'disabled'
}

// Form model (datetime-local strings, UI-only flags) -> API model.
// Empty fields are sent as null so an update actually clears them.
function toDiscountPayload(form: any): Partial<Discount> {
  const { noEndDate, ...rest } = form
  return {
    ...rest,
    code: form.method === 'automatic' ? 'تلقائي' : String(form.code ?? '').trim().toUpperCase(),
    startDate: form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString(),
    endDate: !noEndDate && form.endDate ? new Date(form.endDate).toISOString() : null
  }
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
        this.discounts = await $fetch<Discount[]>('/api/admin/discounts')
        this.fetchDiscountStats()
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل الخصومات')
      } finally {
        this.loading = false
      }
    },
    
    fetchDiscountStats() {
      this.totalDiscounts = this.discounts.length
      this.activeDiscounts = this.discounts.filter(d => d.status === 'active').length
      this.scheduledDiscounts = this.discounts.filter(d => d.status === 'scheduled').length
      this.expiredDiscounts = this.discounts.filter(d => d.status === 'expired').length
      this.totalUses = this.discounts.reduce((sum, d) => sum + d.usageCount, 0)
      // TODO: needs order data to know the real value of discounts used
      this.totalValue = 184500
    },

    async fetchDiscount(id: string) {
      try {
        return await $fetch<Discount>(`/api/admin/discounts/${encodeURIComponent(id)}`)
      } catch {
        return null
      }
    },
    
    async createDiscount(discountData: any) {
      try {
        const created = await $fetch<Discount>('/api/admin/discounts', { method: 'POST', body: toDiscountPayload(discountData) })
        this.discounts.push(created)
        this.fetchDiscountStats()
        return true
      } catch (err: any) {
        throw new Error(apiError(err, 'حدث خطأ أثناء حفظ الخصم'))
      }
    },
    
    async updateDiscount(id: string, discountData: any) {
      try {
        await this.saveDiscount(id, toDiscountPayload(discountData))
        return true
      } catch (err: any) {
        throw new Error(apiError(err, 'حدث خطأ أثناء تحديث الخصم'))
      }
    },

    async saveDiscount(id: string, changes: Partial<Discount>) {
      const updated = await $fetch<Discount>(`/api/admin/discounts/${encodeURIComponent(id)}`, { method: 'PUT', body: changes })
      const index = this.discounts.findIndex(d => d.id === id)
      if (index !== -1) this.discounts[index] = updated
      this.fetchDiscountStats()
      return updated
    },
    
    async enableDiscount(id: string) {
      // The server derives active/scheduled/expired from the dates
      await this.saveDiscount(id, { status: 'active' })
    },
    
    async disableDiscount(id: string) {
      await this.saveDiscount(id, { status: 'disabled' })
    },
    
    async deleteDiscount(id: string) {
      await $fetch(`/api/admin/discounts/${encodeURIComponent(id)}`, { method: 'DELETE' })
      this.discounts = this.discounts.filter(d => d.id !== id)
      this.selectedDiscounts = this.selectedDiscounts.filter(dId => dId !== id)
      this.fetchDiscountStats()
    },
    
    async duplicateDiscount(id: string) {
      const source = this.discounts.find(d => d.id === id)
      if (!source) return
      const { id: _id, usageCount: _uses, ...rest } = source
      const copy = await $fetch<Discount>('/api/admin/discounts', {
        method: 'POST',
        body: {
          ...rest,
          name: `${source.name} (نسخة)`,
          code: source.method === 'coupon' ? `${source.code}-COPY` : source.code,
          status: 'disabled'
        }
      })
      this.discounts.push(copy)
      this.fetchDiscountStats()
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
      for (const id of [...this.selectedDiscounts]) {
        await this.deleteDiscount(id)
      }
      this.selectedDiscounts = []
    }
  }
})
