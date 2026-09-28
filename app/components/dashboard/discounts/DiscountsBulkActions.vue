<template>
  <div class="bg-primary/5 dark:bg-primary/10 border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="text-sm font-bold text-primary">
        تم تحديد {{ store.selectedDiscounts.length }} خصم
      </div>
      <div class="h-4 w-px bg-primary/20"></div>
      <button 
        @click="store.selectedDiscounts = []"
        class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        إلغاء التحديد
      </button>
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        @click="exportSelected"
        class="bg-white dark:bg-surface-dark border border-primary/20 text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:export" class="w-4 h-4" />
        تصدير المحدد
      </button>
      <button 
        @click="isBulkDeleteDialogOpen = true"
        class="bg-danger/10 hover:bg-danger/20 text-danger px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:trash" class="w-4 h-4" />
        حذف المحدد
      </button>
    </div>

    <!-- Bulk Delete Dialog -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isBulkDeleteDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="isBulkDeleteDialogOpen = false"></div>
        <div class="relative bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden transform transition-all p-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Icon name="ph:warning-circle-bold" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm mb-2">حذف الخصومات المحددة</h3>
            <p class="text-muted text-sm mb-6">
              هل أنت متأكد من حذف {{ store.selectedDiscounts.length }} خصم؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button @click="isBulkDeleteDialogOpen = false" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-primary-navy dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                إلغاء
              </button>
              <button @click="confirmDelete" :disabled="deleting" class="flex-1 bg-danger hover:bg-danger/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                {{ deleting ? 'جاري الحذف...' : 'حذف' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDiscountsStore } from '~/stores/discounts'

const store = useDiscountsStore()
const isBulkDeleteDialogOpen = ref(false)
const deleting = ref(false)

const exportSelected = async () => {
  // Mock export for selected items
}

const confirmDelete = async () => {
  deleting.value = true
  await store.bulkDelete()
  deleting.value = false
  isBulkDeleteDialogOpen.value = false
}
</script>
