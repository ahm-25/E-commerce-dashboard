<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="store.isReplyDialogOpen && review" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.closeReplyDialog()"></div>
      
      <div class="bg-surface dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-surface-alt dark:bg-surface-dark-alt">
          <h3 class="text-lg font-bold text-text-strong dark:text-text-strong-dark">الرد على تقييم العميل</h3>
          <button 
            @click="store.closeReplyDialog()"
            class="p-1 text-text-muted hover:text-text-strong dark:text-text-muted-dark dark:hover:text-text-strong-dark rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6 overflow-y-auto">
          
          <!-- Review Snippet -->
          <div class="bg-surface-alt dark:bg-surface-dark-alt rounded-xl p-4 border border-border-light dark:border-border-dark mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex items-center text-warning" dir="ltr">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="i <= review.rating ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-text-strong dark:text-text-strong-dark">{{ review.customerName }}</span>
            </div>
            <p class="text-sm text-text-regular dark:text-text-regular-dark line-clamp-3 leading-relaxed">
              {{ review.content }}
            </p>
          </div>

          <!-- Reply Input -->
          <div>
            <label class="block text-sm font-medium text-text-strong dark:text-text-strong-dark mb-2">ردك للعميل</label>
            <textarea 
              v-model="replyContent"
              rows="5"
              class="form-textarea w-full transition-colors"
              placeholder="اكتب ردًا احترافيًا وواضحًا..."
              :maxlength="500"
            ></textarea>
            <div class="flex justify-between items-center mt-2 text-xs">
              <span class="text-text-muted dark:text-text-muted-dark">سيتم عرض هذا الرد أسفل التقييم.</span>
              <span :class="replyContent.length > 480 ? 'text-danger' : 'text-text-muted dark:text-text-muted-dark'">
                {{ replyContent.length }} / 500
              </span>
            </div>
          </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-border-light dark:border-border-dark flex gap-3 bg-surface-alt dark:bg-surface-dark-alt">
          <button 
            @click="handleReply"
            class="btn btn-primary flex-1"
            :disabled="loading || !replyContent.trim()"
          >
            <span v-if="loading">جاري الإرسال...</span>
            <span v-else>{{ review.reply ? 'تحديث الرد' : 'إرسال الرد' }}</span>
          </button>
          <button 
            @click="store.closeReplyDialog()"
            class="btn btn-secondary flex-1"
            :disabled="loading"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
const loading = ref(false)
const replyContent = ref('')

const review = computed(() => store.reviewToActOn)

watch(() => store.isReplyDialogOpen, (isOpen) => {
  if (isOpen && review.value) {
    replyContent.value = review.value.reply?.content || ''
  }
})

const handleReply = async () => {
  if (!review.value || !replyContent.value.trim()) return
  
  loading.value = true
  try {
    await store.replyToReview(review.value.id, { content: replyContent.value })
    store.closeReplyDialog()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
