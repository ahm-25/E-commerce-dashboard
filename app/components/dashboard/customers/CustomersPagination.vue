<template>
  <div class="px-4 py-3 border-t border-border-light dark:border-border-dark flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 sm:px-6">
    <div class="flex items-center justify-center sm:justify-start">
      <p class="text-sm text-muted text-center sm:text-right">
        عرض <span class="font-bold text-primary-navy dark:text-white">{{ (store.currentPage - 1) * store.itemsPerPage + 1 }}</span>
        إلى <span class="font-bold text-primary-navy dark:text-white">{{ Math.min(store.currentPage * store.itemsPerPage, store.totalItems) }}</span>
        من أصل <span class="font-bold text-primary-navy dark:text-white">{{ store.totalItems.toLocaleString() }}</span> عميل
      </p>
    </div>
    
    <!-- Desktop & Mobile Pagination -->
    <div class="flex justify-center sm:justify-end">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm gap-1" aria-label="Pagination" dir="ltr">
        <button 
          @click="store.setPage(store.currentPage - 1)" 
          :disabled="store.currentPage === 1"
          class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-700 dark:hover:bg-gray-800"
        >
          <span class="sr-only">السابق</span>
          <Icon name="ph:caret-left-bold" class="h-4 w-4" aria-hidden="true" />
        </button>
        
        <template v-for="(page, index) in visiblePages" :key="index">
          <span 
            v-if="page === '...'" 
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-400 mx-0.5"
          >
            ...
          </span>
          <button 
            v-else
            @click="store.setPage(page as number)"
            :class="[
              page === store.currentPage ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary' : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800',
              'mx-0.5 rounded-md'
            ]"
          >
            {{ page }}
          </button>
        </template>
        
        <button 
          @click="store.setPage(store.currentPage + 1)" 
          :disabled="store.currentPage === store.totalPages"
          class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-700 dark:hover:bg-gray-800"
        >
          <span class="sr-only">التالي</span>
          <Icon name="ph:caret-right-bold" class="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()

const visiblePages = computed(() => {
  const current = store.currentPage
  const total = store.totalPages
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  
  return [1, '...', current - 1, current, current + 1, '...', total]
})
</script>
