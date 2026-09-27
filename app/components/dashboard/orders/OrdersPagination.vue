<template>
  <div class="px-4 py-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="text-sm font-medium text-muted flex items-center gap-2">
      عرض 
      <select class="bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-md px-2 py-1 text-primary-navy dark:text-white outline-none focus:border-primary">
        <option value="20">20 صفحة</option>
        <option value="50">50 صفحة</option>
        <option value="100">100 صفحة</option>
      </select>
      من {{ store.totalOrders.toLocaleString('ar-EG') }} طلب
    </div>
    
    <div class="flex items-center gap-1.5" dir="ltr">
      <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="sr-only">السابق</span>
        <Icon name="ph:caret-left-bold" class="w-4 h-4" />
      </button>
      
      <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-sm">
        1
      </button>
      <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-primary-navy dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        2
      </button>
      <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-primary-navy dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        3
      </button>
      
      <span class="w-8 h-8 flex items-center justify-center text-muted font-bold">...</span>
      
      <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-primary-navy dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        63
      </button>
      
      <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span class="sr-only">التالي</span>
        <Icon name="ph:caret-right-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()
</script>
