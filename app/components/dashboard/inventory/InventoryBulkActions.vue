<template>
  <div v-if="canManage" class="bg-primary/5 dark:bg-primary/10 border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="text-sm font-bold text-primary">
        تم تحديد {{ store.selectedItems.length }} منتج
      </div>
      <div class="h-4 w-px bg-primary/20"></div>
      <button 
        @click="store.selectedItems = []"
        class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        إلغاء التحديد
      </button>
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:plus-minus-bold" class="w-4 h-4" />
        تعديل الكميات
      </button>
      <button 
        class="bg-white dark:bg-surface-dark border border-primary/20 text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:export" class="w-4 h-4" />
        تصدير المحدد
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { useInventoryStore } from '~/stores/inventory'
const store = useInventoryStore()

const canManage = useCanManage('products')
</script>
