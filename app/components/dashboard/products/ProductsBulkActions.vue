<template>
  <div class="bg-primary/5 border-b border-primary/10 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-sm">
    <div class="flex items-center gap-3">
      <span class="text-sm font-bold text-primary-navy dark:text-white">
        تم تحديد {{ store.selectedProducts.length }} {{ store.selectedProducts.length === 1 ? 'منتج' : 'منتجات' }}
      </span>
      <button @click="store.selectAll(false)" class="text-xs font-bold text-primary hover:text-primary-navy dark:hover:text-white transition-colors">
        إلغاء التحديد
      </button>
    </div>
    
    <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
      <button class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Icon name="ph:check-circle" class="w-4 h-4 text-success" />
        نشر
      </button>
      <button class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Icon name="ph:x-circle" class="w-4 h-4 text-muted" />
        إلغاء النشر
      </button>
      <button class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Icon name="ph:package" class="w-4 h-4 text-primary" />
        تعديل المخزون
      </button>
      <button @click="confirmBulkDelete" class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white text-sm font-semibold transition-colors">
        <Icon name="ph:trash" class="w-4 h-4" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()

const confirmBulkDelete = () => {
  const event = new CustomEvent('open-bulk-delete-dialog')
  window.dispatchEvent(event)
}
</script>
