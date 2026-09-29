<template>
  <div class="px-4 pb-4 flex flex-wrap gap-2 items-center text-sm">
    <span class="text-text-muted dark:text-text-muted-dark mr-1">الفلاتر النشطة:</span>
    
    <!-- Rating Filters -->
    <div 
      v-for="rating in store.selectedRatings" 
      :key="`rating-${rating}`"
      class="inline-flex items-center gap-1.5 bg-surface-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark px-2.5 py-1 rounded-full text-text-regular dark:text-text-regular-dark"
    >
      <span>التقييم: {{ rating }} نجوم</span>
      <button 
        @click="store.toggleRatingFilter(rating)"
        class="text-text-muted hover:text-danger dark:text-text-muted-dark dark:hover:text-danger transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Status Filters -->
    <div 
      v-for="status in store.selectedStatuses" 
      :key="`status-${status}`"
      class="inline-flex items-center gap-1.5 bg-surface-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark px-2.5 py-1 rounded-full text-text-regular dark:text-text-regular-dark"
    >
      <span>الحالة: {{ getStatusLabel(status) }}</span>
      <button 
        @click="store.toggleStatusFilter(status)"
        class="text-text-muted hover:text-danger dark:text-text-muted-dark dark:hover:text-danger transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Media Filter -->
    <div 
      v-if="store.hasMediaOnly"
      class="inline-flex items-center gap-1.5 bg-surface-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark px-2.5 py-1 rounded-full text-text-regular dark:text-text-regular-dark"
    >
      <span>المحتوى: يوجد صور</span>
      <button 
        @click="store.hasMediaOnly = false"
        class="text-text-muted hover:text-danger dark:text-text-muted-dark dark:hover:text-danger transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Clear All -->
    <button 
      @click="store.clearFilters"
      class="text-primary hover:text-primary-focus text-sm font-medium mr-2"
    >
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'قيد المراجعة',
    approved: 'معتمد',
    hidden: 'مخفي',
    rejected: 'مرفوض'
  }
  return map[status] || status
}
</script>
