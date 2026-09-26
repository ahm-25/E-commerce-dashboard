<template>
  <div class="px-4 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-4">
    <div class="hidden sm:flex items-center gap-2">
      <div class="relative group">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          {{ store.itemsPerPage }} / صفحة
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute bottom-full left-0 mb-1 w-32 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
             <button v-for="option in [10, 20, 50, 100]" :key="option" @click="store.itemsPerPage = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.itemsPerPage === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      <span class="text-sm font-medium text-muted">عرض 1–{{ Math.min(store.itemsPerPage, store.totalProducts) }} من {{ store.totalProducts }} منتج</span>
    </div>
    
    <div class="flex items-center gap-1 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
      <button class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1" disabled>
        <Icon name="ph:caret-right-bold" class="w-4 h-4 hidden sm:block" />
        السابق
      </button>
      
      <div class="flex items-center gap-1 hidden sm:flex">
        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-sm">1</button>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold transition-colors">2</button>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold transition-colors">3</button>
        <span class="text-muted mx-1">...</span>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold transition-colors">13</button>
      </div>
      
      <div class="sm:hidden text-sm font-bold text-primary-navy dark:text-white">
        1 / 13
      </div>
      
      <button class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1">
        التالي
        <Icon name="ph:caret-left-bold" class="w-4 h-4 hidden sm:block" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()
</script>
