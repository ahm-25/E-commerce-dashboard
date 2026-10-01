<template>
  <div v-if="selectedPages.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50 p-3 flex items-center justify-between transition-all">
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-blue-700 dark:text-blue-400">
        تم تحديد {{ selectedPages.length }} صفحات
      </span>
    </div>
    <div class="flex items-center gap-2">
      <button @click="bulkPublish" class="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors flex items-center gap-1.5">
        <Icon name="heroicons:globe-alt" class="w-3.5 h-3.5" />
        نشر
      </button>
      <button @click="bulkHide" class="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors flex items-center gap-1.5">
        <Icon name="heroicons:eye-slash" class="w-3.5 h-3.5" />
        إخفاء
      </button>
      <button @click="bulkDelete" class="px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 shadow-sm transition-colors flex items-center gap-1.5">
        <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorePages } from '~/composables/useStorePages'

const { selectedPages, bulkPublish, bulkHide, bulkDelete } = useStorePages()
</script>
