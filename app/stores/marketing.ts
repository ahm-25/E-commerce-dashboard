import { defineStore } from 'pinia'
import { apiError } from '~/utils/apiError'

// Same shape as server/utils/marketing.ts
export interface MarketingSettings {
  whatsapp: {
    enabled: boolean
    phone: string
    message: string
    productButton: boolean
  }
  tracking: {
    metaPixelId: string
    tiktokPixelId: string
    snapPixelId: string
    ga4MeasurementId: string
  }
  updatedAt: string
}

export const useMarketingStore = defineStore('marketing', {
  state: () => ({
    settings: null as MarketingSettings | null,
    loading: false,
    saving: false,
    error: null as string | null
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        this.settings = await $fetch<MarketingSettings>('/api/admin/marketing')
      } catch (err) {
        this.error = apiError(err, 'تعذر تحميل إعدادات التسويق')
      } finally {
        this.loading = false
      }
    },

    async updateSettings(settings: MarketingSettings) {
      this.saving = true
      try {
        this.settings = await $fetch<MarketingSettings>('/api/admin/marketing', { method: 'PUT', body: settings })
      } catch (err) {
        throw new Error(apiError(err, 'حدث خطأ أثناء حفظ الإعدادات'))
      } finally {
        this.saving = false
      }
    }
  }
})
