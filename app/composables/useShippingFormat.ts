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

// Second line for weight-based rates
export const formatExtraWeight = (rate: ShippingRate) =>
  rate.type === 'weight' ? `+ ${rate.pricePerKg ?? 0} ${CURRENCY} لكل كجم إضافي` : ''

export const formatDeliveryTime = (rate: ShippingRate) => {
  if (rate.maxDays === 0) return 'نفس اليوم'
  if (rate.minDays === rate.maxDays) return `${rate.maxDays} يوم عمل`
  return `${rate.minDays} - ${rate.maxDays} أيام عمل`
}
