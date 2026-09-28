<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="store.isDeleteDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.isDeleteDialogOpen = false"></div>
      <div class="relative bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden transform transition-all p-6">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
            <Icon name="ph:warning-circle-bold" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm mb-2">حذف الخصم</h3>
          <p class="text-muted text-sm mb-6">
            هل أنت متأكد من حذف "{{ store.discountActionTarget?.name }}"؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          
          <div class="flex items-center gap-3 w-full">
            <button @click="store.isDeleteDialogOpen = false" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-primary-navy dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
              إلغاء
            </button>
            <button @click="confirmDelete" :disabled="deleting" class="flex-1 bg-danger hover:bg-danger/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
              {{ deleting ? 'جاري الحذف...' : 'حذف الخصم' }}
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
const deleting = ref(false)

const confirmDelete = async () => {
  if (!store.discountActionTarget) return
  deleting.value = true
  await store.deleteDiscount(store.discountActionTarget.id)
  deleting.value = false
  store.isDeleteDialogOpen = false
  store.discountActionTarget = null
}
</script>
