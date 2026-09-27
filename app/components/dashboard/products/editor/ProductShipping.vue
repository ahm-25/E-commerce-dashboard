<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">الشحن</h2>
      <div class="flex items-center gap-3">
        <span class="text-sm font-bold text-primary-navy dark:text-white">قابل للشحن</span>
        <button 
          @click="isShippable = !isShippable"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          :class="isShippable ? 'bg-primary' : 'bg-muted/30'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="isShippable ? '-translate-x-6' : '-translate-x-1'"
          />
        </button>
      </div>
    </div>
    
    <div v-if="isShippable" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">وزن المنتج</label>
        <div class="relative">
          <input 
            v-model="form.weight" 
            @input="isDirty = true"
            type="number" 
            step="0.1"
            placeholder="0.5" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            كجم
          </div>
        </div>
      </div>

      <!-- Dimensions -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الطول</label>
        <div class="relative">
          <input 
            v-model="form.dimensions.length" 
            @input="isDirty = true"
            type="number" 
            placeholder="0" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            سم
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">العرض</label>
        <div class="relative">
          <input 
            v-model="form.dimensions.width" 
            @input="isDirty = true"
            type="number" 
            placeholder="0" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            سم
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الارتفاع</label>
        <div class="relative">
          <input 
            v-model="form.dimensions.height" 
            @input="isDirty = true"
            type="number" 
            placeholder="0" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            سم
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
const isShippable = ref(true)
</script>
