<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">إجمالي الصفحات</div>
        <div class="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <Icon name="heroicons:document-duplicate" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.pages.length }}</div>
    </div>
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">منشورة</div>
        <div class="p-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
          <Icon name="heroicons:globe-alt" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-green-600">{{ store.pages.filter(p => p.status === 'published').length }}</div>
    </div>
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">مسودة</div>
        <div class="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          <Icon name="heroicons:document" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-gray-600 dark:text-gray-300">{{ store.pages.filter(p => p.status === 'draft').length }}</div>
    </div>
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">مخفية</div>
        <div class="p-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
          <Icon name="heroicons:eye-slash" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-orange-600">{{ store.pages.filter(p => p.status === 'hidden').length }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorePagesStore } from '~/stores/storePages'

const store = useStorePagesStore()
</script>
