<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col gap-3 shadow-sm relative">
    
    <!-- Header: Checkbox & Customer -->
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-3">
        <input 
          type="checkbox" 
          class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark mt-1"
          :checked="isSelected"
          @change="store.toggleSelection(review.id)"
        >
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="review.customerAvatar" :src="review.customerAvatar" :alt="review.customerName" class="w-full h-full object-cover">
            <span v-else class="font-bold text-sm">{{ review.customerName.charAt(0) }}</span>
          </div>
          <div>
            <div class="text-sm font-medium text-text-strong dark:text-text-strong-dark line-clamp-1">
              {{ review.customerName }}
            </div>
            <div class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 line-clamp-1">
              {{ review.customerEmail || review.customerId }}
            </div>
          </div>
        </div>
      </div>
      <ReviewActionsDropdown :review="review" />
    </div>

    <!-- Product & Rating -->
    <div class="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-3 mt-1">
      <div class="flex-1 min-w-0 pr-2 border-l border-border-light dark:border-border-dark rtl:border-l-0 rtl:border-r rtl:pr-0 rtl:pl-2">
        <div class="text-xs text-text-muted dark:text-text-muted-dark mb-0.5">المنتج</div>
        <div class="text-sm font-medium text-text-strong dark:text-text-strong-dark line-clamp-1">
          {{ review.productName }}
        </div>
      </div>
      <div class="pl-2 rtl:pl-0 rtl:pr-2 flex flex-col items-end">
        <div class="text-xs text-text-muted dark:text-text-muted-dark mb-0.5">التقييم</div>
        <div class="flex items-center gap-1 text-warning" dir="ltr">
          <span class="text-sm font-bold text-text-strong dark:text-text-strong-dark mr-1">{{ review.rating }}.0</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-surface-alt dark:bg-surface-dark-alt rounded-lg p-3">
      <p class="text-sm text-text-regular dark:text-text-regular-dark line-clamp-3">
        "{{ review.content }}"
      </p>
      
      <!-- Media -->
      <div v-if="review.media && review.media.length > 0" class="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
        <div 
          v-for="(m, i) in review.media" 
          :key="m.id"
          class="w-12 h-12 rounded-md bg-surface overflow-hidden border border-border-light flex-shrink-0"
        >
          <img :src="m.thumbnailUrl || m.url" class="w-full h-full object-cover">
        </div>
      </div>
    </div>

    <!-- Status & Footer Actions -->
    <div class="flex items-center justify-between mt-1">
      <div class="flex flex-col gap-1.5">
        <div class="flex gap-2 items-center">
          <ReviewStatusBadge :status="review.status" />
          <span v-if="review.reply" class="text-xs text-primary font-medium">تم الرد</span>
        </div>
        <div class="text-xs text-text-muted dark:text-text-muted-dark">{{ formatDate(review.createdAt) }}</div>
      </div>
      
      <div class="flex gap-2">
        <button 
          @click="store.openPreview(review.id)"
          class="btn btn-sm btn-secondary"
        >
          عرض
        </button>
        <button 
          v-if="canManage" @click="store.openReplyDialog(review)"
          class="btn btn-sm btn-primary"
        >
          الرد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useReviewsStore } from '~/stores/reviews'
import type { Review } from '~/stores/reviews'
import ReviewStatusBadge from './ReviewStatusBadge.vue'
import ReviewActionsDropdown from './ReviewActionsDropdown.vue'

const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: true
  }
})

const store = useReviewsStore()

const isSelected = computed(() => {
  return store.selectedReviews.includes(props.review.id)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const canManage = useCanManage('reviews')
</script>
