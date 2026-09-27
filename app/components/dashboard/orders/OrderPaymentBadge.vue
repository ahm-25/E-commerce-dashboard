<template>
  <div class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border w-full max-w-[110px]" :class="config.classes">
    <Icon :name="config.icon" class="w-3.5 h-3.5" />
    {{ config.label }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  method?: string
}>()

const config = computed(() => {
  switch (props.status) {
    case 'paid':
      return {
        label: 'مدفوع',
        classes: 'bg-success/10 text-success border-success/20',
        icon: 'ph:check-circle-bold'
      }
    case 'pending':
      return {
        label: 'قيد الانتظار',
        classes: 'bg-warning/10 text-warning border-warning/20',
        icon: 'ph:clock-bold'
      }
    case 'failed':
      return {
        label: 'فشل',
        classes: 'bg-danger/10 text-danger border-danger/20',
        icon: 'ph:warning-circle-bold'
      }
    case 'refunded':
      return {
        label: 'مسترد',
        classes: 'bg-info/10 text-info border-info/20',
        icon: 'ph:arrow-counter-clockwise-bold'
      }
    default:
      return {
        label: 'غير معروف',
        classes: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        icon: 'ph:question-bold'
      }
  }
})
</script>
