<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6 overflow-x-auto">
    <div class="min-w-[600px]">
      <div class="flex items-center justify-between relative">
        <!-- Connecting Line -->
        <div class="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 dark:bg-gray-800 z-0"></div>
        
        <div class="absolute top-5 left-8 right-8 h-0.5 bg-primary transition-all duration-500 z-0" :style="{ width: progressWidth }"></div>

        <!-- Steps -->
        <div 
          v-for="(step, index) in steps" 
          :key="step.status"
          class="relative z-10 flex flex-col items-center gap-3 w-32"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white dark:bg-surface-dark"
            :class="[
              isCompleted(index) ? 'border-primary text-primary' : 
              isCurrent(index) ? 'border-primary bg-primary text-white' : 
              'border-gray-200 dark:border-gray-700 text-gray-400'
            ]"
          >
            <Icon v-if="isCompleted(index)" name="ph:check-bold" class="w-5 h-5" />
            <Icon v-else :name="step.icon" class="w-5 h-5" />
          </div>
          
          <div class="text-center">
            <div class="text-sm font-bold mb-1" :class="isCompleted(index) || isCurrent(index) ? 'text-primary-navy dark:text-white' : 'text-muted'">
              {{ step.label }}
            </div>
            <div class="text-[11px] text-muted whitespace-nowrap">
              <span v-if="getStepTimeline(step.status)">{{ formatDate(getStepTimeline(step.status)?.timestamp) }}</span>
              <span v-else>لم يتم بعد</span>
            </div>
          </div>
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

const steps = [
  { status: 'new', label: 'تم إنشاء الطلب', icon: 'ph:receipt' },
  { status: 'paid', label: 'تم تأكيد الدفع', icon: 'ph:credit-card' },
  { status: 'processing', label: 'قيد التجهيز', icon: 'ph:package' },
  { status: 'shipped', label: 'تم الشحن', icon: 'ph:truck' },
  { status: 'delivered', label: 'تم التسليم', icon: 'ph:house' },
  { status: 'completed', label: 'مكتمل', icon: 'ph:check-circle' }
]

// Special cases mapping for normal flow mapping if needed
const currentStatusIndex = computed(() => {
  if (props.order.status === 'cancelled' || props.order.status === 'refunded') {
    return -1 // Special handling for cancelled/refunded might be needed, or just stop at current progress
  }
  
  // If payment is pending, we might be stuck at step 0
  if (props.order.payment.status === 'pending' && props.order.status === 'new') return 0
  if (props.order.payment.status === 'paid' && props.order.status === 'new') return 1
  
  const statusMap: Record<string, number> = {
    'new': 0,
    'review': 1, // Let's map review to paid/confirmed step or processing
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'completed': 5
  }
  
  return statusMap[props.order.status] ?? 0
})

const isCompleted = (index: number) => index < currentStatusIndex.value
const isCurrent = (index: number) => index === currentStatusIndex.value

const progressWidth = computed(() => {
  if (currentStatusIndex.value <= 0) return '0%'
  return `${(currentStatusIndex.value / (steps.length - 1)) * 100}%`
})

const getStepTimeline = (statusKey: string) => {
  // Find the event in timeline. For 'paid', look for payment event or 'paid' status.
  return props.order.timeline.find((t: any) => t.status === statusKey) || 
         (statusKey === 'paid' && props.order.payment.paidAt ? { timestamp: props.order.payment.paidAt } : null) ||
         (statusKey === 'new' ? { timestamp: props.order.createdAt } : null)
}

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
