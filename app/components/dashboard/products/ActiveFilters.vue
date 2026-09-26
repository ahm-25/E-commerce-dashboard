<template>
  <div class="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center gap-2 flex-wrap bg-gray-50/50 dark:bg-gray-800/30">
    <span class="text-xs font-bold text-muted ml-1">تصفية نشطة:</span>
    
    <div v-if="store.searchQuery" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      بحث: {{ store.searchQuery }}
      <button @click="store.searchQuery = ''" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedStatus && store.selectedStatus !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      الحالة: {{ store.selectedStatus }}
      <button @click="store.removeFilter('status')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedCategory" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      القسم: {{ store.selectedCategory }}
      <button @click="store.removeFilter('category')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedStock" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      المخزون: {{ store.selectedStock }}
      <button @click="store.removeFilter('stock')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedPrice" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      السعر: {{ store.selectedPrice }}
      <button @click="store.removeFilter('price')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedType" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      النوع: {{ store.selectedType }}
      <button @click="store.removeFilter('type')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <button @click="store.clearFilters()" class="text-xs font-bold text-danger hover:text-danger/80 transition-colors mr-auto flex items-center gap-1">
      <Icon name="ph:trash-bold" class="w-3 h-3" />
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()
</script>
