import { defineStore } from 'pinia'

export interface StoreSettings {
  // Store info
  name: string
  description: string
  email: string
  phone: string
  whatsapp: string

  // Business address
  country: string
  city: string
  address: string
  postalCode: string

  // Locale
  currency: 'EGP' | 'SAR' | 'AED' | 'USD'
  timezone: string
  weightUnit: 'kg' | 'g'
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD'

  // Tax
  taxEnabled: boolean
  taxRate: number
  pricesIncludeTax: boolean
  taxNumber: string

  // Orders & checkout
  orderPrefix: string
  minOrderValue: number | null
  allowGuestCheckout: boolean
  requirePhone: boolean
  autoCancelUnpaidHours: number | null

  // Store status
  maintenanceMode: boolean
  maintenanceMessage: string
}

export const currencyOptions = [
  { value: 'EGP', label: 'جنيه مصري (ج.م)' },
  { value: 'SAR', label: 'ريال سعودي (ر.س)' },
  { value: 'AED', label: 'درهم إماراتي (د.إ)' },
  { value: 'USD', label: 'دولار أمريكي ($)' }
] as const

export const timezoneOptions = [
  { value: 'Africa/Cairo', label: 'القاهرة (GMT+2/+3)' },
  { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' },
  { value: 'Asia/Dubai', label: 'دبي (GMT+4)' }
]

export const useStoreSettingsStore = defineStore('storeSettings', {
  state: () => ({
    settings: null as StoreSettings | null,
    loading: false,
    saving: false,
    error: null as string | null
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800))

        this.settings = {
          name: 'متجر أحمد',
          description: 'متجر متخصص في الإلكترونيات والإكسسوارات بأفضل الأسعار.',
          email: 'support@ahmed-store.com',
          phone: '01012345678',
          whatsapp: '01012345678',

          country: 'مصر',
          city: 'القاهرة',
          address: '15 شارع التحرير، الدقي',
          postalCode: '12611',

          currency: 'EGP',
          timezone: 'Africa/Cairo',
          weightUnit: 'kg',
          dateFormat: 'DD/MM/YYYY',

          taxEnabled: true,
          taxRate: 14,
          pricesIncludeTax: true,
          taxNumber: '',

          orderPrefix: 'EDX',
          minOrderValue: null,
          allowGuestCheckout: true,
          requirePhone: true,
          autoCancelUnpaidHours: 48,

          maintenanceMode: false,
          maintenanceMessage: 'المتجر تحت الصيانة حالياً، سنعود قريباً.'
        }
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل إعدادات المتجر'
      } finally {
        this.loading = false
      }
    },

    async updateSettings(settings: StoreSettings) {
      this.saving = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800))
        this.settings = { ...settings }
      } finally {
        this.saving = false
      }
    }
  }
})
