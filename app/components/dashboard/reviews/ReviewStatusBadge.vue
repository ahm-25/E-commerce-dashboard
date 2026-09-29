<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusMap: Record<string, { label: string, classes: string }> = {
  pending: { label: 'قيد المراجعة', classes: 'bg-warning/10 text-warning' },
  approved: { label: 'معتمد', classes: 'bg-success/10 text-success' },
  hidden: { label: 'مخفي', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  rejected: { label: 'مرفوض', classes: 'bg-danger/10 text-danger' }
}

const statusLabel = computed(() => statusMap[props.status]?.label || props.status)
const statusClasses = computed(() => statusMap[props.status]?.classes || 'bg-gray-100 text-gray-800')
</script>
