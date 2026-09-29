<template>
  <div class="bg-primary/5 border-y border-primary/20 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="text-primary font-medium text-sm">
        تم تحديد {{ store.selectedReviews.length }} تقييم
      </div>
      
      <div class="h-4 w-px bg-primary/20 hidden sm:block"></div>
      
      <div class="flex flex-wrap items-center gap-2">
        <button 
          @click="store.bulkApproveReviews(store.selectedReviews)"
          class="btn btn-sm bg-white dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-success text-text-regular dark:text-text-regular-dark"
        >
          اعتماد
        </button>
        <button 
          @click="store.bulkHideReviews(store.selectedReviews)"
          class="btn btn-sm bg-white dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-warning text-text-regular dark:text-text-regular-dark"
        >
          إخفاء
        </button>
        <button 
          @click="store.bulkRejectReviews(store.selectedReviews)"
          class="btn btn-sm bg-white dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-danger text-text-regular dark:text-text-regular-dark"
        >
          رفض
        </button>
      </div>
    </div>
    
    <button 
      @click="store.selectAll(false)"
      class="text-text-muted hover:text-text-strong dark:text-text-muted-dark dark:hover:text-text-strong-dark text-sm"
    >
      إلغاء التحديد
    </button>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
</script>
