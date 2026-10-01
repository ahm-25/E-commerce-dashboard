import { ref, computed, onMounted } from 'vue'
import { usePaymentsStore } from '~/stores/payments'

export const usePayments = () => {
  const store = usePaymentsStore()

  onMounted(() => {
    if (store.paymentMethods.length === 0) {
      store.fetchPaymentData()
    }
  })

  const formatFees = (fees: any) => {
    if (!fees || fees.type === 'none') return 'بدون رسوم'
    if (fees.type === 'percentage') return `${fees.percentage}%`
    if (fees.type === 'fixed') return `${fees.fixedAmount} ج.م` // Mock currency for now, real app uses store currency
    if (fees.type === 'both') return `${fees.percentage}% + ${fees.fixedAmount} ج.م`
    return 'بدون رسوم'
  }

  const getMethodTypeLabel = (type: string) => {
    switch (type) {
      case 'cod': return 'دفع عند الاستلام'
      case 'card': return 'بطاقة'
      case 'wallet': return 'محفظة إلكترونية'
      case 'bank_transfer': return 'تحويل بنكي'
      default: return 'أخرى'
    }
  }

  const getMethodStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50'
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
      case 'setup_required': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
      case 'disconnected': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-900/50'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }
  
  const getMethodStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'مفعلة'
      case 'inactive': return 'غير مفعلة'
      case 'setup_required': return 'تحتاج إلى إعداد'
      case 'disconnected': return 'غير متصلة'
      default: return 'غير معروف'
    }
  }

  const getGatewayStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50'
      case 'setup_required': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
      case 'disconnected': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
      case 'error': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-900/50'
      case 'disabled': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500 border-gray-200 dark:border-gray-700'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  const getGatewayStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'متصلة'
      case 'setup_required': return 'تحتاج إعداد'
      case 'disconnected': return 'غير متصلة'
      case 'error': return 'خطأ اتصال'
      case 'disabled': return 'معطلة'
      default: return 'غير معروف'
    }
  }

  return {
    store,
    formatFees,
    getMethodTypeLabel,
    getMethodStatusColor,
    getMethodStatusLabel,
    getGatewayStatusColor,
    getGatewayStatusLabel
  }
}
