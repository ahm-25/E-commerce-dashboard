<template>
  <div>
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="store.previewReviewId" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="store.closePreview()"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-full rtl:-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full rtl:-translate-x-full"
    >
      <div 
        v-if="store.previewReviewId && review" 
        class="fixed inset-y-0 right-0 rtl:right-0 rtl:left-auto max-w-md w-full bg-surface dark:bg-surface-dark border-l rtl:border-l-0 rtl:border-r border-border-light dark:border-border-dark shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt">
          <h2 class="text-lg font-bold text-text-strong dark:text-text-strong-dark">تفاصيل التقييم</h2>
          <button 
            @click="store.closePreview()"
            class="p-2 text-text-muted hover:text-text-strong dark:text-text-muted-dark dark:hover:text-text-strong-dark rounded-full hover:bg-surface dark:hover:bg-surface-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Status & Date -->
          <div class="flex items-center justify-between">
            <ReviewStatusBadge :status="review.status" />
            <div class="text-sm text-text-muted dark:text-text-muted-dark" dir="ltr">
              {{ formatDate(review.createdAt) }}
            </div>
          </div>

          <!-- Customer -->
          <div>
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-3">العميل</h3>
            <div class="flex items-center gap-3 bg-surface-alt dark:bg-surface-dark-alt p-3 rounded-lg border border-border-light dark:border-border-dark">
              <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="review.customerAvatar" :src="review.customerAvatar" :alt="review.customerName" class="w-full h-full object-cover">
                <span v-else class="font-bold text-lg">{{ review.customerName.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <NuxtLink :to="`/dashboard/customers/${review.customerId}`" class="text-base font-medium text-text-strong dark:text-text-strong-dark hover:text-primary transition-colors block truncate">
                  {{ review.customerName }}
                </NuxtLink>
                <div class="text-sm text-text-muted dark:text-text-muted-dark truncate mt-0.5" dir="ltr" style="text-align: right;">
                  {{ review.customerEmail || review.customerId }}
                </div>
              </div>
            </div>
          </div>

          <!-- Product -->
          <div>
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-3">المنتج</h3>
            <div class="flex items-center gap-3 bg-surface-alt dark:bg-surface-dark-alt p-3 rounded-lg border border-border-light dark:border-border-dark">
              <div class="w-12 h-12 rounded-md bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="review.productImage" :src="review.productImage" :alt="review.productName" class="w-full h-full object-cover">
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <NuxtLink :to="`/dashboard/products/${review.productId}`" class="text-base font-medium text-text-strong dark:text-text-strong-dark hover:text-primary transition-colors block truncate">
                  {{ review.productName }}
                </NuxtLink>
                <div class="text-sm text-text-muted dark:text-text-muted-dark truncate mt-0.5" dir="ltr" style="text-align: right;">
                  {{ review.productSku || review.productId }}
                </div>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div>
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-2">التقييم</h3>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-text-strong dark:text-text-strong-dark">{{ review.rating }} / 5</span>
              <div class="flex items-center text-warning" dir="ltr">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="i <= review.rating ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div>
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-2">محتوى التقييم</h3>
            <p class="text-base text-text-regular dark:text-text-regular-dark leading-relaxed p-4 bg-surface-alt dark:bg-surface-dark-alt rounded-xl whitespace-pre-wrap">
              {{ review.content }}
            </p>
          </div>

          <!-- Media -->
          <div v-if="review.media && review.media.length > 0">
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-3">المرفقات</h3>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="media in review.media" 
                :key="media.id"
                class="aspect-square rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img :src="media.url" class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- Reply -->
          <div>
            <h3 class="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-3">رد المتجر</h3>
            <div v-if="review.reply" class="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-primary text-sm">{{ review.reply.authorName || 'إدارة المتجر' }}</span>
                <span class="text-xs text-text-muted" dir="ltr">{{ formatDate(review.reply.createdAt) }}</span>
              </div>
              <p class="text-text-regular dark:text-text-regular-dark text-sm leading-relaxed whitespace-pre-wrap">
                {{ review.reply.content }}
              </p>
            </div>
            <div v-else class="text-sm text-text-muted dark:text-text-muted-dark bg-surface-alt dark:bg-surface-dark-alt rounded-xl p-4 text-center border border-border-light dark:border-border-dark border-dashed">
              لم يتم الرد على هذا التقييم بعد.
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div v-if="canManage" class="p-4 border-t border-border-light dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt flex flex-wrap gap-3">
          <template v-if="review.status === 'pending'">
            <button @click="approveReview" class="btn btn-primary flex-1">اعتماد</button>
            <button @click="rejectReview" class="btn btn-danger flex-1">رفض</button>
          </template>
          <template v-else>
            <button v-if="review.status !== 'approved'" @click="approveReview" class="btn btn-secondary flex-1 text-success border-success/30 hover:bg-success/10 hover:border-success">
              اعتماد
            </button>
            <button v-if="review.status !== 'hidden'" @click="hideReview" class="btn btn-secondary flex-1">
              إخفاء
            </button>
            <button v-if="review.status !== 'rejected'" @click="rejectReview" class="btn btn-secondary flex-1 text-danger border-danger/30 hover:bg-danger/10 hover:border-danger">
              رفض
            </button>
          </template>
          
          <button @click="replyReview" class="btn btn-secondary w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary">
            {{ review.reply ? 'تعديل الرد' : 'الرد على التقييم' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { computed } from 'vue'
import { useReviewsStore } from '~/stores/reviews'
import ReviewStatusBadge from './ReviewStatusBadge.vue'

const store = useReviewsStore()

const review = computed(() => store.previewReview)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

const approveReview = () => {
  if (review.value) {
    store.openApproveDialog(review.value)
  }
}

const rejectReview = () => {
  if (review.value) {
    store.openRejectDialog(review.value)
  }
}

const hideReview = () => {
  if (review.value) {
    store.openHideDialog(review.value)
  }
}

const replyReview = () => {
  if (review.value) {
    store.openReplyDialog(review.value)
  }
}

const canManage = useCanManage('reviews')
</script>
