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
      
      // Mock data fetching
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.paymentMethods = [
            {
              id: '1',
              name: 'الدفع عند الاستلام',
              type: 'cod',
              provider: null,
              fees: { type: 'fixed', fixedAmount: 15 },
              status: 'active',
              order: 1,
              isDefault: true,
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              name: 'البطاقات الائتمانية',
              type: 'card',
              provider: 'Stripe',
              fees: { type: 'percentage', percentage: 2.5 },
              status: 'active',
              order: 2,
              isDefault: false,
              updatedAt: new Date().toISOString()
            },
            {
              id: '3',
              name: 'المحافظ الإلكترونية',
              type: 'wallet',
              provider: 'Paymob',
              fees: { type: 'none' },
              status: 'setup_required',
              order: 3,
              isDefault: false,
              updatedAt: new Date().toISOString()
            },
            {
              id: '4',
              name: 'تحويل بنكي',
              type: 'bank_transfer',
              provider: null,
              fees: { type: 'none' },
              status: 'inactive',
              order: 4,
              isDefault: false,
              updatedAt: new Date().toISOString()
            }
          ]

          this.paymentGateways = [
            {
              id: 'g1',
              providerName: 'Stripe',
              description: 'بوابة الدفع الإلكترونية العالمية.',
              status: 'connected',
              environment: 'live',
              supportedMethods: ['card'],
              lastConnectionCheck: new Date().toISOString()
            },
            {
              id: 'g2',
              providerName: 'Paymob',
              description: 'بوابة الدفع المحلية لدعم المحافظ والبطاقات.',
              status: 'setup_required',
              environment: 'test',
              supportedMethods: ['card', 'wallet']
            }
          ]

          this.generalSettings.defaultMethodId = '1'

          this.loading = false
          resolve()
        }, 800)
      })
    },

    async togglePaymentMethod(id: string, active: boolean) {
      const method = this.paymentMethods.find(m => m.id === id)
      if (method) {
        method.status = active ? 'active' : 'inactive'
      }
    },

    async setDefaultMethod(id: string) {
      this.paymentMethods.forEach(m => {
        m.isDefault = m.id === id
      })
      this.generalSettings.defaultMethodId = id
    },

    async reorderMethods(newOrderIds: string[]) {
      newOrderIds.forEach((id, index) => {
        const method = this.paymentMethods.find(m => m.id === id)
        if (method) method.order = index + 1
      })
      this.paymentMethods.sort((a, b) => a.order - b.order)
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
      this.generalSettings = { ...this.generalSettings, ...settings }
    }
  }
})
