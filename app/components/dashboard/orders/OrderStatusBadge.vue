<template>
  <div class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border w-full max-w-[110px]" :class="config.classes">
    <span class="w-1.5 h-1.5 rounded-full" :class="config.dotClass"></span>
    {{ config.label }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'new' | 'review' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
}>()

const config = computed(() => {
  switch (props.status) {
    case 'new':
      return {
        label: 'جديد',
        classes: 'bg-info/10 text-info border-info/20',
        dotClass: 'bg-info'
      }
    case 'review':
      return {
        label: 'قيد المراجعة',
        classes: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        dotClass: 'bg-purple-500'
      }
    case 'processing':
      return {
        label: 'قيد التجهيز',
        classes: 'bg-warning/10 text-warning border-warning/20',
        dotClass: 'bg-warning'
      }
    case 'shipped':
      return {
        label: 'تم الشحن',
        classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        dotClass: 'bg-blue-500'
      }
    case 'delivered':
      return {
        label: 'تم التسليم',
        classes: 'bg-success/10 text-success border-success/20',
        dotClass: 'bg-success'
      }
    case 'completed':
      return {
        label: 'مكتمل',
        classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dotClass: 'bg-emerald-500'
      }
    case 'cancelled':
      return {
        label: 'ملغي',
        classes: 'bg-danger/10 text-danger border-danger/20',
        dotClass: 'bg-danger'
      }
    case 'refunded':
      return {
        label: 'مسترجع',
        classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
        dotClass: 'bg-gray-500'
      }
    default:
      return {
        label: 'غير معروف',
        classes: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        dotClass: 'bg-gray-500'
      }
  }
})
</script>
