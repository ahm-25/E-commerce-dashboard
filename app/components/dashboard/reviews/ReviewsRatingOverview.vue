<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center">
    <!-- Average Rating -->
    <div class="flex flex-col items-center justify-center md:w-1/4 md:border-l border-border-light dark:border-border-dark py-4 px-6 shrink-0">
      <h3 class="text-text-muted dark:text-text-muted-dark font-medium mb-4 text-center">متوسط تقييم المتجر</h3>
      <div class="text-5xl font-bold text-text-strong dark:text-text-strong-dark mb-3" dir="ltr">{{ store.stats?.averageRating.toFixed(1) }}</div>
      
      <div class="flex items-center gap-1 mb-2 text-warning" dir="ltr">
        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="i <= Math.round(store.stats?.averageRating || 0) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
      
      <div class="text-sm text-text-muted dark:text-text-muted-dark">
        من {{ store.stats?.total.toLocaleString('en-US') }} تقييم
      </div>
    </div>
    
    <!-- Rating Distribution -->
    <div class="flex-1 w-full px-2">
      <div class="flex flex-col gap-3">
        <div v-for="dist in sortedDistribution" :key="dist.rating" class="flex items-center gap-4">
          <!-- Stars label -->
          <div class="flex items-center gap-1 w-12 justify-end text-warning shrink-0" dir="ltr">
            <span class="text-sm font-medium text-text-regular dark:text-text-regular-dark mr-1">{{ dist.rating }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          
          <!-- Progress bar -->
          <div class="flex-1 h-2 bg-surface-alt dark:bg-surface-dark-alt rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" :style="{ width: `${dist.percentage}%` }"></div>
          </div>
          
          <!-- Count & Percentage -->
          <div class="flex items-center justify-between w-20 shrink-0 text-sm" dir="ltr">
            <span class="text-text-regular dark:text-text-regular-dark font-medium w-8 text-right">{{ dist.percentage }}%</span>
            <span class="text-text-muted dark:text-text-muted-dark text-xs w-10 text-left">{{ dist.count.toLocaleString('en-US') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'
import { computed } from 'vue'

const store = useReviewsStore()

const sortedDistribution = computed(() => {
  if (!store.stats?.distribution) return []
  return [...store.stats.distribution].sort((a, b) => b.rating - a.rating)
})
</script>
