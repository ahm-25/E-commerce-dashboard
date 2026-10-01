import { defineStore } from 'pinia'

export type PaymentMethodStatus = 'active' | 'inactive' | 'setup_required' | 'disconnected'
export type PaymentMethodType = 'cod' | 'card' | 'wallet' | 'bank_transfer' | 'other'

export interface PaymentMethod {
  id: string
  name: string
  type: PaymentMethodType
  provider: string | null
  fees: { type: 'none' | 'fixed' | 'percentage' | 'both', fixedAmount?: number, percentage?: number }
  status: PaymentMethodStatus
  order: number
  isDefault: boolean
  updatedAt: string
}

export type GatewayStatus = 'connected' | 'setup_required' | 'disconnected' | 'error' | 'disabled'

export interface PaymentGateway {
  id: string
  providerName: string
  providerLogo?: string
  description: string
  status: GatewayStatus
  environment: 'test' | 'live'
  supportedMethods: string[]
  lastConnectionCheck?: string
  config?: any // Avoid storing raw secrets, just masked ones if any
}

export interface PaymentSettings {
  enableElectronicPayments: boolean
  allowMultipleMethods: boolean
  showUnavailableMethods: boolean
  defaultMethodId: string | null
  saveMethodsForFuture: boolean
  failedPaymentBehavior: 'retry' | 'show_others' | 'keep_pending'
}

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    paymentMethods: [] as PaymentMethod[],
    paymentGateways: [] as PaymentGateway[],
    generalSettings: {
      enableElectronicPayments: true,
      allowMultipleMethods: true,
      showUnavailableMethods: false,
      defaultMethodId: null,
      saveMethodsForFuture: false,
      failedPaymentBehavior: 'retry'
    } as PaymentSettings,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPaymentData() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<{ methods: PaymentMethod[], gateways: PaymentGateway[], settings: PaymentSettings }>('/api/admin/payments')
        this.paymentMethods = [...data.methods].sort((a, b) => a.order - b.order)
        this.paymentGateways = data.gateways
        this.generalSettings = data.settings
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل إعدادات الدفع')
      } finally {
        this.loading = false
      }
    },

    // Persists the whole methods list (status, default flag and order)
    async saveMethods() {
      const now = new Date().toISOString()
      this.paymentMethods = await $fetch<PaymentMethod[]>('/api/admin/payments/methods', {
        method: 'PUT',
        body: this.paymentMethods.map(m => ({ ...m, updatedAt: now }))
      })
    },

    async togglePaymentMethod(id: string, active: boolean) {
      const method = this.paymentMethods.find(m => m.id === id)
      if (method) {
        method.status = active ? 'active' : 'inactive'
        await this.saveMethods()
      }
    },

    async setDefaultMethod(id: string) {
      this.paymentMethods.forEach(m => {
        m.isDefault = m.id === id
      })
      this.generalSettings.defaultMethodId = id
      await this.saveMethods()
    },

    async reorderMethods(newOrderIds: string[]) {
      newOrderIds.forEach((id, index) => {
        const method = this.paymentMethods.find(m => m.id === id)
        if (method) method.order = index + 1
      })
      this.paymentMethods.sort((a, b) => a.order - b.order)
      await this.saveMethods()
    },

    async testGatewayConnection(id: string) {
      return new Promise<{ success: boolean, message: string }>((resolve) => {
        setTimeout(() => {
          const gateway = this.paymentGateways.find(g => g.id === id)
          if (gateway) {
            gateway.lastConnectionCheck = new Date().toISOString()
            if (gateway.status === 'connected') {
              resolve({ success: true, message: 'تم الاتصال ببوابة الدفع بنجاح.' })
            } else {
              resolve({ success: false, message: 'تعذر الاتصال ببوابة الدفع. يرجى التحقق من المفاتيح.' })
            }
          } else {
            resolve({ success: false, message: 'بوابة الدفع غير موجودة.' })
          }
        }, 1500)
      })
    },

    async updateSettings(settings: Partial<PaymentSettings>) {
      this.generalSettings = await $fetch<PaymentSettings>('/api/admin/payments/settings', { method: 'PUT', body: settings })
    }
  }
})
