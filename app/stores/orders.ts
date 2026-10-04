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
  region?: string
  phone?: string
}

export interface OrderItem {
  id: string
  productId?: string
  variantKey?: string
  slug?: string
  color?: string
  size?: string
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
    methodType?: 'cod' | 'card' | 'wallet' | 'bank_transfer' | 'other'
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
  couponCode?: string
  updateCount?: number
  createdAt: string
  updatedAt: string
}

// Summary row for the orders table
const toListItem = (o: OrderDetails): Order => ({
  id: o.id,
  orderNumber: o.orderNumber,
  customer: { id: o.customer.id, name: o.customer.name, email: o.customer.email, phone: o.customer.phone },
  itemsCount: o.items.reduce((s, i) => s + i.quantity, 0),
  previewItems: o.items.slice(0, 3).map(i => ({ id: i.id, name: i.name, image: i.image })),
  subtotal: o.pricing.subtotal,
  discount: o.pricing.discount,
  shippingCost: o.pricing.shipping,
  tax: o.pricing.tax,
  total: o.pricing.total,
  currency: o.pricing.currency,
  paymentStatus: o.payment.status,
  paymentMethod: o.payment.method,
  status: o.status as Order['status'],
  createdAt: new Date(o.createdAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }),
  updatedAt: new Date(o.updatedAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' })
})

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
    
    currentOrder: null as OrderDetails | null,
    loadingOrder: false,
    orderError: null as string | null,
    totalOrders: 0,
    newCount: 0,
    processingCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    
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
         // Orders store the method's display name; older data used the codes above
         result = result.filter(o => o.paymentMethod === state.selectedPaymentMethod || (mappedMethod && o.paymentMethod === mappedMethod))
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
      
      try {
        const orders = await $fetch<OrderDetails[]>('/api/admin/orders')
        this.orders = orders.map(toListItem)
        this.computeStats()
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل الطلبات')
      } finally {
        this.loading = false
      }
    },

    computeStats() {
      const count = (...statuses: Order['status'][]) => this.orders.filter(o => statuses.includes(o.status)).length
      this.totalOrders = this.orders.length
      this.newCount = count('new', 'review')
      this.processingCount = count('processing', 'shipped')
      this.deliveredCount = count('delivered', 'completed')
      this.cancelledCount = count('cancelled', 'refunded')
    },
    
    async createManualOrder(input: Omit<OrderDetails, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'>) {
      // TODO: the server should also reserve stock once products are shared
      const order = await $fetch<OrderDetails>('/api/admin/orders', { method: 'POST', body: input })
      this.orders.unshift(toListItem(order))
      this.computeStats()
      return order
    },

    async deleteOrder(id: string) {
      await $fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'DELETE' })
      this.orders = this.orders.filter(o => o.id !== id)
      this.selectedOrders = this.selectedOrders.filter(oid => oid !== id)
      this.computeStats()
    },
    
    async bulkDelete() {
      for (const id of [...this.selectedOrders]) {
        await this.deleteOrder(id)
      }
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
        this.currentOrder = await $fetch<OrderDetails>(`/api/admin/orders/${encodeURIComponent(id)}`)
      } catch (err: any) {
        this.currentOrder = null
        // A missing order is shown as "not found" by the page, not as an error
        if (err?.statusCode !== 404) this.orderError = apiError(err, 'تعذر تحميل بيانات الطلب')
      } finally {
        this.loadingOrder = false
      }
    },

    // Applies a status change on the server and syncs the details + list row
    async changeStatus(id: string, status: OrderDetails['status'], note?: string) {
      const updated = await $fetch<OrderDetails>(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
        method: 'POST',
        body: { status, note }
      })
      if (this.currentOrder?.id === id) this.currentOrder = updated
      const index = this.orders.findIndex(o => o.id === id)
      if (index !== -1) this.orders[index] = toListItem(updated)
      this.computeStats()
    },

    async updateOrderStatus(id: string, newStatus: string) {
      await this.changeStatus(id, newStatus as OrderDetails['status'])
    },

    async cancelOrder(id: string, reason: string) {
      await this.changeStatus(id, 'cancelled', reason ? `سبب الإلغاء: ${reason}` : undefined)
    },

    async addOrderNote(id: string, note: { content: string, type: 'internal' | 'customer' }) {
      const created = await $fetch<OrderNote>(`/api/admin/orders/${encodeURIComponent(id)}/notes`, { method: 'POST', body: note })
      if (this.currentOrder?.id === id) {
        this.currentOrder.notes = [created, ...(this.currentOrder.notes ?? [])]
      }
    },

    async refundOrder(id: string, payload: any) {
      // TODO: Connect to the payment gateway's refund API (amount / reason are in payload)
      await this.changeStatus(id, 'refunded', payload?.reason)
    },

    async downloadInvoice(id: string) {
      // TODO: Implement actual invoice download
      console.log('Download invoice for', id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
})
