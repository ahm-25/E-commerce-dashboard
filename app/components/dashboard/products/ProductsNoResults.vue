<template>
  <div class="flex flex-col items-center justify-center text-center py-8">
    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-muted">
      <Icon name="ph:magnifying-glass-bold" class="w-8 h-8" />
    </div>
    
    <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-2">لم نعثر على منتجات</h2>
    <p class="text-muted font-medium mb-6">جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر.</p>
    
    <button @click="store.clearFilters()" class="text-primary hover:text-primary-navy dark:hover:text-white font-bold text-sm transition-colors">
      مسح الفلاتر
    </button>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()
</script>
