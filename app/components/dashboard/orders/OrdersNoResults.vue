<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:magnifying-glass-bold" class="w-10 h-10 text-muted" />
    </div>
    
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2 font-ibm">
      لم يتم العثور على طلبات
    </h3>
    
    <p class="text-muted max-w-md mx-auto mb-8 text-sm font-medium leading-relaxed">
      جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر للعثور على ما تبحث عنه.
    </p>
    
    <button @click="store.clearFilters()" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
      مسح الفلاتر
    </button>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()
</script>
