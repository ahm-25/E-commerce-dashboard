import type { SurfaceTone } from '~/stores/storeAppearance'

// Colors of a header / footer for its background tone, so text and borders stay readable
export const toneColors = (tone: SurfaceTone | undefined, brand: string, text: string) => {
  switch (tone) {
    case 'dark':
      return { bg: '#111827', text: '#FFFFFF', muted: '#9CA3AF', border: '#1F2937', soft: '#1F2937' }
    case 'brand':
      return { bg: brand, text: '#FFFFFF', muted: 'rgba(255,255,255,0.75)', border: 'rgba(255,255,255,0.18)', soft: 'rgba(255,255,255,0.14)' }
    default:
      return { bg: '#FFFFFF', text, muted: '#6B7280', border: '#F1F2F4', soft: '#F3F4F6' }
  }
}
