<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="store.isHideDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.closeHideDialog()"></div>
      
      <div class="bg-surface dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-surface-alt dark:bg-surface-dark-alt text-text-strong dark:text-text-strong-dark flex items-center justify-center mb-4 border border-border-light dark:border-border-dark">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-text-strong dark:text-text-strong-dark mb-2">إخفاء التقييم؟</h3>
          <p class="text-text-regular dark:text-text-regular-dark mb-6">
            لن يظهر هذا التقييم للعملاء على صفحة المنتج، لكنه سيظل محفوظًا داخل لوحة التحكم.
          </p>
          
          <div class="flex gap-3 mt-6">
            <button 
              @click="handleHide"
              class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex-1"
              :disabled="loading"
            >
              <span v-if="loading">جاري الإخفاء...</span>
              <span v-else>إخفاء التقييم</span>
            </button>
            <button 
              @click="store.closeHideDialog()"
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

const handleHide = async () => {
  if (!store.reviewToActOn) return
  
  loading.value = true
  try {
    await store.hideReview(store.reviewToActOn.id)
    store.closeHideDialog()
  } catch (error) {
    alert(apiError(error, 'تعذر تنفيذ العملية، حاول مرة أخرى'))
  } finally {
    loading.value = false
  }
}
</script>
