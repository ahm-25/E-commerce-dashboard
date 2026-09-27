<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <h3 class="font-black text-primary-navy dark:text-white mb-4">الظهور</h3>
    
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-primary-navy dark:text-white">ظاهر في المتجر</span>
        <button 
          @click="form.visibility = form.visibility === 'visible' ? 'hidden' : 'visible'; isDirty = true"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          :class="form.visibility === 'visible' ? 'bg-primary' : 'bg-muted/30'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="form.visibility === 'visible' ? '-translate-x-6' : '-translate-x-1'"
          />
        </button>
      </div>
      
      <!-- Option for showing in search results (could map to a specific form field later) -->
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-primary-navy dark:text-white">إظهاره في نتائج البحث</span>
        <button 
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 bg-primary"
        >
          <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform -translate-x-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
</script>
