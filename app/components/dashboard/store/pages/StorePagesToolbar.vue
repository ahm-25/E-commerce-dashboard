<template>
  <div class="flex flex-col gap-4">
    <!-- Toolbar Top: Tabs, Search, Filter toggle -->
    <div class="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
      
      <div class="flex gap-1 border-b sm:border-b-0 border-gray-200 dark:border-gray-800 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto">
        <button v-for="tab in tabs" :key="tab.value" 
          @click="currentTab = tab.value"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
            currentTab === tab.value 
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]">
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" 
            :class="currentTab === tab.value ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-1 sm:flex-none">
          <Icon name="heroicons:magnifying-glass" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="ابحث عن صفحة..." 
            class="pr-9 pl-4 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-full sm:w-64 transition-all" />
        </div>
        <button @click="isFiltersOpen = !isFiltersOpen" 
          :class="['p-1.5 border rounded-lg transition-colors shrink-0 flex items-center justify-center', isFiltersOpen ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800']">
          <Icon name="heroicons:funnel" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="isFiltersOpen" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">نوع الصفحة</label>
        <select v-model="typeFilter" class="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark focus:ring-primary/40 focus:border-primary py-1.5 px-3 border outline-none">
          <option value="all">الكل</option>
          <option value="system">صفحة أساسية</option>
          <option value="custom">صفحة مخصصة</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">SEO</label>
        <select v-model="seoFilter" class="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark focus:ring-primary/40 focus:border-primary py-1.5 px-3 border outline-none">
          <option value="all">الكل</option>
          <option value="complete">مكتمل</option>
          <option value="incomplete">غير مكتمل</option>
        </select>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
      <span class="text-xs text-gray-500">الفلاتر النشطة:</span>
      
      <span v-if="currentTab !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        الحالة: {{ tabs.find(t => t.value === currentTab)?.label }}
        <button @click="currentTab = 'all'" class="hover:text-blue-900 dark:hover:text-blue-200"><Icon name="heroicons:x-mark" class="w-3 h-3" /></button>
      </span>

      <span v-if="typeFilter !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        النوع: {{ typeFilter === 'system' ? 'أساسية' : 'مخصصة' }}
        <button @click="typeFilter = 'all'" class="hover:text-blue-900 dark:hover:text-blue-200"><Icon name="heroicons:x-mark" class="w-3 h-3" /></button>
      </span>

      <span v-if="seoFilter !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        SEO: {{ seoFilter === 'complete' ? 'مكتمل' : 'غير مكتمل' }}
        <button @click="seoFilter = 'all'" class="hover:text-blue-900 dark:hover:text-blue-200"><Icon name="heroicons:x-mark" class="w-3 h-3" /></button>
      </span>

      <button @click="clearFilters" class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 ml-2">
        مسح الكل
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorePages } from '~/composables/useStorePages'

const { 
  store,
  searchQuery, 
  currentTab, 
  typeFilter, 
  seoFilter, 
  hasActiveFilters, 
  clearFilters 
} = useStorePages()

const isFiltersOpen = ref(false)

const tabs = computed(() => [
  { label: 'الكل', value: 'all', count: store.pages.length },
  { label: 'منشورة', value: 'published', count: store.pages.filter(p => p.status === 'published').length },
  { label: 'مسودة', value: 'draft', count: store.pages.filter(p => p.status === 'draft').length },
  { label: 'مخفية', value: 'hidden', count: store.pages.filter(p => p.status === 'hidden').length },
])
</script>
