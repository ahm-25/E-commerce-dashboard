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

export interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  country: string
}

export interface OrderItem {
  id: string
  name: string
  sku: string
  image?: string
  variant?: string
  quantity: number
  unitPrice: number
  discount?: number
  total: number
}

export interface OrderTimelineEvent {
  id: string
  status: string
  timestamp: string
  actor?: string
  note?: string
  icon?: string
}

export interface OrderNote {
  id: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  content: string
  type: 'internal' | 'customer'
}

export interface OrderDetails {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email?: string
    phone?: string
    avatar?: string
    previousOrdersCount?: number
    createdAt?: string
  }
  items: OrderItem[]
  pricing: {
    subtotal: number
    discount?: number
    shipping?: number
    tax?: number
    total: number
    currency: string
  }
  payment: {
    status: 'paid' | 'pending' | 'failed' | 'refunded'
    method?: string
    transactionId?: string
    paidAt?: string
  }
  shipping?: {
    address?: ShippingAddress
    method?: string
    trackingNumber?: string
    estimatedDelivery?: string
  }
  status: 'new' | 'review' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  timeline: OrderTimelineEvent[]
  notes?: OrderNote[]
  invoice?: {
    id: string
    number: string
    url?: string
  }
  source?: string
  updateCount?: number
  createdAt: string
  updatedAt: string
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
    
    currentOrder: null as OrderDetails | null,
    loadingOrder: false,
    orderError: null as string | null,
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
    },

    async fetchOrder(id: string) {
      this.loadingOrder = true
      this.orderError = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        if (id === 'not-found') {
          this.currentOrder = null
          return
        }

        this.currentOrder = {
          id,
          orderNumber: `#EDX-${Math.floor(Math.random() * 10000) + 10000}`,
          customer: {
            id: 'c1',
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '01012345678',
            avatar: '',
            previousOrdersCount: 12,
            createdAt: '2025-01-15'
          },
          items: [
            {
              id: 'i1',
              name: 'هاتف Samsung Galaxy S24',
              sku: 'SAM-S24-BLK',
              image: 'https://placehold.co/100x100/1e293b/fff?text=S24',
              variant: 'اللون: أسود | السعة: 256GB',
              quantity: 1,
              unitPrice: 2850,
              total: 2850
            },
            {
              id: 'i2',
              name: 'سماعات لاسلكية',
              sku: 'HEAD-001',
              image: 'https://placehold.co/100x100/1e293b/fff?text=Headset',
              variant: 'اللون: أسود',
              quantity: 1,
              unitPrice: 650,
              total: 650
            }
          ],
          pricing: {
            subtotal: 3500,
            discount: 350,
            shipping: 100,
            tax: 250,
            total: 3500,
            currency: 'ج.م'
          },
          payment: {
            status: 'paid',
            method: 'بطاقة بنكية',
            transactionId: 'TXN-928381',
            paidAt: '2026-09-26T10:24:00Z'
          },
          shipping: {
            address: {
              name: 'أحمد محمد',
              street: 'شارع الجمهورية، برج النور، الدور 3',
              city: 'المنصورة',
              state: 'الدقهلية',
              country: 'مصر'
            },
            method: 'الشحن القياسي',
            trackingNumber: 'TRK-82938102',
            estimatedDelivery: '2026-09-28T00:00:00Z'
          },
          status: 'processing',
          timeline: [
            { id: 't1', status: 'new', timestamp: '2026-09-26T10:24:00Z', icon: 'ph:check-circle', actor: 'النظام' },
            { id: 't2', status: 'paid', timestamp: '2026-09-26T10:25:00Z', icon: 'ph:check-circle', actor: 'بوابة الدفع' },
            { id: 't3', status: 'processing', timestamp: '2026-09-26T11:40:00Z', icon: 'ph:spinner', actor: 'أحمد مدير المتجر' }
          ],
          notes: [
            {
              id: 'n1',
              authorName: 'أحمد محمد',
              createdAt: '2026-09-26T11:30:00Z',
              content: 'العميل طلب الاتصال قبل التوصيل.',
              type: 'customer'
            },
            {
              id: 'n2',
              authorName: 'فريق المتجر',
              createdAt: '2026-09-26T10:45:00Z',
              content: 'تم تجهيز الطلب وسيتم شحنه خلال 24 ساعة.',
              type: 'internal'
            }
          ],
          invoice: {
            id: 'inv1',
            number: 'INV-10482',
            url: '#'
          },
          source: 'Online Store',
          updateCount: 5,
          createdAt: '2026-09-26T10:24:00Z',
          updatedAt: '2026-09-26T11:40:00Z'
        }
      } catch (err: any) {
        this.orderError = err.message || 'تعذر تحميل بيانات الطلب'
      } finally {
        this.loadingOrder = false
      }
    },

    async updateOrderStatus(id: string, newStatus: string) {
      if (!this.currentOrder || this.currentOrder.id !== id) return
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.currentOrder.status = newStatus as any
      this.currentOrder.timeline.push({
        id: `t${Date.now()}`,
        status: newStatus,
        timestamp: new Date().toISOString(),
        actor: 'مدير المتجر',
        icon: 'ph:check-circle'
      })
      this.currentOrder.updateCount = (this.currentOrder.updateCount || 0) + 1
      this.currentOrder.updatedAt = new Date().toISOString()
    },

    async cancelOrder(id: string, reason: string) {
      if (!this.currentOrder || this.currentOrder.id !== id) return
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.currentOrder.status = 'cancelled'
      this.currentOrder.timeline.push({
        id: `t${Date.now()}`,
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        actor: 'مدير المتجر',
        icon: 'ph:x-circle',
        note: `سبب الإلغاء: ${reason}`
      })
    },

    async addOrderNote(id: string, note: { content: string, type: 'internal' | 'customer' }) {
      if (!this.currentOrder || this.currentOrder.id !== id) return
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!this.currentOrder.notes) {
        this.currentOrder.notes = []
      }
      
      this.currentOrder.notes.unshift({
        id: `n${Date.now()}`,
        authorName: 'أنت',
        createdAt: new Date().toISOString(),
        content: note.content,
        type: note.type
      })
    },

    async refundOrder(id: string, payload: any) {
      // TODO: Connect to backend refund endpoint
      console.log('Refund order', id, payload)
      if (!this.currentOrder || this.currentOrder.id !== id) return
      
      await new Promise(resolve => setTimeout(resolve, 500))
      this.currentOrder.status = 'refunded'
      this.currentOrder.timeline.push({
        id: `t${Date.now()}`,
        status: 'refunded',
        timestamp: new Date().toISOString(),
        actor: 'مدير المتجر',
        icon: 'ph:arrow-u-up-left'
      })
    },

    async downloadInvoice(id: string) {
      // TODO: Implement actual invoice download
      console.log('Download invoice for', id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
})
