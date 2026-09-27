<template>
  <div class="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center gap-2 flex-wrap">
    <div v-if="store.searchQuery" class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
      <span>البحث: {{ store.searchQuery }}</span>
      <button @click="store.searchQuery = ''" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedStatus && store.selectedStatus !== 'الكل'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
      <span>الحالة: {{ store.selectedStatus }}</span>
      <button @click="store.removeFilter('status')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedType && store.selectedType !== 'الكل'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
      <span>النوع: {{ store.selectedType }}</span>
      <button @click="store.removeFilter('type')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedProducts && store.selectedProducts !== 'الكل'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
      <span>المنتجات: {{ store.selectedProducts }}</span>
      <button @click="store.removeFilter('products')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <button @click="store.clearFilters" class="text-xs font-bold text-muted hover:text-danger transition-colors px-2">
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()
</script>
