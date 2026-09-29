<template>
  <div class="relative">
    <button 
      @click="toggleMenu"
      class="p-2 text-text-muted hover:text-text-strong dark:text-text-muted-dark dark:hover:text-text-strong-dark rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
    
    <div 
      v-if="isOpen"
      v-click-outside="closeMenu"
      class="absolute left-0 mt-2 w-48 bg-surface dark:bg-surface-dark-alt border border-border-light dark:border-border-dark rounded-xl shadow-lg z-10 py-1"
    >
      <button 
        @click="openDetails"
        class="w-full text-right px-4 py-2 text-sm text-text-regular dark:text-text-regular-dark hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        عرض التقييم
      </button>

      <button 
        v-if="!review.reply"
        @click="openReply"
        class="w-full text-right px-4 py-2 text-sm text-primary hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        الرد على التقييم
      </button>

      <button 
        v-else
        @click="openReply"
        class="w-full text-right px-4 py-2 text-sm text-primary hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        تعديل الرد
      </button>

      <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
      
      <button 
        v-if="review.status !== 'approved'"
        @click="openApprove"
        class="w-full text-right px-4 py-2 text-sm text-success hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        اعتماد
      </button>

      <button 
        v-if="review.status !== 'hidden'"
        @click="openHide"
        class="w-full text-right px-4 py-2 text-sm text-text-regular dark:text-text-regular-dark hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        إخفاء
      </button>

      <button 
        v-if="review.status !== 'rejected'"
        @click="openReject"
        class="w-full text-right px-4 py-2 text-sm text-danger hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        رفض
      </button>

      <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>

      <NuxtLink 
        :to="`/dashboard/products/${review.productId}`"
        class="w-full text-right px-4 py-2 text-sm text-text-regular dark:text-text-regular-dark hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        عرض المنتج
      </NuxtLink>

      <NuxtLink 
        :to="`/dashboard/customers/${review.customerId}`"
        class="w-full text-right px-4 py-2 text-sm text-text-regular dark:text-text-regular-dark hover:bg-surface-alt dark:hover:bg-surface-dark flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        عرض العميل
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '~/stores/reviews'
import { useReviewsStore } from '~/stores/reviews'

const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: true
  }
})

const store = useReviewsStore()
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

// In a real app, these would emit events to open dialogs and store the current review
// For simplicity, we can use an event bus or provide/inject, or a specific state in the store.
// Let's add state to store or use emit. We'll use document events for simplicity or store state.
// We can add dialog states to the store.
const openDetails = () => {
  store.openPreview(props.review.id)
  closeMenu()
}

const openReply = () => {
  store.openReplyDialog(props.review)
  closeMenu()
}

const openApprove = () => {
  store.openApproveDialog(props.review)
  closeMenu()
}

const openHide = () => {
  store.openHideDialog(props.review)
  closeMenu()
}

const openReject = () => {
  store.openRejectDialog(props.review)
  closeMenu()
}
</script>
