<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium">المنتجات</span>
      </div>
      <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">المنتجات</h1>
      <p class="text-muted text-sm mt-1.5 font-bold">إدارة منتجات متجرك وأسعارها ومخزونها.</p>
    </div>
    
    <div class="flex items-center gap-3">
      <NuxtLink v-if="canManage" to="/dashboard/products/import" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:upload-simple-bold" class="w-4 h-4" />
        استيراد
      </NuxtLink>
      <NuxtLink v-if="canManage" to="/dashboard/products/create" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إضافة منتج
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'

const canManage = useCanManage('products')
</script>
