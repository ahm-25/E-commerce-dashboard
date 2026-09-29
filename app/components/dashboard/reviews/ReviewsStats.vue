<template>
  <div v-if="store.stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex flex-col justify-between h-full shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-text-muted dark:text-text-muted-dark font-medium">إجمالي التقييمات</h3>
        <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-text-strong dark:text-text-strong-dark">{{ store.stats.total.toLocaleString('en-US') }}</div>
      </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex flex-col justify-between h-full shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-text-muted dark:text-text-muted-dark font-medium">قيد المراجعة</h3>
        <div class="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-text-strong dark:text-text-strong-dark">{{ store.stats.pending.toLocaleString('en-US') }}</div>
      </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex flex-col justify-between h-full shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-text-muted dark:text-text-muted-dark font-medium">تم اعتمادها</h3>
        <div class="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-text-strong dark:text-text-strong-dark">{{ store.stats.approved.toLocaleString('en-US') }}</div>
      </div>
    </div>

    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex flex-col justify-between h-full shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-text-muted dark:text-text-muted-dark font-medium">بدون رد</h3>
        <div class="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </div>
      </div>
      <div>
        <div class="text-3xl font-bold text-text-strong dark:text-text-strong-dark">{{ store.stats.unanswered.toLocaleString('en-US') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
</script>
