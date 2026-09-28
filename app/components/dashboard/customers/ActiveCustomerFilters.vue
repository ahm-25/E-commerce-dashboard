<template>
  <div class="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border-b border-border-light dark:border-border-dark flex items-center flex-wrap gap-2">
    <div class="text-xs text-muted font-bold ml-2">الفلاتر النشطة:</div>
    
    <div v-for="status in store.selectedStatuses" :key="`status-${status}`" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-semibold text-primary-navy dark:text-white shadow-sm">
      <span class="text-muted">الحالة:</span>
      {{ getStatusLabel(status) }}
      <button @click="store.toggleStatusFilter(status)" class="w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted hover:text-red-500 transition-colors">
        <Icon name="ph:x-bold" class="w-2.5 h-2.5" />
      </button>
    </div>
    
    <div v-for="type in store.selectedTypes" :key="`type-${type}`" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-semibold text-primary-navy dark:text-white shadow-sm">
      <span class="text-muted">النوع:</span>
      {{ getTypeLabel(type) }}
      <button @click="store.toggleTypeFilter(type)" class="w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted hover:text-red-500 transition-colors">
        <Icon name="ph:x-bold" class="w-2.5 h-2.5" />
      </button>
    </div>
    
    <button @click="store.clearFilters()" class="text-xs font-bold text-red-500 hover:text-red-600 transition-colors mr-2">
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'active': 'نشط',
    'inactive': 'غير نشط',
    'blocked': 'محظور'
  }
  return map[status] || status
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    'new': 'جديد',
    'returning': 'عميل متكرر',
    'vip': 'VIP'
  }
  return map[type] || type
}
</script>
