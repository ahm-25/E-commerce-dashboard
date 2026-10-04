<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="store.isApproveDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.closeApproveDialog()"></div>
      
      <div class="bg-surface dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-text-strong dark:text-text-strong-dark mb-2">اعتماد التقييم؟</h3>
          <p class="text-text-regular dark:text-text-regular-dark mb-6">
            سيظهر هذا التقييم للعملاء على صفحة المنتج بشكل عام.
          </p>
          
          <div class="flex gap-3 mt-6">
            <button 
              @click="handleApprove"
              class="btn btn-primary flex-1"
              :disabled="loading"
            >
              <span v-if="loading">جاري الاعتماد...</span>
              <span v-else>اعتماد التقييم</span>
            </button>
            <button 
              @click="store.closeApproveDialog()"
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
import { ref } from 'vue'
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
const loading = ref(false)

const handleApprove = async () => {
  if (!store.reviewToActOn) return
  
  loading.value = true
  try {
    await store.approveReview(store.reviewToActOn.id)
    store.closeApproveDialog()
    // Optional: show toast notification here
  } catch (error) {
    alert(apiError(error, 'تعذر تنفيذ العملية، حاول مرة أخرى'))
  } finally {
    loading.value = false
  }
}
</script>
