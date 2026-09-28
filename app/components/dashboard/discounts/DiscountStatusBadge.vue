<template>
  <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', colors[status] || colors.gray]">
    {{ statusLabels[status] || status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'active' | 'scheduled' | 'expired' | 'disabled' | string
}>()

const colors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  scheduled: 'bg-info/10 text-info',
  expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  disabled: 'bg-danger/10 text-danger'
}

const statusLabels: Record<string, string> = {
  active: 'نشط',
  scheduled: 'مجدول',
  expired: 'منتهي',
  disabled: 'متوقف'
}
</script>
