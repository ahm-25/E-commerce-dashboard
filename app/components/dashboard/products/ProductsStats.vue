<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon name="ph:package" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي المنتجات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalProducts }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
        <Icon name="ph:check-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">المنتجات المنشورة</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.publishedCount }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-gray-500/10 text-gray-500 flex items-center justify-center">
        <Icon name="ph:file-dashed" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">مسودة</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.draftCount }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
        <Icon name="ph:warning-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">نفد المخزون</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.outOfStockCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()
</script>
