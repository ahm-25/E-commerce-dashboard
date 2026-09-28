<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="store.isDisableDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.isDisableDialogOpen = false"></div>
      <div class="relative bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden transform transition-all p-6">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-4">
            <Icon name="ph:pause-circle-bold" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm mb-2">إيقاف الخصم</h3>
          <p class="text-muted text-sm mb-6">
            هل تريد إيقاف هذا الخصم؟ لن يتمكن العملاء من استخدامه بعد الإيقاف.
          </p>
          
          <div class="flex items-center gap-3 w-full">
            <button @click="store.isDisableDialogOpen = false" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-primary-navy dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
              إلغاء
            </button>
            <button @click="confirmDisable" :disabled="disabling" class="flex-1 bg-warning hover:bg-warning/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
              {{ disabling ? 'جاري الإيقاف...' : 'إيقاف الخصم' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDiscountsStore } from '~/stores/discounts'

const store = useDiscountsStore()
const disabling = ref(false)

const confirmDisable = async () => {
  if (!store.discountActionTarget) return
  disabling.value = true
  await store.disableDiscount(store.discountActionTarget.id)
  disabling.value = false
  store.isDisableDialogOpen = false
  store.discountActionTarget = null
}
</script>
