import { defineStore } from 'pinia'

export type AnalyticsPeriod = 7 | 30 | 90

export interface DailyPoint {
  date: string // ISO date (YYYY-MM-DD)
  revenue: number
  orders: number
  visits: number
}

export interface BreakdownRow {
  label: string
  revenue: number
  orders: number
}

export interface ProductRow {
  name: string
  category: string
  units: number
  revenue: number
}

export interface FunnelStep {
  label: string
  count: number
}

export interface AnalyticsData {
  current: DailyPoint[]
  previous: DailyPoint[]
  categories: BreakdownRow[]
  regions: BreakdownRow[]
  products: ProductRow[]
  funnel: FunnelStep[]
  newCustomers: number
  returningCustomers: number
}

export interface PeriodTotals {
  revenue: number
  orders: number
  visits: number
  aov: number
  conversionRate: number
}

// Deterministic PRNG so the mock numbers don't change on every reload
const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6D2B79F5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10)

const generateDays = (endDate: Date, days: number, random: () => number, growth: number): DailyPoint[] => {
  const points: DailyPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)

    // Thursday/Friday are the busiest shopping days
    const weekday = date.getDay()
    const weekly = weekday === 4 || weekday === 5 ? 1.3 : weekday === 6 ? 1.1 : 1
    const trend = 1 + growth * ((days - i) / days)
    const noise = 0.8 + random() * 0.4

    const revenue = Math.round(2800 * weekly * trend * noise)
    const aov = 340 + random() * 80
    const orders = Math.max(1, Math.round(revenue / aov))
    const visits = Math.round(orders / (0.028 + random() * 0.01))

    points.push({ date: toIsoDate(date), revenue, orders, visits })
  }
  return points
}

const splitByShare = (total: number, totalOrders: number, shares: [string, number][]): BreakdownRow[] =>
  shares.map(([label, share]) => ({
    label,
    revenue: Math.round(total * share),
    orders: Math.round(totalOrders * share)
  }))

export const sumTotals = (points: DailyPoint[]): PeriodTotals => {
  const revenue = points.reduce((s, p) => s + p.revenue, 0)
  const orders = points.reduce((s, p) => s + p.orders, 0)
  const visits = points.reduce((s, p) => s + p.visits, 0)
  return {
    revenue,
    orders,
    visits,
    aov: orders ? revenue / orders : 0,
    conversionRate: visits ? (orders / visits) * 100 : 0
  }
}

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    period: 30 as AnalyticsPeriod,
    data: null as AnalyticsData | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    totals: (state): PeriodTotals | null => (state.data ? sumTotals(state.data.current) : null),
    previousTotals: (state): PeriodTotals | null => (state.data ? sumTotals(state.data.previous) : null)
  },

  actions: {
    async fetchAnalytics(period: AnalyticsPeriod = this.period) {
      this.period = period
      this.loading = true
      this.error = null
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const random = mulberry32(period * 7919)
        const today = new Date()
        const previousEnd = new Date(today)
        previousEnd.setDate(previousEnd.getDate() - period)

        const current = generateDays(today, period, random, 0.18)
        const previous = generateDays(previousEnd, period, random, 0.05)
        const { revenue, orders, visits } = sumTotals(current)

        const categories = splitByShare(revenue, orders, [
          ['الإلكترونيات', 0.42], ['الملابس', 0.21], ['المنزل والمطبخ', 0.14],
          ['الجمال والعناية', 0.12], ['الرياضة واللياقة', 0.11]
        ])

        const regions = splitByShare(revenue, orders, [
          ['القاهرة', 0.38], ['الجيزة', 0.19], ['الإسكندرية', 0.12], ['الدقهلية', 0.07],
          ['الشرقية', 0.06], ['القليوبية', 0.05], ['محافظات أخرى', 0.13]
        ])

        const products: ProductRow[] = [
          ['هاتف Samsung Galaxy S24', 'الإلكترونيات', 2850, 0.14],
          ['سماعات لاسلكية Pro', 'الإلكترونيات', 650, 0.09],
          ['ساعة ذكية Series 9', 'الإلكترونيات', 1900, 0.08],
          ['جاكيت جلد رجالي', 'الملابس', 1200, 0.06],
          ['طقم أواني جرانيت', 'المنزل والمطبخ', 950, 0.05],
          ['مجموعة العناية بالبشرة', 'الجمال والعناية', 480, 0.04],
          ['حذاء جري رياضي', 'الرياضة واللياقة', 1100, 0.04],
          ['خلاط كهربائي', 'المنزل والمطبخ', 720, 0.03]
        ].map(([name, category, price, share]) => {
          const productRevenue = Math.round(revenue * (share as number))
          return {
            name: name as string,
            category: category as string,
            units: Math.max(1, Math.round(productRevenue / (price as number))),
            revenue: productRevenue
          }
        })

        const funnel: FunnelStep[] = [
          { label: 'زيارات المتجر', count: visits },
          { label: 'مشاهدة منتج', count: Math.round(visits * 0.61) },
          { label: 'إضافة للسلة', count: Math.round(visits * 0.17) },
          { label: 'بدء الدفع', count: Math.round(visits * 0.068) },
          { label: 'طلب مكتمل', count: orders }
        ]

        const returningCustomers = Math.round(orders * 0.36)

        this.data = {
          current,
          previous,
          categories,
          regions,
          products,
          funnel,
          newCustomers: orders - returningCustomers,
          returningCustomers
        }
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل التحليلات'
      } finally {
        this.loading = false
      }
    }
  }
})
