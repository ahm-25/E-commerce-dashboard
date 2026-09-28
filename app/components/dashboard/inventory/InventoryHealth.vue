<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-bold text-primary-navy dark:text-white">حالة المخزون</div>
      <div class="flex items-center gap-4 text-xs font-bold">
        <div class="flex items-center gap-1.5 text-success">
          <span class="w-2 h-2 rounded-full bg-success"></span>
          متوفر {{ store.inStockPercentage }}%
        </div>
        <div class="flex items-center gap-1.5 text-warning">
          <span class="w-2 h-2 rounded-full bg-warning"></span>
          منخفض {{ store.lowStockPercentage }}%
        </div>
        <div class="flex items-center gap-1.5 text-danger">
          <span class="w-2 h-2 rounded-full bg-danger"></span>
          نافد {{ store.outOfStockPercentage }}%
        </div>
      </div>
    </div>
    <div class="h-2 w-full flex rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div 
        class="h-full bg-success transition-all duration-500" 
        :style="{ width: `${store.inStockPercentage}%` }"
      ></div>
      <div 
        class="h-full bg-warning transition-all duration-500" 
        :style="{ width: `${store.lowStockPercentage}%` }"
      ></div>
      <div 
        class="h-full bg-danger transition-all duration-500" 
        :style="{ width: `${store.outOfStockPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
const store = useInventoryStore()
</script>
