<template>
  <div class="bg-primary/5 border-b border-primary/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
    <div class="flex items-center gap-3">
      <div class="bg-white dark:bg-surface-dark w-6 h-6 rounded border-2 border-primary flex items-center justify-center text-primary cursor-pointer" @click="store.selectAll(false)">
        <Icon name="ph:check-bold" class="w-4 h-4" />
      </div>
      <span class="text-primary-navy dark:text-white font-bold text-sm">
        تم تحديد {{ store.selectedCategories.length }} أقسام
      </span>
    </div>
    
    <div class="flex items-center gap-2">
      <button @click="hideSelected" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-primary-navy dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
        <Icon name="ph:eye-slash-bold" class="w-3.5 h-3.5 text-muted" />
        إخفاء
      </button>
      <button @click="showSelected" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-primary-navy dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
        <Icon name="ph:eye-bold" class="w-3.5 h-3.5 text-success" />
        إظهار
      </button>
      <button @click="deleteSelected" class="bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
        <Icon name="ph:trash-bold" class="w-3.5 h-3.5" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()

const hideSelected = () => {
  store.selectedCategories.forEach(id => store.updateVisibility(id, 'hidden'))
  store.selectedCategories = []
}

const showSelected = () => {
  store.selectedCategories.forEach(id => store.updateVisibility(id, 'visible'))
  store.selectedCategories = []
}

const deleteSelected = () => {
  if (confirm('هل أنت متأكد من حذف الأقسام المحددة؟')) {
    store.bulkDelete()
  }
}
</script>
