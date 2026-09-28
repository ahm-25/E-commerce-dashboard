<template>
  <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark">
    <div class="relative w-full sm:w-80">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted">
        <Icon name="ph:magnifying-glass" class="w-5 h-5" />
      </div>
      <input 
        v-model="store.searchQuery"
        type="text" 
        placeholder="ابحث باسم المنتج أو SKU..."
        class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block pr-10 p-2.5 transition-colors placeholder-gray-400"
      >
    </div>
    
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <button class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary-navy dark:text-white bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center shadow-sm">
        <Icon name="ph:funnel" class="w-4 h-4 text-muted" />
        تصفية
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
const store = useInventoryStore()
</script>
