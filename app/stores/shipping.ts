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
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800))

        this.zones = [
          {
            id: 'z1',
            name: 'القاهرة الكبرى',
            regions: ['القاهرة', 'الجيزة', 'القليوبية'],
            isActive: true,
            rates: [
              { id: 'r1', name: 'توصيل عادي', type: 'flat', price: 50, freeAbove: 1000, minDays: 1, maxDays: 2 },
              { id: 'r2', name: 'توصيل في نفس اليوم', type: 'flat', price: 100, minDays: 0, maxDays: 0 }
            ]
          },
          {
            id: 'z2',
            name: 'الدلتا والقناة',
            regions: ['الإسكندرية', 'الشرقية', 'الدقهلية', 'الغربية', 'المنوفية', 'البحيرة', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس'],
            isActive: true,
            rates: [
              { id: 'r3', name: 'توصيل عادي', type: 'weight', price: 65, includedKg: 2, pricePerKg: 10, freeAbove: 1500, minDays: 2, maxDays: 4 }
            ]
          },
          {
            id: 'z3',
            name: 'الصعيد',
            regions: ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان'],
            isActive: false,
            rates: [
              { id: 'r4', name: 'توصيل عادي', type: 'flat', price: 85, minDays: 3, maxDays: 6 }
            ]
          }
        ]

        this.carriers = [
          { id: 'bosta', name: 'Bosta', description: 'توصيل محلي داخل مصر مع تحصيل نقدي', status: 'connected', supportsCod: true, supportsTracking: true },
          { id: 'aramex', name: 'Aramex', description: 'شحن محلي ودولي', status: 'disconnected', supportsCod: true, supportsTracking: true },
          { id: 'mylerz', name: 'Mylerz', description: 'توصيل سريع للتجارة الإلكترونية', status: 'disconnected', supportsCod: true, supportsTracking: true },
          { id: 'jt', name: 'J&T Express', description: 'شحن اقتصادي لكل المحافظات', status: 'disconnected', supportsCod: true, supportsTracking: false }
        ]

        this.loaded = true
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل إعدادات الشحن'
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
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600))

      const index = this.zones.findIndex(z => z.id === zone.id)
      if (index === -1) {
        this.zones.push(zone)
      } else {
        this.zones[index] = zone
      }
    },

    async deleteZone(id: string) {
      this.zones = this.zones.filter(z => z.id !== id)
    },

    async toggleZone(id: string) {
      const zone = this.zones.find(z => z.id === id)
      if (zone) zone.isActive = !zone.isActive
    },

    async toggleCarrier(id: string) {
      // TODO: Real connection needs the carrier's API credentials
      await new Promise(resolve => setTimeout(resolve, 600))
      const carrier = this.carriers.find(c => c.id === id)
      if (carrier) carrier.status = carrier.status === 'connected' ? 'disconnected' : 'connected'
    },

    async updateSettings(settings: ShippingSettings) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600))
      this.settings = { ...settings }
    }
  }
})
