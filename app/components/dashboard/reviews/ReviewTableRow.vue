<template>
  <tr class="bg-surface dark:bg-surface-dark border-b border-border-light dark:border-border-dark hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors">
    <!-- Checkbox -->
    <td class="px-4 py-4 w-4">
      <div class="flex items-center">
        <input 
          type="checkbox" 
          class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark"
          :checked="isSelected"
          @change="store.toggleSelection(review.id)"
        >
      </div>
    </td>
    
    <!-- Customer -->
    <td class="px-4 py-4 whitespace-nowrap">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden">
          <img v-if="review.customerAvatar" :src="review.customerAvatar" :alt="review.customerName" class="w-full h-full object-cover">
          <span v-else class="font-bold text-sm">{{ review.customerName.charAt(0) }}</span>
        </div>
        <div>
          <NuxtLink :to="`/dashboard/customers/${review.customerId}`" class="text-sm font-medium text-text-strong dark:text-text-strong-dark hover:text-primary transition-colors line-clamp-1 block text-right">
            {{ review.customerName }}
          </NuxtLink>
          <div class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 line-clamp-1 text-right">
            {{ review.customerEmail || review.customerId }}
          </div>
        </div>
      </div>
    </td>

    <!-- Product -->
    <td class="px-4 py-4">
      <div class="flex items-center gap-3 max-w-[250px]">
        <div class="w-10 h-10 rounded-md bg-surface-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
          <img v-if="review.productImage" :src="review.productImage" :alt="review.productName" class="w-full h-full object-cover">
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="min-w-0">
          <NuxtLink :to="`/dashboard/products/${review.productId}`" class="text-sm font-medium text-text-strong dark:text-text-strong-dark hover:text-primary transition-colors line-clamp-1 block text-right" :title="review.productName">
            {{ review.productName }}
          </NuxtLink>
          <div class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 text-right" dir="ltr">
            {{ review.productSku || review.productId }}
          </div>
        </div>
      </div>
    </td>

    <!-- Rating -->
    <td class="px-4 py-4 whitespace-nowrap">
      <div class="flex items-center gap-1 text-warning" dir="ltr">
        <span class="text-sm font-medium text-text-strong dark:text-text-strong-dark mr-2">{{ review.rating }}.0</span>
        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="i <= review.rating ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    </td>

    <!-- Content & Media -->
    <td class="px-4 py-4 text-right">
      <div class="max-w-[300px]">
        <p class="text-sm text-text-regular dark:text-text-regular-dark line-clamp-2" :title="review.content">
          {{ review.content }}
        </p>
        <!-- Media thumbnails -->
        <div v-if="review.media && review.media.length > 0" class="flex items-center gap-2 mt-2">
          <div 
            v-for="(m, i) in review.media.slice(0, 3)" 
            :key="m.id"
            class="w-8 h-8 rounded-md bg-surface-alt overflow-hidden border border-border-light cursor-pointer relative"
          >
            <img :src="m.thumbnailUrl || m.url" class="w-full h-full object-cover">
            <!-- Overlay for +X if more than 3 -->
            <div v-if="i === 2 && review.media.length > 3" class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
              +{{ review.media.length - 3 }}
            </div>
          </div>
        </div>
      </div>
    </td>

    <!-- Status -->
    <td class="px-4 py-4 whitespace-nowrap text-right">
      <div class="flex flex-col gap-2 items-start">
        <ReviewStatusBadge :status="review.status" />
        <ReviewReplyBadge :hasReply="!!review.reply" />
      </div>
    </td>

    <!-- Date -->
    <td class="px-4 py-4 whitespace-nowrap text-sm text-text-muted dark:text-text-muted-dark text-right">
      <div>{{ formatDate(review.createdAt) }}</div>
    </td>

    <!-- Actions -->
    <td class="px-4 py-4 whitespace-nowrap text-left">
      <ReviewActionsDropdown :review="review" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useReviewsStore } from '~/stores/reviews'
import type { Review } from '~/stores/reviews'
import ReviewStatusBadge from './ReviewStatusBadge.vue'
import ReviewReplyBadge from './ReviewReplyBadge.vue'
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
    month: 'long',
    year: 'numeric'
  }).format(date)
}
</script>
