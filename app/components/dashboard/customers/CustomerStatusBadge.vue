<template>
  <div class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold" :class="statusClass">
    {{ statusLabel }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const statusConfig: Record<string, { label: string, class: string }> = {
  active: { label: 'نشط', class: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500' },
  inactive: { label: 'غير نشط', class: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  blocked: { label: 'محظور', class: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500' }
}

const statusClass = computed(() => {
  return statusConfig[props.status]?.class || 'bg-gray-100 text-gray-700'
})

const statusLabel = computed(() => {
  return statusConfig[props.status]?.label || props.status
})
</script>
