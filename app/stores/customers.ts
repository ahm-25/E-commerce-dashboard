import { defineStore } from 'pinia'

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string

  status: 'active' | 'inactive' | 'blocked'
  customerType?: 'new' | 'returning' | 'vip'

  ordersCount: number
  totalSpent: number
  currency: string

  lastOrder?: {
    id: string
    orderNumber: string
    createdAt: string
    total: number
  }

  createdAt: string
  updatedAt: string
}

interface CustomersState {
  customers: Customer[]
  loading: boolean
  error: string | null
  
  // Filters
  searchQuery: string
  selectedStatuses: string[]
  selectedTypes: string[]
  selectedOrdersCount: string[]
  selectedTotalSpent: string[]
  selectedDateRange: string
  
  // Pagination
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  
  // Selection
  selectedCustomers: string[]
  
  // Preview
  previewCustomerId: string | null
  
  // Dialogs
  isAddCustomerOpen: boolean
  isEditCustomerOpen: boolean
  isDeleteDialogOpen: boolean
  isBlockDialogOpen: boolean
  customerToEdit: Customer | null
}

export const useCustomersStore = defineStore('customers', {
  state: (): CustomersState => ({
    customers: [],
    loading: false,
    error: null,
    
    searchQuery: '',
    selectedStatuses: [],
    selectedTypes: [],
    selectedOrdersCount: [],
    selectedTotalSpent: [],
    selectedDateRange: 'all',
    
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    
    selectedCustomers: [],
    
    previewCustomerId: null,
    
    isAddCustomerOpen: false,
    isEditCustomerOpen: false,
    isDeleteDialogOpen: false,
    isBlockDialogOpen: false,
    customerToEdit: null,
  }),
  
  getters: {
    filteredCustomers: (state) => {
      let result = [...state.customers]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(c => 
          c.name.toLowerCase().includes(query) || 
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.toLowerCase().includes(query)) ||
          c.id.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedStatuses.length > 0) {
        result = result.filter(c => state.selectedStatuses.includes(c.status))
      }
      
      if (state.selectedTypes.length > 0) {
        result = result.filter(c => c.customerType && state.selectedTypes.includes(c.customerType))
      }
      
      // Add other filters as needed
      
      return result
    },
    
    hasActiveFilters: (state) => {
      return state.selectedStatuses.length > 0 || 
             state.selectedTypes.length > 0 ||
             state.selectedOrdersCount.length > 0 ||
             state.selectedTotalSpent.length > 0 ||
             state.selectedDateRange !== 'all'
    },
    
    previewCustomer: (state) => {
      if (!state.previewCustomerId) return null
      return state.customers.find(c => c.id === state.previewCustomerId) || null
    }
  },
  
  actions: {
    async fetchCustomers() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        this.customers = [
          {
            id: 'CUS-009281',
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '01012345678',
            status: 'active',
            customerType: 'returning',
            ordersCount: 12,
            totalSpent: 8450,
            currency: 'ج.م',
            lastOrder: {
              id: 'ord-1',
              orderNumber: '#EDX-10482',
              createdAt: '2026-09-26T14:30:00Z',
              total: 1250
            },
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2026-09-26T14:30:00Z'
          },
          {
            id: 'CUS-009282',
            name: 'سارة خالد',
            email: 'sara.k@example.com',
            phone: '01198765432',
            status: 'active',
            customerType: 'vip',
            ordersCount: 34,
            totalSpent: 45200,
            currency: 'ج.م',
            lastOrder: {
              id: 'ord-2',
              orderNumber: '#EDX-10485',
              createdAt: '2026-09-28T09:15:00Z',
              total: 3400
            },
            createdAt: '2024-11-20T11:20:00Z',
            updatedAt: '2026-09-28T09:15:00Z'
          },
          {
            id: 'CUS-009283',
            name: 'محمود علي',
            email: 'mahmoud@domain.com',
            phone: '01234567890',
            status: 'inactive',
            customerType: 'new',
            ordersCount: 1,
            totalSpent: 450,
            currency: 'ج.م',
            lastOrder: {
              id: 'ord-3',
              orderNumber: '#EDX-09123',
              createdAt: '2026-08-10T16:45:00Z',
              total: 450
            },
            createdAt: '2026-08-10T16:00:00Z',
            updatedAt: '2026-08-10T16:45:00Z'
          },
          {
            id: 'CUS-009284',
            name: 'نور الدين ياسر',
            phone: '01555555555',
            status: 'blocked',
            ordersCount: 0,
            totalSpent: 0,
            currency: 'ج.م',
            createdAt: '2026-09-25T12:00:00Z',
            updatedAt: '2026-09-26T10:00:00Z'
          }
        ]
        
        this.totalItems = 8420
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
      } catch (err: any) {
        this.error = err.message || 'حدث خطأ أثناء تحميل بيانات العملاء'
      } finally {
        this.loading = false
      }
    },
    
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    
    toggleStatusFilter(status: string) {
      const index = this.selectedStatuses.indexOf(status)
      if (index === -1) {
        this.selectedStatuses.push(status)
      } else {
        this.selectedStatuses.splice(index, 1)
      }
    },
    
    toggleTypeFilter(type: string) {
      const index = this.selectedTypes.indexOf(type)
      if (index === -1) {
        this.selectedTypes.push(type)
      } else {
        this.selectedTypes.splice(index, 1)
      }
    },
    
    clearFilters() {
      this.selectedStatuses = []
      this.selectedTypes = []
      this.selectedOrdersCount = []
      this.selectedTotalSpent = []
      this.selectedDateRange = 'all'
    },
    
    selectAll(selected: boolean) {
      if (selected) {
        this.selectedCustomers = this.filteredCustomers.map(c => c.id)
      } else {
        this.selectedCustomers = []
      }
    },
    
    toggleSelection(id: string) {
      const index = this.selectedCustomers.indexOf(id)
      if (index === -1) {
        this.selectedCustomers.push(id)
      } else {
        this.selectedCustomers.splice(index, 1)
      }
    },
    
    openPreview(id: string) {
      this.previewCustomerId = id
    },
    
    closePreview() {
      this.previewCustomerId = null
    },
    
    openAddCustomer() {
      this.isAddCustomerOpen = true
    },
    
    closeAddCustomer() {
      this.isAddCustomerOpen = false
    },
    
    openEditCustomer(customer: Customer) {
      this.customerToEdit = customer
      this.isEditCustomerOpen = true
    },
    
    closeEditCustomer() {
      this.isEditCustomerOpen = false
      this.customerToEdit = null
    },
    
    setPage(page: number) {
      this.currentPage = page
      // In a real app, we would refetch data here
    }
  }
})
