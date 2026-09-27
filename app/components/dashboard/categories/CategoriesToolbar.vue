<template>
  <div class="p-4 border-b border-border-light dark:border-border-dark flex flex-col xl:flex-row xl:items-center justify-between gap-4">
    <!-- View Toggle & Sort -->
    <div class="flex items-center gap-3 order-3 xl:order-1">
      <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-border-light dark:border-border-dark">
        <button 
          @click="store.viewMode = 'tree'" 
          class="p-1.5 rounded-md flex items-center justify-center transition-colors"
          :class="store.viewMode === 'tree' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-muted hover:text-primary-navy dark:hover:text-white'"
          title="عرض شجري"
        >
          <Icon name="ph:list-dashes-bold" class="w-4 h-4" />
        </button>
        <button 
          @click="store.viewMode = 'list'" 
          class="p-1.5 rounded-md flex items-center justify-center transition-colors"
          :class="store.viewMode === 'list' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-muted hover:text-primary-navy dark:hover:text-white'"
          title="عرض قائمة"
        >
          <Icon name="ph:squares-four-bold" class="w-4 h-4" />
        </button>
      </div>
      
      <div class="h-6 w-px bg-border-light dark:bg-border-dark hidden sm:block"></div>
      
      <div class="relative group hidden sm:block">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:sort-ascending-bold" class="w-4 h-4 text-muted" />
          {{ store.sortBy }}
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in sortOptions" :key="option" @click="store.sortBy = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.sortBy === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 order-2 flex-1 xl:justify-center">
      <div class="relative group shrink-0">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:eye-bold" class="w-4 h-4 text-muted" />
          الحالة
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'ظاهر', 'مخفي']" :key="option" @click="store.selectedStatus = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedStatus === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="relative group shrink-0">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:stack-bold" class="w-4 h-4 text-muted" />
          النوع
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'قسم رئيسي', 'قسم فرعي']" :key="option" @click="store.selectedType = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedType === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="relative group shrink-0">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:package-bold" class="w-4 h-4 text-muted" />
          المنتجات
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'يحتوي على منتجات', 'فارغ']" :key="option" @click="store.selectedProducts = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedProducts === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative w-full xl:w-72 shrink-0 order-1 xl:order-3">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Icon name="ph:magnifying-glass-bold" class="w-4 h-4 text-muted" />
      </div>
      <input 
        type="text" 
        v-model="store.searchQuery"
        class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pr-9 p-2.5 font-semibold placeholder:font-medium placeholder:text-muted/70 transition-colors" 
        placeholder="ابحث عن قسم..." 
      >
      <button v-if="store.searchQuery" @click="store.searchQuery = ''" class="absolute inset-y-0 left-0 flex items-center pl-3 text-muted hover:text-danger transition-colors">
        <Icon name="ph:x-circle-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()

const sortOptions = [
  'الترتيب الحالي',
  'الاسم: أ → ي',
  'الاسم: ي → أ',
  'الأكثر منتجات',
  'الأقل منتجات',
  'الأحدث',
  'الأقدم'
]
</script>
