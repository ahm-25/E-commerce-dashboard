<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon name="ph:squares-four" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي الأقسام</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalCategories }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <Icon name="ph:house" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">الأقسام الرئيسية</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.mainCategoriesCount }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <Icon name="ph:stack" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">الأقسام الفرعية</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.subCategoriesCount }}</div>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
        <Icon name="ph:eye" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">الأقسام الظاهرة</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.visibleCategoriesCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()
</script>
