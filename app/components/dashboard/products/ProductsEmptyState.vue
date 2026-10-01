<template>
  <div class="flex flex-col items-center justify-center text-center py-8">
    <div class="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary">
      <Icon name="ph:package-bold" class="w-10 h-10" />
    </div>
    
    <h2 class="text-xl font-black text-primary-navy dark:text-white font-ibm mb-2">لم تضف أي منتجات بعد</h2>
    <p class="text-muted font-medium mb-8 max-w-sm">ابدأ بإضافة أول منتج إلى متجرك لعرضه للعملاء.</p>
    
    <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <NuxtLink v-if="canManage" to="/dashboard/products/create" class="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إضافة منتج
      </NuxtLink>
      
      <button class="w-full sm:w-auto bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
        تعرف على طريقة إضافة المنتجات
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'

const canManage = useCanManage('products')
</script>
