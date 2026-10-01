import type { ShippingRate } from '~/stores/shipping'

// TODO: Read the currency symbol from store settings
const CURRENCY = 'ج.م'

export const formatRatePrice = (rate: ShippingRate) => {
  if (rate.type === 'free') return 'مجاني'
  if (rate.type === 'weight') {
    return `${rate.price} ${CURRENCY} حتى ${rate.includedKg ?? 0} كجم + ${rate.pricePerKg ?? 0} ${CURRENCY}/كجم`
  }
  return `${rate.price.toLocaleString()} ${CURRENCY}`
}

export const formatDeliveryTime = (rate: ShippingRate) => {
  if (rate.maxDays === 0) return 'نفس اليوم'
  if (rate.minDays === rate.maxDays) return `${rate.maxDays} يوم عمل`
  return `${rate.minDays} - ${rate.maxDays} أيام عمل`
}
