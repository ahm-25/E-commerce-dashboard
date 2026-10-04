import { defineStore } from 'pinia'
import { apiError } from '~/utils/apiError'

// Same shape as toAdminCart() in server/utils/abandonedCarts.ts
export interface AbandonedCartItem {
  productId: string
  variantId: string | null
  slug: string
  name: string
  image: string
  price: number
  color?: string
  size?: string
  quantity: number
  inStock: boolean
}

export type CartStage = 'active' | 'abandoned' | 'recovered'

export interface AbandonedCart {
  token: string
  customerId: string | null
  customer: { name: string, phone: string, email?: string }
  governorate?: string
  items: AbandonedCartItem[]
  status: 'open' | 'recovered'
  stage: CartStage
  value: number
  itemsCount: number
  recoveredOrderId?: string
  recoveredOrderNumber?: string
  contactedAt?: string
  contactCount: number
  createdAt: string
  updatedAt: string
}

export const useAbandonedCartsStore = defineStore('abandonedCarts', {
  state: () => ({
    carts: [] as AbandonedCart[],
    loading: false,
    error: null as string | null,
    tab: 'abandoned' as CartStage | 'all',
    search: ''
  }),

  getters: {
    filtered(state): AbandonedCart[] {
      const q = state.search.trim().toLowerCase()
      return state.carts.filter(c =>
        (state.tab === 'all' || c.stage === state.tab) &&
        (!q || c.customer.name.toLowerCase().includes(q) || c.customer.phone.includes(q) || c.items.some(i => i.name.toLowerCase().includes(q)))
      )
    },

    stats(state) {
      const abandoned = state.carts.filter(c => c.stage === 'abandoned')
      const recovered = state.carts.filter(c => c.stage === 'recovered')
      const closed = abandoned.length + recovered.length
      return {
        abandonedCount: abandoned.length,
        abandonedValue: abandoned.reduce((s, c) => s + c.value, 0),
        recoveredCount: recovered.length,
        recoveredValue: recovered.reduce((s, c) => s + c.value, 0),
        recoveryRate: closed ? Math.round(recovered.length / closed * 100) : 0,
        active: state.carts.filter(c => c.stage === 'active').length
      }
    }
  },

  actions: {
    async fetchCarts() {
      this.loading = true
      this.error = null
      try {
        this.carts = await $fetch<AbandonedCart[]>('/api/admin/abandoned-carts')
      } catch (err) {
        this.error = apiError(err, 'تعذر تحميل السلات المتروكة')
      } finally {
        this.loading = false
      }
    },

    async markContacted(token: string) {
      const updated = await $fetch<AbandonedCart>(`/api/admin/abandoned-carts/${token}/contacted`, { method: 'POST' })
      const i = this.carts.findIndex(c => c.token === token)
      if (i !== -1) this.carts[i] = updated
    },

    async deleteCart(token: string) {
      await $fetch(`/api/admin/abandoned-carts/${token}`, { method: 'DELETE' })
      this.carts = this.carts.filter(c => c.token !== token)
    }
  }
})
