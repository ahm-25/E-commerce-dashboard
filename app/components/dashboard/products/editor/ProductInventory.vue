<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">المخزون</h2>
      <div class="flex items-center gap-3">
        <span class="text-sm font-bold text-primary-navy dark:text-white">تتبع المخزون لهذا المنتج</span>
        <button 
          @click="form.trackInventory = !form.trackInventory; isDirty = true"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          :class="form.trackInventory ? 'bg-primary' : 'bg-muted/30'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="form.trackInventory ? '-translate-x-6' : '-translate-x-1'"
          />
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- SKU -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">SKU</label>
        <input 
          v-model="form.sku" 
          @input="isDirty = true"
          type="text" 
          placeholder="EDX-00124" 
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-left"
          dir="ltr"
        >
      </div>

      <!-- Stock -->
      <div v-if="form.trackInventory">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">كمية المخزون <span class="text-danger">*</span></label>
        <input 
          v-model="form.stock" 
          @input="isDirty = true"
          type="number" 
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-left"
          dir="ltr"
        >
      </div>

      <!-- Low Stock Threshold -->
      <div v-if="form.trackInventory">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">حد المخزون المنخفض</label>
        <input 
          v-model="form.lowStockThreshold" 
          @input="isDirty = true"
          type="number" 
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-left"
          dir="ltr"
        >
      </div>
    </div>
    
    <div v-if="form.trackInventory" class="flex items-center gap-3 pt-4 border-t border-border-light dark:border-border-dark">
      <button 
        @click="form.allowBackorders = !form.allowBackorders; isDirty = true"
        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        :class="form.allowBackorders ? 'bg-primary' : 'bg-muted/30'"
      >
        <span 
          class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
          :class="form.allowBackorders ? '-translate-x-5' : '-translate-x-1'"
        />
      </button>
      <span class="text-sm font-bold text-primary-navy dark:text-white">السماح بالشراء عند نفاد المخزون</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
</script>
