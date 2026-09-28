<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
        <Icon name="ph:credit-card" class="w-5 h-5" />
      </div>
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">الدفع</h2>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">حالة الدفع</span>
        <span 
          class="px-2.5 py-1 rounded text-xs font-bold"
          :class="{
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400': order.payment.status === 'paid',
            'bg-warning/10 text-warning': order.payment.status === 'pending',
            'bg-danger/10 text-danger': order.payment.status === 'failed',
            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400': order.payment.status === 'refunded'
          }"
        >
          {{ getPaymentStatusLabel(order.payment.status) }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">طريقة الدفع</span>
        <div class="flex items-center gap-1.5 font-medium text-sm text-primary-navy dark:text-white">
          <Icon :name="getPaymentMethodIcon(order.payment.method)" class="w-4 h-4 text-gray-400" />
          {{ order.payment.method || 'غير محدد' }}
        </div>
      </div>

      <div v-if="order.payment.transactionId" class="flex items-center justify-between">
        <span class="text-sm text-muted">رقم العملية</span>
        <span class="text-sm font-mono text-primary-navy dark:text-white">{{ order.payment.transactionId }}</span>
      </div>

      <div v-if="order.payment.paidAt" class="flex items-center justify-between">
        <span class="text-sm text-muted">تم الدفع في</span>
        <span class="text-sm text-primary-navy dark:text-white">{{ formatDate(order.payment.paidAt) }}</span>
      </div>

      <div v-if="order.payment.method === 'الدفع عند الاستلام' || order.payment.method === 'COD'" class="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-2">
        <Icon name="ph:info" class="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div class="text-sm text-warning-dark">
          <strong>الدفع عند الاستلام:</strong> 
          يجب تحصيل المبلغ من العميل عند التوصيل وتحديث حالة الطلب.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any
}>()

const getPaymentStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'paid': 'مدفوع',
    'pending': 'قيد الانتظار',
    'failed': 'فشل',
    'refunded': 'مسترد'
  }
  return map[status] || status
}

const getPaymentMethodIcon = (method?: string) => {
  if (!method) return 'ph:credit-card'
  const m = method.toLowerCase()
  if (m.includes('بطاقة') || m.includes('card')) return 'ph:credit-card'
  if (m.includes('استلام') || m.includes('cod')) return 'ph:money'
  if (m.includes('محفظة') || m.includes('wallet')) return 'ph:wallet'
  return 'ph:bank'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}
</script>
