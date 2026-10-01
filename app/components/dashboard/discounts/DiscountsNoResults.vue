<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-16 h-16 bg-surface-50 dark:bg-surface-dark-hover rounded-full flex items-center justify-center text-text-muted dark:text-text-muted-dark mb-4">
      <Icon name="ph:magnifying-glass" class="w-8 h-8" />
    </div>
    <h3 class="text-lg font-bold text-text dark:text-text-dark mb-2">لم يتم العثور على خصومات</h3>
    <p class="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mb-6">
      جرّب تعديل البحث أو إزالة بعض الفلاتر.
    </p>
    <button @click="store.clearFilters" class="inline-flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
      مسح الفلاتر
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore } from '~/stores/discounts'
const store = useDiscountsStore()
</script>
