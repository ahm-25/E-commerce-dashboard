// Marketing settings managed from the dashboard and read by the storefront:
// the floating WhatsApp button and the ad / analytics pixels.

export interface MarketingSettings {
  whatsapp: {
    enabled: boolean
    phone: string            // as typed by the merchant, e.g. 01012345678
    message: string          // first message of a general chat
    productButton: boolean   // "order via WhatsApp" on product pages
  }
  tracking: {
    metaPixelId: string      // Facebook / Instagram
    tiktokPixelId: string
    snapPixelId: string
    ga4MeasurementId: string // G-XXXXXXX
  }
  updatedAt: string
}

export const seedMarketing = (): MarketingSettings => ({
  whatsapp: {
    enabled: true,
    phone: '01012345678',
    message: 'مرحباً، عندي استفسار عن منتج في المتجر',
    productButton: true
  },
  tracking: { metaPixelId: '', tiktokPixelId: '', snapPixelId: '', ga4MeasurementId: '' },
  updatedAt: new Date().toISOString()
})

// wa.me needs the international form without "+": 01012345678 -> 201012345678
export const whatsappNumber = (phone: string) => {
  const local = normalizePhone(phone)
  return local ? `20${local}` : ''
}

const PATTERNS: [keyof MarketingSettings['tracking'], RegExp, string][] = [
  ['metaPixelId', /^\d{15,16}$/, 'معرّف Meta Pixel يتكون من 15 أو 16 رقماً'],
  ['tiktokPixelId', /^[A-Z0-9]{20}$/, 'معرّف TikTok Pixel يتكون من 20 حرفاً ورقماً (حروف كبيرة)'],
  ['snapPixelId', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'معرّف Snap Pixel بصيغة xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
  ['ga4MeasurementId', /^G-[A-Z0-9]{4,12}$/, 'معرّف Google Analytics 4 يبدأ بـ G- مثل G-ABC123XYZ']
]

// Trims everything and returns the first problem, if any
export function validateMarketing(input: MarketingSettings): { settings: MarketingSettings, error: string | null } {
  const w = input?.whatsapp ?? {} as MarketingSettings['whatsapp']
  const t = input?.tracking ?? {} as MarketingSettings['tracking']
  const settings: MarketingSettings = {
    whatsapp: {
      enabled: !!w.enabled,
      phone: String(w.phone ?? '').trim(),
      message: String(w.message ?? '').trim().slice(0, 300),
      productButton: !!w.productButton
    },
    tracking: {
      metaPixelId: String(t.metaPixelId ?? '').trim(),
      tiktokPixelId: String(t.tiktokPixelId ?? '').trim().toUpperCase(),
      snapPixelId: String(t.snapPixelId ?? '').trim(),
      ga4MeasurementId: String(t.ga4MeasurementId ?? '').trim().toUpperCase()
    },
    updatedAt: new Date().toISOString()
  }

  if ((settings.whatsapp.enabled || settings.whatsapp.productButton) && !/^1[0125]\d{8}$/.test(normalizePhone(settings.whatsapp.phone))) {
    return { settings, error: 'رقم الواتساب يجب أن يكون رقم موبايل مصري صحيح (مثل 01012345678)' }
  }
  for (const [key, re, message] of PATTERNS) {
    if (settings.tracking[key] && !re.test(settings.tracking[key])) return { settings, error: message }
  }
  return { settings, error: null }
}

// What the storefront needs; wa.me number is resolved here so the client doesn't parse phones
export const toStorefrontMarketing = (m: MarketingSettings) => ({
  whatsapp: {
    enabled: m.whatsapp.enabled,
    productButton: m.whatsapp.productButton,
    number: whatsappNumber(m.whatsapp.phone),
    message: m.whatsapp.message
  },
  tracking: {
    metaPixelId: m.tracking.metaPixelId || null,
    tiktokPixelId: m.tracking.tiktokPixelId || null,
    snapPixelId: m.tracking.snapPixelId || null,
    ga4MeasurementId: m.tracking.ga4MeasurementId || null
  }
})
