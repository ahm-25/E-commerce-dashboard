<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="store.isRejectDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.closeRejectDialog()"></div>
      
      <div class="bg-surface dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-text-strong dark:text-text-strong-dark mb-2">رفض التقييم؟</h3>
          <p class="text-text-regular dark:text-text-regular-dark mb-4">
            سيتم رفض هذا التقييم ولن يعرض للعملاء. يمكنك كتابة سبب الرفض كملاحظة داخلية.
          </p>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-text-strong dark:text-text-strong-dark mb-1">سبب الرفض (اختياري)</label>
            <textarea 
              v-model="rejectReason"
              rows="3"
              class="form-textarea w-full"
              placeholder="اكتب سبب الرفض..."
            ></textarea>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="handleReject"
              class="btn btn-danger flex-1"
              :disabled="loading"
            >
              <span v-if="loading">جاري الرفض...</span>
              <span v-else>رفض التقييم</span>
            </button>
            <button 
              @click="store.closeRejectDialog()"
              class="btn btn-secondary flex-1"
              :disabled="loading"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
const loading = ref(false)
const rejectReason = ref('')

watch(() => store.isRejectDialogOpen, (isOpen) => {
  if (isOpen) {
    rejectReason.value = ''
  }
})

const handleReject = async () => {
  if (!store.reviewToActOn) return
  
  loading.value = true
  try {
    await store.rejectReview(store.reviewToActOn.id, rejectReason.value)
    store.closeRejectDialog()
  } catch (error) {
    alert(apiError(error, 'تعذر تنفيذ العملية، حاول مرة أخرى'))
  } finally {
    loading.value = false
  }
}
</script>
