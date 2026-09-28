<template>
  <div class="bg-primary/5 border-b border-primary/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
        {{ store.selectedCustomers.length }}
      </div>
      <span class="font-bold text-primary-navy dark:text-white">عميل محدد</span>
    </div>
    
    <div class="flex items-center gap-2 flex-wrap">
      <button class="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
        <Icon name="ph:export-bold" class="w-4 h-4 text-muted" />
        تصدير
      </button>
      <button class="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
        <Icon name="ph:tag-bold" class="w-4 h-4 text-muted" />
        تغيير الحالة
      </button>
      <button class="px-3 py-1.5 rounded-lg bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20">
        <Icon name="ph:prohibit-bold" class="w-4 h-4" />
        حظر
      </button>
      <button class="px-3 py-1.5 rounded-lg bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20">
        <Icon name="ph:trash-bold" class="w-4 h-4" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()
</script>
