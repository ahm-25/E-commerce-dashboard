<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <!-- Total Products -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon name="ph:package" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي المنتجات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalProducts.toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- In Stock -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
        <Icon name="ph:check-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">متوفر في المخزون</div>
        <div class="text-2xl font-black text-success font-ibm">{{ store.inStockCount.toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- Low Stock -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
        <Icon name="ph:warning-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">مخزون منخفض</div>
        <div class="text-2xl font-black text-warning font-ibm">{{ store.lowStockCount.toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- Out of Stock -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
        <Icon name="ph:x-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">نافد من المخزون</div>
        <div class="text-2xl font-black text-danger font-ibm">{{ store.outOfStockCount.toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- Total Units -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center">
        <Icon name="ph:stack" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي الوحدات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalUnits.toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
const store = useInventoryStore()
</script>
