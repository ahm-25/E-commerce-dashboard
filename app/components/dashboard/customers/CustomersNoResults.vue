<template>
  <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:magnifying-glass-duotone" class="w-10 h-10 text-muted" />
    </div>
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">لم يتم العثور على عملاء</h3>
    <p class="text-muted mb-8 leading-relaxed">
      لم نعثر على أي عملاء يتطابقون مع معايير البحث الحالية. جرّب تعديل البحث أو إزالة بعض الفلاتر.
    </p>
    <button 
      @click="store.clearFilters()"
      class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
    >
      <Icon name="ph:funnel-x-bold" class="w-5 h-5" />
      مسح الفلاتر والبحث
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()
</script>
