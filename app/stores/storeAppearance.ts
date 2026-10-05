import { defineStore } from 'pinia'

export interface StoreAppearance {
  logo?: string
  favicon?: string

  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }

  typography: {
    fontFamily: string
    baseFontSize?: number
  }

  shape: {
    borderRadius: 'sharp' | 'small' | 'medium' | 'large'
    buttonStyle: 'rounded' | 'soft' | 'square' | 'pill'
  }

  productCard: {
    style: 'minimal' | 'classic' | 'elevated' | 'bordered'
  }

  header: {
    style: HeaderStyle
    background: SurfaceTone
    sticky: boolean
    showSearch: boolean
    showWishlist: boolean
    showCart: boolean
  }

  announcementBar?: {
    enabled: boolean
    text?: string
    link?: string
  }

  footer?: {
    style?: FooterStyle
    background?: SurfaceTone
    showNewsletter?: boolean
    showSocialLinks?: boolean
    showContactInfo?: boolean
    showPaymentMethods?: boolean
  }
}

export type HeaderStyle = 'classic' | 'centered' | 'split' | 'search' | 'floating' | 'minimal'
export type FooterStyle = 'columns' | 'newsletter' | 'centered' | 'compact'
// Background of the header / footer: white, near-black, or the brand's primary color
export type SurfaceTone = 'light' | 'dark' | 'brand'

export const defaultAppearance = (): StoreAppearance => ({
  logo: '',
  favicon: '',
  colors: {
    primary: '#2563EB',
    secondary: '#1E40AF',
    accent: '#3B82F6',
    text: '#111827',
    background: '#F9FAFB'
  },
  typography: {
    fontFamily: 'Cairo',
    baseFontSize: 16
  },
  shape: {
    borderRadius: 'medium',
    buttonStyle: 'rounded'
  },
  productCard: {
    style: 'elevated'
  },
  header: {
    style: 'classic',
    background: 'light',
    sticky: true,
    showSearch: true,
    showWishlist: true,
    showCart: true
  },
  announcementBar: {
    enabled: true,
    text: 'شحن مجاني للطلبات أكثر من 1000 جنيه',
    link: ''
  },
  footer: {
    style: 'columns',
    background: 'dark',
    showNewsletter: true,
    showSocialLinks: true,
    showContactInfo: true,
    showPaymentMethods: true
  }
})

export const useStoreAppearanceStore = defineStore('storeAppearance', {
  state: () => ({
    appearance: null as StoreAppearance | null,
    draftAppearance: null as StoreAppearance | null,
    isLoading: true,
    isSaving: false,
    isPublishing: false,
    lastPublished: null as string | null,
    hasUnsavedChanges: false,
  }),

  actions: {
    async fetchAppearance() {
      this.isLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        // TODO: Replace with API call; merge the saved data over defaultAppearance() so fields added later get their defaults
        const saved = defaultAppearance()

        this.appearance = JSON.parse(JSON.stringify(saved))
        this.draftAppearance = JSON.parse(JSON.stringify(saved))
        this.hasUnsavedChanges = false
        this.lastPublished = new Date(Date.now() - 1000 * 60 * 12).toISOString() // 12 mins ago
      } catch (error) {
        console.error('Failed to fetch appearance', error)
      } finally {
        this.isLoading = false
      }
    },

    updateDraft(key: keyof StoreAppearance, value: any) {
      if (!this.draftAppearance) return
      this.draftAppearance[key] = value as never
      this.hasUnsavedChanges = true
    },

    async saveDraft() {
      this.isSaving = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        this.hasUnsavedChanges = false
        return true
      } catch (error) {
        console.error('Failed to save draft', error)
        throw error
      } finally {
        this.isSaving = false
      }
    },

    async publishAppearance() {
      this.isPublishing = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.appearance = JSON.parse(JSON.stringify(this.draftAppearance))
        this.hasUnsavedChanges = false
        this.lastPublished = new Date().toISOString()
        return true
      } catch (error) {
        console.error('Failed to publish appearance', error)
        throw error
      } finally {
        this.isPublishing = false
      }
    },

    async resetAppearance() {
      if (!this.appearance) return
      this.draftAppearance = JSON.parse(JSON.stringify(this.appearance))
      this.hasUnsavedChanges = false
    },
    
    async resetToDefault() {
      this.draftAppearance = defaultAppearance()
      this.hasUnsavedChanges = true
    }
  }
})
