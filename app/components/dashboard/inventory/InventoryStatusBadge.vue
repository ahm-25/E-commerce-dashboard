<template>
  <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', colors[status] || colors.gray]">
    {{ statusLabels[status] || status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable' | string
}>()

const colors: Record<string, string> = {
  in_stock: 'bg-success/10 text-success',
  low_stock: 'bg-warning/10 text-warning',
  out_of_stock: 'bg-danger/10 text-danger',
  unavailable: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
}

const statusLabels: Record<string, string> = {
  in_stock: 'متوفر',
  low_stock: 'مخزون منخفض',
  out_of_stock: 'نافد',
  unavailable: 'غير متاح'
}
</script>
