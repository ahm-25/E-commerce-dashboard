import { defineStore } from 'pinia'

export interface OrderCustomer {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
}

export interface OrderItemPreview {
  id: string
  name: string
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: OrderCustomer
  itemsCount: number
  previewItems: OrderItemPreview[]
  subtotal: number
  discount?: number
  shippingCost?: number
  tax?: number
  total: number
  currency: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod?: string
  status: 'new' | 'review' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  createdAt: string
  updatedAt: string
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
    totalOrders: 1248,
    newCount: 86,
    processingCount: 142,
    deliveredCount: 934,
    cancelledCount: 86,
    
    // Filters and Pagination
    currentPage: 1,
    itemsPerPage: 20,
    searchQuery: '',
    selectedStatus: 'الكل',
    selectedPaymentStatus: 'الكل',
    selectedPaymentMethod: 'الكل',
    selectedDateRange: 'الكل',
    selectedTotalValue: 'الكل',
    sortBy: 'الأحدث',
    
    selectedOrders: [] as string[],
    
    previewOrderId: null as string | null,
    isPreviewDrawerOpen: false
  }),
  
  getters: {
    filteredOrders: (state) => {
      // Mock filtering logic for UI
      let result = [...state.orders]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(o => 
          o.orderNumber.toLowerCase().includes(query) || 
          o.customer.name.toLowerCase().includes(query) ||
          (o.customer.email && o.customer.email.toLowerCase().includes(query)) ||
          (o.customer.phone && o.customer.phone.includes(query))
        )
      }
      
      if (state.selectedStatus && state.selectedStatus !== 'الكل') {
        const statusMap: Record<string, string> = {
          'جديد': 'new',
          'قيد المراجعة': 'review',
          'قيد التجهيز': 'processing',
          'تم الشحن': 'shipped',
          'تم التسليم': 'delivered',
          'مكتمل': 'completed',
          'ملغي': 'cancelled',
          'مسترجع': 'refunded'
        }
        const mappedStatus = statusMap[state.selectedStatus]
        if (mappedStatus) {
           result = result.filter(o => o.status === mappedStatus)
        }
      }
      
      if (state.selectedPaymentStatus && state.selectedPaymentStatus !== 'الكل') {
        const paymentMap: Record<string, string> = {
          'مدفوع': 'paid',
          'قيد الانتظار': 'pending',
          'فشل': 'failed',
          'مسترد': 'refunded'
        }
        const mappedStatus = paymentMap[state.selectedPaymentStatus]
        if (mappedStatus) {
           result = result.filter(o => o.paymentStatus === mappedStatus)
        }
      }

      if (state.selectedPaymentMethod && state.selectedPaymentMethod !== 'الكل') {
         // mock implementation
         const methodMap: Record<string, string> = {
            'الدفع عند الاستلام': 'COD',
            'بطاقة بنكية': 'Credit Card',
            'محفظة إلكترونية': 'Wallet',
            'Online Payment': 'Online'
         }
         const mappedMethod = methodMap[state.selectedPaymentMethod]
         if (mappedMethod) {
             result = result.filter(o => o.paymentMethod === mappedMethod)
         }
      }
      
      return result
    },
    
    hasActiveFilters: (state) => {
      return state.searchQuery !== '' || 
             (state.selectedStatus !== '' && state.selectedStatus !== 'الكل') || 
             (state.selectedPaymentStatus !== '' && state.selectedPaymentStatus !== 'الكل') ||
             (state.selectedPaymentMethod !== '' && state.selectedPaymentMethod !== 'الكل') ||
             (state.selectedDateRange !== '' && state.selectedDateRange !== 'الكل') ||
             (state.selectedTotalValue !== '' && state.selectedTotalValue !== 'الكل')
    },

    previewOrder: (state) => {
      if (!state.previewOrderId) return null
      return state.orders.find(o => o.id === state.previewOrderId) || null
    }
  },
  
  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null
      
      // Mock API call
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.orders = [
          {
            id: '1',
            orderNumber: '#EDX-10482',
            customer: { id: 'c1', name: 'أحمد محمد', email: 'ahmed@example.com' },
            itemsCount: 3,
            previewItems: [
              { id: 'p1', name: 'Product 1', image: '' },
              { id: 'p2', name: 'Product 2', image: '' }
            ],
            subtotal: 2450,
            total: 2450,
            currency: 'ج.م',
            paymentStatus: 'paid',
            paymentMethod: 'Credit Card',
            status: 'processing',
            createdAt: '26 سبتمبر 2026',
            updatedAt: 'منذ ساعتين'
          },
          {
            id: '2',
            orderNumber: '#EDX-10481',
            customer: { id: 'c2', name: 'محمد علي', phone: '01012345678' },
            itemsCount: 1,
            previewItems: [
              { id: 'p3', name: 'Product 3', image: '' }
            ],
            subtotal: 850,
            total: 850,
            currency: 'ج.م',
            paymentStatus: 'paid',
            paymentMethod: 'COD',
            status: 'shipped',
            createdAt: '26 سبتمبر 2026',
            updatedAt: 'منذ 5 ساعات'
          },
          {
            id: '3',
            orderNumber: '#EDX-10480',
            customer: { id: 'c3', name: 'سارة أحمد', email: 'sara@example.com' },
            itemsCount: 2,
            previewItems: [
              { id: 'p4', name: 'Product 4', image: '' }
            ],
            subtotal: 1750,
            total: 1750,
            currency: 'ج.م',
            paymentStatus: 'pending',
            paymentMethod: 'Credit Card',
            status: 'delivered',
            createdAt: '25 سبتمبر 2026',
            updatedAt: 'منذ يوم'
          },
          {
            id: '4',
            orderNumber: '#EDX-10479',
            customer: { id: 'c4', name: 'علي حسن', email: 'ali@example.com' },
            itemsCount: 5,
            previewItems: [
              { id: 'p5', name: 'Product 5', image: '' },
              { id: 'p6', name: 'Product 6', image: '' }
            ],
            subtotal: 3200,
            total: 3200,
            currency: 'ج.م',
            paymentStatus: 'refunded',
            paymentMethod: 'Wallet',
            status: 'review',
            createdAt: '25 سبتمبر 2026',
            updatedAt: 'منذ يوم'
          },
          {
            id: '5',
            orderNumber: '#EDX-10478',
            customer: { id: 'c5', name: 'نور خالد', email: 'nour@example.com' },
            itemsCount: 2,
            previewItems: [
              { id: 'p1', name: 'Product 1', image: '' }
            ],
            subtotal: 645,
            total: 645,
            currency: 'ج.م',
            paymentStatus: 'paid',
            paymentMethod: 'Online',
            status: 'processing',
            createdAt: '24 سبتمبر 2026',
            updatedAt: 'منذ يومين'
          },
          {
            id: '6',
            orderNumber: '#EDX-10477',
            customer: { id: 'c6', name: 'خالد إبراهيم', email: 'khaled@example.com' },
            itemsCount: 1,
            previewItems: [
              { id: 'p2', name: 'Product 2', image: '' }
            ],
            subtotal: 1320,
            total: 1320,
            currency: 'ج.م',
            paymentStatus: 'paid',
            paymentMethod: 'COD',
            status: 'cancelled',
            createdAt: '24 سبتمبر 2026',
            updatedAt: 'منذ يومين'
          },
          {
            id: '7',
            orderNumber: '#EDX-10476',
            customer: { id: 'c7', name: 'مريم ياسر', email: 'mariam@example.com' },
            itemsCount: 4,
            previewItems: [
              { id: 'p3', name: 'Product 3', image: '' }
            ],
            subtotal: 2980,
            total: 2980,
            currency: 'ج.م',
            paymentStatus: 'failed',
            paymentMethod: 'Credit Card',
            status: 'new',
            createdAt: '23 سبتمبر 2026',
            updatedAt: 'منذ 3 أيام'
          }
        ]
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل الطلبات'
      } finally {
        this.loading = false
      }
    },
    
    async deleteOrder(id: string) {
      this.orders = this.orders.filter(o => o.id !== id)
      this.selectedOrders = this.selectedOrders.filter(oid => oid !== id)
    },
    
    async bulkDelete() {
      this.orders = this.orders.filter(o => !this.selectedOrders.includes(o.id))
      this.selectedOrders = []
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedStatus = 'الكل'
      this.selectedPaymentStatus = 'الكل'
      this.selectedPaymentMethod = 'الكل'
      this.selectedDateRange = 'الكل'
      this.selectedTotalValue = 'الكل'
    },
    
    removeFilter(filterName: string) {
      if (filterName === 'status') this.selectedStatus = 'الكل'
      if (filterName === 'paymentStatus') this.selectedPaymentStatus = 'الكل'
      if (filterName === 'paymentMethod') this.selectedPaymentMethod = 'الكل'
      if (filterName === 'dateRange') this.selectedDateRange = 'الكل'
      if (filterName === 'totalValue') this.selectedTotalValue = 'الكل'
    },
    
    toggleOrderSelection(id: string) {
      const index = this.selectedOrders.indexOf(id)
      if (index === -1) {
        this.selectedOrders.push(id)
      } else {
        this.selectedOrders.splice(index, 1)
      }
    },
    
    selectAll(isAll: boolean) {
      if (isAll) {
        this.selectedOrders = this.filteredOrders.map(o => o.id)
      } else {
        this.selectedOrders = []
      }
    },

    openPreviewDrawer(id: string) {
      this.previewOrderId = id
      this.isPreviewDrawerOpen = true
    },
    
    closePreviewDrawer() {
      this.isPreviewDrawerOpen = false
      setTimeout(() => {
        this.previewOrderId = null
      }, 300) // wait for animation
    }
  }
})
