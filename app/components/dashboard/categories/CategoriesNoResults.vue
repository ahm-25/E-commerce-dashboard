<template>
  <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 text-muted rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:magnifying-glass-bold" class="w-10 h-10" />
    </div>
    
    <h3 class="text-xl font-black text-primary-navy dark:text-white font-ibm mb-2">لم نعثر على أقسام</h3>
    <p class="text-muted text-sm leading-relaxed mb-6">
      جرّب تغيير كلمة البحث أو إزالة بعض الفلاتر.
    </p>
    
    <button @click="store.clearFilters" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-primary-navy dark:text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
      مسح الفلاتر
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()
</script>
