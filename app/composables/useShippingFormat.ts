import type { ShippingRate } from '~/stores/shipping'

// TODO: Read the currency symbol from store settings
const CURRENCY = 'ج.م'

export const formatRatePrice = (rate: ShippingRate) => {
  if (rate.type === 'free') return 'مجاني'
  if (rate.type === 'weight') {
    return `${rate.price.toLocaleString()} ${CURRENCY} لأول ${rate.includedKg ?? 0} كجم`
  }
  return `${rate.price.toLocaleString()} ${CURRENCY}`
}

// Shipping cost of a rate for an order's subtotal and total weight
export const calculateRateCost = (rate: ShippingRate, subtotal: number, weightKg: number) => {
  if (rate.type === 'free') return 0
  if (rate.freeAbove != null && subtotal >= rate.freeAbove) return 0
  if (rate.type === 'weight') {
    const extraKg = Math.max(0, Math.ceil(weightKg - (rate.includedKg ?? 0)))
    return rate.price + extraKg * (rate.pricePerKg ?? 0)
  }
  return rate.price
}

// Second line for weight-based rates
export const formatExtraWeight = (rate: ShippingRate) =>
  rate.type === 'weight' ? `+ ${rate.pricePerKg ?? 0} ${CURRENCY} لكل كجم إضافي` : ''

export const formatDeliveryTime = (rate: ShippingRate) => {
  if (rate.maxDays === 0) return 'نفس اليوم'
  if (rate.minDays === rate.maxDays) return `${rate.maxDays} يوم عمل`
  return `${rate.minDays} - ${rate.maxDays} أيام عمل`
}
