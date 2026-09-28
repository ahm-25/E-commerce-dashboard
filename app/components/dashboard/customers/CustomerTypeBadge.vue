<template>
  <div class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold" :class="typeClass">
    {{ typeLabel }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: string
}>()

const typeConfig: Record<string, { label: string, class: string }> = {
  new: { label: 'جديد', class: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500' },
  returning: { label: 'عميل متكرر', class: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500' },
  vip: { label: 'VIP', class: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500' }
}

const typeClass = computed(() => {
  return typeConfig[props.type]?.class || 'bg-gray-100 text-gray-700'
})

const typeLabel = computed(() => {
  return typeConfig[props.type]?.label || props.type
})
</script>
