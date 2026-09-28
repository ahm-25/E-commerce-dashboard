<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium">العروض والخصومات</span>
      </div>
      <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">العروض والخصومات</h1>
      <p class="text-muted text-sm mt-1.5 font-bold">أنشئ وأدر الخصومات والكوبونات والعروض الخاصة بمتجرك.</p>
    </div>
    
    <div class="flex items-center gap-3">
      <button 
        @click="handleExport('all', 'csv')"
        class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:export-bold" class="w-4 h-4" />
        تصدير
      </button>
      <NuxtLink 
        to="/dashboard/discounts/create" 
        class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إنشاء خصم
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore } from '~/stores/discounts'
const store = useDiscountsStore()

const handleExport = async (type: 'current' | 'all', format: 'csv' | 'excel') => {
  await store.exportDiscounts(type, format)
}
</script>
