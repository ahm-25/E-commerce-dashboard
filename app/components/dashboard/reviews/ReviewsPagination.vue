<template>
  <div class="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border-light dark:border-border-dark">
    <div class="text-sm text-text-muted dark:text-text-muted-dark">
      عرض <span class="font-medium text-text-strong dark:text-text-strong-dark">{{ startIndex }}</span> إلى <span class="font-medium text-text-strong dark:text-text-strong-dark">{{ endIndex }}</span> من <span class="font-medium text-text-strong dark:text-text-strong-dark">{{ store.totalItems.toLocaleString('en-US') }}</span> تقييم
    </div>
    
    <div class="flex items-center gap-1">
      <button 
        @click="store.setPage(store.currentPage - 1)"
        :disabled="store.currentPage === 1"
        class="w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark hover:bg-surface-alt dark:hover:bg-surface-dark-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div class="flex items-center">
        <button 
          v-for="page in pages" 
          :key="page"
          @click="store.setPage(page)"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors mx-0.5"
          :class="store.currentPage === page ? 'bg-primary text-white shadow-sm' : 'text-text-regular dark:text-text-regular-dark hover:bg-surface-alt dark:hover:bg-surface-dark-alt'"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="store.setPage(store.currentPage + 1)"
        :disabled="store.currentPage === store.totalPages"
        class="w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark hover:bg-surface-alt dark:hover:bg-surface-dark-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()

const startIndex = computed(() => {
  if (store.totalItems === 0) return 0
  return (store.currentPage - 1) * store.itemsPerPage + 1
})

const endIndex = computed(() => {
  return Math.min(store.currentPage * store.itemsPerPage, store.totalItems)
})

const pages = computed(() => {
  const maxPagesToShow = 5
  const total = store.totalPages
  const current = store.currentPage
  
  if (total <= maxPagesToShow) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let start = Math.max(1, current - Math.floor(maxPagesToShow / 2))
  let end = Math.min(total, start + maxPagesToShow - 1)
  
  if (end - start + 1 < maxPagesToShow) {
    start = Math.max(1, end - maxPagesToShow + 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>
