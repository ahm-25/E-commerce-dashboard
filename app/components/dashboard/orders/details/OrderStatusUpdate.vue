<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">إجراءات سريعة</h2>
    
    <div class="space-y-3">
      <div class="relative" ref="statusDropdownRef">
        <button 
          @click="isStatusOpen = !isStatusOpen"
          :disabled="isUpdating"
          class="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Icon v-if="isUpdating" name="ph:spinner" class="w-5 h-5 animate-spin" />
          <Icon v-else name="ph:arrows-clockwise" class="w-5 h-5" />
          تغيير حالة الطلب
        </button>
        
        <div v-if="isStatusOpen" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-20 py-2 max-h-60 overflow-y-auto">
          <button 
            v-for="status in availableStatuses" 
            :key="status.value"
            @click="confirmStatusUpdate(status)"
            class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
            :class="order.status === status.value ? 'bg-primary/5 text-primary font-bold' : 'text-text'"
          >
            {{ status.label }}
            <Icon v-if="order.status === status.value" name="ph:check" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <button 
        v-if="['new', 'review', 'processing'].includes(order.status)"
        @click="$emit('cancel')"
        class="w-full py-2.5 px-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text font-medium rounded-lg hover:bg-danger/5 hover:text-danger hover:border-danger/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon name="ph:x-circle" class="w-5 h-5" />
        إلغاء الطلب
      </button>

      <button 
        v-if="['paid', 'shipped', 'delivered', 'completed'].includes(order.status)"
        @click="$emit('refund')"
        class="w-full py-2.5 px-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon name="ph:arrows-counter-clockwise" class="w-5 h-5" />
        استرجاع المبلغ
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div class="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تأكيد تغيير الحالة</h3>
        <p class="text-muted mb-6">
          هل أنت متأكد من تغيير حالة الطلب إلى "{{ confirmDialog.targetStatus?.label }}"؟
        </p>
        <div class="flex items-center gap-3">
          <button @click="confirmDialog.isOpen = false" class="flex-1 py-2 px-4 rounded-lg border border-border-light dark:border-border-dark font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button @click="executeStatusUpdate" class="flex-1 py-2 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            تأكيد
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  order: any,
  isUpdating?: boolean
}>()

const emit = defineEmits(['update-status', 'cancel', 'refund'])

const isStatusOpen = ref(false)
const statusDropdownRef = ref<HTMLElement | null>(null)

const confirmDialog = ref({
  isOpen: false,
  targetStatus: null as any
})

const availableStatuses = [
  { value: 'new', label: 'جديد' },
  { value: 'review', label: 'قيد المراجعة' },
  { value: 'processing', label: 'قيد التجهيز' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'completed', label: 'مكتمل' }
]

const closeDropdown = (e: MouseEvent) => {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target as Node)) {
    isStatusOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

const confirmStatusUpdate = (status: any) => {
  if (props.order.status === status.value) {
    isStatusOpen.value = false
    return
  }
  confirmDialog.value.targetStatus = status
  confirmDialog.value.isOpen = true
  isStatusOpen.value = false
}

const executeStatusUpdate = () => {
  if (confirmDialog.value.targetStatus) {
    emit('update-status', confirmDialog.value.targetStatus.value)
  }
  confirmDialog.value.isOpen = false
}
</script>
