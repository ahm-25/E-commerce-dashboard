<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="w-20 h-20 mb-4 text-border-light dark:text-border-dark flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 class="text-xl font-bold text-text-strong dark:text-text-strong-dark mb-2">لم يتم العثور على تقييمات</h3>
    <p class="text-text-regular dark:text-text-regular-dark max-w-sm mb-6">
      لا توجد نتائج تطابق شروط البحث والفلاتر الحالية. جرّب تغيير البحث أو إزالة بعض الفلاتر.
    </p>
    <button @click="store.clearFilters" class="btn btn-secondary">مسح الفلاتر</button>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
</script>
