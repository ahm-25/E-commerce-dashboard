import { defineStore } from 'pinia'

export type ShippingRateType = 'flat' | 'free' | 'weight'

export interface ShippingRate {
  id: string
  name: string
  type: ShippingRateType
  price: number           // flat price, or base price for weight-based rates
  pricePerKg?: number     // weight-based only: added for each kg above includedKg
  includedKg?: number
  freeAbove?: number | null // order subtotal above which this rate becomes free
  minDays: number
  maxDays: number
}

export interface ShippingZone {
  id: string
  name: string
  regions: string[]
  rates: ShippingRate[]
  isActive: boolean
}

export interface ShippingCarrier {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected'
  supportsCod: boolean
  supportsTracking: boolean
}

export interface ShippingSettings {
  processingDays: number
  defaultWeightKg: number
  localPickupEnabled: boolean
  localPickupAddress: string
  showDeliveryEstimate: boolean
}

export const EGYPT_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الشرقية', 'الدقهلية', 'الغربية',
  'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس',
  'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
  'البحر الأحمر', 'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء'
]

export const useShippingStore = defineStore('shipping', {
  state: () => ({
    zones: [] as ShippingZone[],
    carriers: [] as ShippingCarrier[],
    settings: {
      processingDays: 1,
      defaultWeightKg: 0.5,
      localPickupEnabled: false,
      localPickupAddress: '',
      showDeliveryEstimate: true
    } as ShippingSettings,
    loading: false,
    loaded: false,
    error: null as string | null,

    // Zone editor
    isZoneDialogOpen: false,
    zoneToEdit: null as ShippingZone | null
  }),

  getters: {
    coveredRegions: (state) => new Set(state.zones.flatMap(z => z.regions)),

    uncoveredRegions(): string[] {
      return EGYPT_GOVERNORATES.filter(r => !this.coveredRegions.has(r))
    },

    activeZonesCount: (state) => state.zones.filter(z => z.isActive).length,

    connectedCarriersCount: (state) => state.carriers.filter(c => c.status === 'connected').length
  },

  actions: {
    async fetchShipping() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<{ zones: ShippingZone[], carriers: ShippingCarrier[], settings: ShippingSettings }>('/api/admin/shipping')
        this.zones = data.zones
        this.carriers = data.carriers
        this.settings = data.settings
        this.loaded = true
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل إعدادات الشحن')
      } finally {
        this.loading = false
      }
    },

    openZoneDialog(zone: ShippingZone | null = null) {
      this.zoneToEdit = zone
      this.isZoneDialogOpen = true
    },

    closeZoneDialog() {
      this.isZoneDialogOpen = false
      this.zoneToEdit = null
    },

    async saveZone(zone: ShippingZone) {
      const saved = await $fetch<ShippingZone>(`/api/admin/shipping/zones/${encodeURIComponent(zone.id)}`, { method: 'PUT', body: zone })

      const index = this.zones.findIndex(z => z.id === saved.id)
      if (index === -1) {
        this.zones.push(saved)
      } else {
        this.zones[index] = saved
      }
    },

    async deleteZone(id: string) {
      await $fetch(`/api/admin/shipping/zones/${encodeURIComponent(id)}`, { method: 'DELETE' })
      this.zones = this.zones.filter(z => z.id !== id)
    },

    async toggleZone(id: string) {
      const zone = this.zones.find(z => z.id === id)
      if (zone) await this.saveZone({ ...zone, isActive: !zone.isActive })
    },

    async toggleCarrier(id: string) {
      // TODO: Real connection needs the carrier's API credentials
      const carrier = this.carriers.find(c => c.id === id)
      if (!carrier) return
      const status = carrier.status === 'connected' ? 'disconnected' : 'connected'
      const saved = await $fetch<ShippingCarrier>(`/api/admin/shipping/carriers/${encodeURIComponent(id)}`, { method: 'PUT', body: { status } })
      Object.assign(carrier, saved)
    },

    async updateSettings(settings: ShippingSettings) {
      this.settings = await $fetch<ShippingSettings>('/api/admin/shipping/settings', { method: 'PUT', body: settings })
    }
  }
})
