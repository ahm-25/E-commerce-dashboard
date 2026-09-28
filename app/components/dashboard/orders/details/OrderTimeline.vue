<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
        <Icon name="ph:clock-counter-clockwise" class="w-5 h-5" />
      </div>
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">سجل الطلب</h2>
    </div>

    <div class="relative pl-2 sm:pl-0 pr-4 sm:pr-4 border-r-2 border-gray-100 dark:border-gray-800 space-y-8">
      <div v-for="(event, index) in order.timeline" :key="event.id" class="relative">
        <div class="absolute -right-[25px] w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark bg-primary"></div>
        
        <div class="mr-4">
          <div class="flex items-center gap-2 mb-1">
            <Icon :name="event.icon || getStatusIcon(event.status)" class="w-5 h-5" :class="getStatusColor(event.status)" />
            <h3 class="font-bold text-primary-navy dark:text-white">{{ getStatusLabel(event.status) }}</h3>
          </div>
          <div class="text-sm text-muted mb-2">{{ formatDate(event.timestamp) }}</div>
          
          <div v-if="event.actor || event.note" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border border-gray-100 dark:border-gray-700">
            <div v-if="event.actor" class="flex items-center gap-1.5 mb-1">
              <Icon name="ph:user" class="w-4 h-4 text-gray-400" />
              <span class="text-muted">بواسطة:</span>
              <span class="font-medium text-primary-navy dark:text-white">{{ event.actor }}</span>
            </div>
            <div v-if="event.note" class="text-muted mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              {{ event.note }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pending steps -->
      <div v-for="(step, index) in pendingSteps" :key="index" class="relative opacity-50">
        <div class="absolute -right-[25px] w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark bg-gray-200 dark:bg-gray-700"></div>
        <div class="mr-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
            <h3 class="font-medium text-gray-500">{{ step.label }}</h3>
          </div>
          <div class="text-sm text-gray-400">لم يتم بعد</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  order: any
}>()

const statusMap: Record<string, string> = {
  'new': 'تم إنشاء الطلب',
  'review': 'قيد المراجعة',
  'paid': 'تم تأكيد الدفع',
  'processing': 'قيد التجهيز',
  'shipped': 'تم الشحن',
  'delivered': 'تم التسليم',
  'completed': 'مكتمل',
  'cancelled': 'ملغي',
  'refunded': 'مسترجع',
  'failed': 'فشل الدفع'
}

const getStatusLabel = (status: string) => statusMap[status] || status

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    'new': 'ph:receipt',
    'review': 'ph:magnifying-glass',
    'paid': 'ph:credit-card',
    'processing': 'ph:package',
    'shipped': 'ph:truck',
    'delivered': 'ph:house',
    'completed': 'ph:check-circle',
    'cancelled': 'ph:x-circle',
    'refunded': 'ph:arrows-counter-clockwise',
    'failed': 'ph:warning-circle'
  }
  return icons[status] || 'ph:info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'new': 'text-info',
    'paid': 'text-emerald-500',
    'processing': 'text-warning',
    'shipped': 'text-blue-500',
    'delivered': 'text-success',
    'completed': 'text-emerald-500',
    'cancelled': 'text-danger',
    'refunded': 'text-gray-500',
    'failed': 'text-danger'
  }
  return colors[status] || 'text-primary'
}

const pendingSteps = computed(() => {
  if (props.order.status === 'cancelled' || props.order.status === 'refunded') return []
  
  const allSteps = [
    { id: 'processing', label: 'قيد التجهيز' },
    { id: 'shipped', label: 'تم الشحن' },
    { id: 'delivered', label: 'تم التسليم' },
    { id: 'completed', label: 'مكتمل' }
  ]
  
  // Find which steps are already in timeline
  const completedIds = props.order.timeline.map((t: any) => t.status)
  
  // Return steps that aren't completed yet
  return allSteps.filter(s => !completedIds.includes(s.id))
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}
</script>
