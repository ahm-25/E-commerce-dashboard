import type { Discount } from '~/stores/discounts'
import type { ShippingZone, ShippingCarrier, ShippingSettings } from '~/stores/shipping'
import type { PaymentMethod, PaymentGateway, PaymentSettings } from '~/stores/payments'

// Initial data written to storage the first time a collection is read.
// Moved here from the Pinia stores so the dashboard and the storefront share it.

export const seedDiscounts = (): Discount[] => [
  {
    id: 'DSC-00042',
    name: 'خصم الصيف',
    code: 'SUMMER25',
    method: 'coupon',
    type: 'percentage',
    value: 25,
    scope: 'all',
    customerEligibility: 'all',
    firstOrderOnly: false,
    usageCount: 142,
    usageLimit: 500,
    onePerCustomer: true,
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: '2026-09-30T23:59:59.000Z',
    status: 'active'
  },
  {
    id: 'DSC-00043',
    name: 'شحن مجاني للطلبات الكبيرة',
    code: 'تلقائي',
    method: 'automatic',
    type: 'free_shipping',
    value: 0,
    scope: 'all',
    minOrderValue: 1000,
    customerEligibility: 'all',
    firstOrderOnly: false,
    usageCount: 28,
    onePerCustomer: false,
    startDate: '2026-09-10T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'DSC-00044',
    name: 'خصم العودة للمدارس',
    code: 'SCHOOL26',
    method: 'coupon',
    type: 'fixed',
    value: 350,
    scope: 'categories',
    selectedCategories: ['أدوات مدرسية', 'حقائب'],
    customerEligibility: 'all',
    firstOrderOnly: false,
    usageCount: 0,
    usageLimit: 100,
    onePerCustomer: true,
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-15T23:59:59.000Z',
    status: 'scheduled'
  },
  {
    id: 'DSC-00045',
    name: 'خصم الشتاء',
    code: 'WINTER25',
    method: 'coupon',
    type: 'percentage',
    value: 15,
    scope: 'products',
    customerEligibility: 'all',
    firstOrderOnly: false,
    usageCount: 450,
    usageLimit: 500,
    onePerCustomer: false,
    startDate: '2025-12-01T00:00:00.000Z',
    endDate: '2026-02-28T23:59:59.000Z',
    status: 'expired'
  }
]

export interface ShippingData {
  zones: ShippingZone[]
  carriers: ShippingCarrier[]
  settings: ShippingSettings
}

export const seedShipping = (): ShippingData => ({
  zones: [
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
  ],
  carriers: [
    { id: 'bosta', name: 'Bosta', description: 'توصيل محلي داخل مصر مع تحصيل نقدي', status: 'connected', supportsCod: true, supportsTracking: true },
    { id: 'aramex', name: 'Aramex', description: 'شحن محلي ودولي', status: 'disconnected', supportsCod: true, supportsTracking: true },
    { id: 'mylerz', name: 'Mylerz', description: 'توصيل سريع للتجارة الإلكترونية', status: 'disconnected', supportsCod: true, supportsTracking: true },
    { id: 'jt', name: 'J&T Express', description: 'شحن اقتصادي لكل المحافظات', status: 'disconnected', supportsCod: true, supportsTracking: false }
  ],
  settings: {
    processingDays: 1,
    defaultWeightKg: 0.5,
    localPickupEnabled: false,
    localPickupAddress: '',
    showDeliveryEstimate: true
  }
})

export interface PaymentsData {
  methods: PaymentMethod[]
  gateways: PaymentGateway[]
  settings: PaymentSettings
}

export const seedPayments = (): PaymentsData => {
  const now = new Date().toISOString()
  return {
    methods: [
      { id: '1', name: 'الدفع عند الاستلام', type: 'cod', provider: null, fees: { type: 'fixed', fixedAmount: 15 }, status: 'active', order: 1, isDefault: true, updatedAt: now },
      { id: '2', name: 'البطاقات الائتمانية', type: 'card', provider: 'Stripe', fees: { type: 'percentage', percentage: 2.5 }, status: 'active', order: 2, isDefault: false, updatedAt: now },
      { id: '3', name: 'المحافظ الإلكترونية', type: 'wallet', provider: 'Paymob', fees: { type: 'none' }, status: 'setup_required', order: 3, isDefault: false, updatedAt: now },
      { id: '4', name: 'تحويل بنكي', type: 'bank_transfer', provider: null, fees: { type: 'none' }, status: 'inactive', order: 4, isDefault: false, updatedAt: now }
    ],
    gateways: [
      { id: 'g1', providerName: 'Stripe', description: 'بوابة الدفع الإلكترونية العالمية.', status: 'connected', environment: 'live', supportedMethods: ['card'], lastConnectionCheck: now },
      { id: 'g2', providerName: 'Paymob', description: 'بوابة الدفع المحلية لدعم المحافظ والبطاقات.', status: 'setup_required', environment: 'test', supportedMethods: ['card', 'wallet'] }
    ],
    settings: {
      enableElectronicPayments: true,
      allowMultipleMethods: true,
      showUnavailableMethods: false,
      defaultMethodId: '1',
      saveMethodsForFuture: false,
      failedPaymentBehavior: 'retry'
    }
  }
}
