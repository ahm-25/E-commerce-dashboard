<template>
  <div class="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
    <div class="text-sm text-text-muted dark:text-text-muted-dark">
      عرض {{ startIndex }} - {{ endIndex }} من {{ store.filteredDiscounts.length }} خصم
    </div>
    
    <div class="flex items-center gap-1">
            <button
        :disabled="store.currentPage === 1"
        @click="store.currentPage--"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <Icon name="ph:caret-right-bold" class="w-4 h-4" />
      </button>
      
            <button
        v-for="page in pages"
        :key="page"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
        :class="store.currentPage === page ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="store.currentPage = page"
      >
        {{ page }}
      </button>

            <button
        :disabled="store.currentPage === store.totalPages || store.totalPages === 0"
        @click="store.currentPage++"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <Icon name="ph:caret-left-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDiscountsStore } from '~/stores/discounts'

const store = useDiscountsStore()

const startIndex = computed(() => {
  if (store.filteredDiscounts.length === 0) return 0
  return ((store.currentPage - 1) * store.itemsPerPage) + 1
})

const endIndex = computed(() => {
  const end = store.currentPage * store.itemsPerPage
  return end > store.filteredDiscounts.length ? store.filteredDiscounts.length : end
})

const pages = computed(() => {
  const total = store.totalPages
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  
  // Basic pagination logic for demo
  const current = store.currentPage
  if (current <= 3) return [1, 2, 3, 4, 5]
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [current - 2, current - 1, current, current + 1, current + 2]
})
</script>
