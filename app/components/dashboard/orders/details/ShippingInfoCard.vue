<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
        <Icon name="ph:truck" class="w-5 h-5" />
      </div>
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">معلومات الشحن</h2>
    </div>

    <div v-if="order.shipping" class="space-y-6">
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-sm text-primary-navy dark:text-white flex items-center gap-1.5">
            طريقة الشحن
          </h3>
          <span class="px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded text-xs font-bold">{{ order.shipping.method || 'غير محدد' }}</span>
        </div>
        <div class="text-sm text-muted flex items-center gap-1.5" v-if="order.shipping.estimatedDelivery">
          <Icon name="ph:calendar-blank" class="w-4 h-4" />
          متوقع الوصول: {{ formatDate(order.shipping.estimatedDelivery) }}
        </div>
      </div>

      <div v-if="order.shipping.trackingNumber" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-muted">رقم التتبع</span>
          <button @click="copyTracking" class="text-xs text-primary hover:underline flex items-center gap-1">
            <Icon name="ph:copy" class="w-3 h-3" />
            نسخ
          </button>
        </div>
        <div class="font-bold text-primary-navy dark:text-white font-mono tracking-wider">{{ order.shipping.trackingNumber }}</div>
        <button class="w-full mt-3 py-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Icon name="ph:map-pin-line" class="w-4 h-4 text-primary" />
          تتبع الشحنة
        </button>
      </div>

      <div v-if="order.shipping.address">
        <h3 class="font-bold text-sm text-primary-navy dark:text-white flex items-center gap-1.5 mb-2">
          <Icon name="ph:map-pin" class="w-4 h-4 text-gray-400" />
          عنوان الشحن
        </h3>
        <address class="text-sm text-muted not-italic leading-relaxed p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div class="font-bold text-text mb-1">{{ order.shipping.address.name }}</div>
          <div>{{ order.shipping.address.street }}</div>
          <div>{{ order.shipping.address.city }}</div>
          <div v-if="order.shipping.address.state">{{ order.shipping.address.state }}</div>
          <div>{{ order.shipping.address.country }}</div>
        </address>
      </div>
    </div>
    
    <div v-else class="text-center py-6 text-muted text-sm bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-border-light dark:border-border-dark">
      لا توجد معلومات شحن متاحة
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}

const copyTracking = () => {
  if (props.order.shipping?.trackingNumber) {
    navigator.clipboard.writeText(props.order.shipping.trackingNumber)
    // TODO: show toast
  }
}
</script>
