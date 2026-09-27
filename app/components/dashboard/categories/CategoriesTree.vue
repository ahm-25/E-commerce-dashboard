<template>
  <div class="overflow-x-auto">
    <table class="w-full text-right" dir="rtl">
      <thead>
        <tr class="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark text-muted text-xs font-bold">
          <th class="py-3 px-4 w-12 text-center">
            <div class="bg-white dark:bg-surface-dark w-5 h-5 rounded border border-border-light dark:border-border-dark flex items-center justify-center cursor-pointer" @click="store.selectAll(!allSelected)">
              <Icon v-if="allSelected" name="ph:check-bold" class="w-3.5 h-3.5 text-primary" />
              <Icon v-else-if="store.selectedCategories.length > 0" name="ph:minus-bold" class="w-3.5 h-3.5 text-primary" />
            </div>
          </th>
          <th class="py-3 px-4 w-12"></th>
          <th class="py-3 px-4">القسم</th>
          <th class="py-3 px-4">الرابط</th>
          <th class="py-3 px-4">النوع</th>
          <th class="py-3 px-4">المنتجات</th>
          <th class="py-3 px-4">الحالة</th>
          <th class="py-3 px-4">آخر تحديث</th>
          <th class="py-3 px-4 text-center">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="store.viewMode === 'tree'">
          <CategoryTreeItem 
            v-for="category in store.filteredCategories" 
            :key="category.id" 
            :category="category" 
            :level="0"
          />
        </template>
        <template v-else>
          <CategoryTreeItem 
            v-for="category in store.flatCategories" 
            :key="category.id" 
            :category="category" 
            :level="0"
            :hide-children="true"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCategoriesStore } from '~/stores/categories'
import CategoryTreeItem from './CategoryTreeItem.vue'

const store = useCategoriesStore()

const allSelected = computed(() => {
  return store.flatCategories.length > 0 && store.selectedCategories.length === store.flatCategories.length
})
</script>
