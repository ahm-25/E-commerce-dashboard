<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <h1 class="text-2xl font-bold text-primary-navy dark:text-white">
          الطلب {{ order.orderNumber }}
        </h1>
        <OrderStatusBadge :status="order.status" />
      </div>
      <p class="text-sm text-muted">
        تم إنشاء الطلب في {{ order.createdAt }}
      </p>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <button @click="$emit('print-invoice')" class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
        <Icon name="ph:printer-bold" class="w-4 h-4" />
        طباعة الفاتورة
      </button>

      <div class="relative" ref="dropdownRef">
        <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark text-primary-navy dark:text-white text-sm font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          المزيد
          <Icon name="ph:caret-down-bold" class="w-4 h-4" />
        </button>

        <div v-if="isDropdownOpen" class="absolute left-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-10 py-2">
          <button @click="copyOrderNumber" class="w-full text-right px-4 py-2 text-sm text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
            <Icon name="ph:copy" class="w-4 h-4" />
            نسخ رقم الطلب
          </button>
          <button class="w-full text-right px-4 py-2 text-sm text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
            <Icon name="ph:envelope-simple" class="w-4 h-4" />
            إرسال الفاتورة
          </button>
          <button @click="$emit('print-order')" class="w-full text-right px-4 py-2 text-sm text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
            <Icon name="ph:printer" class="w-4 h-4" />
            طباعة الطلب
          </button>
          <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
          <button v-if="canManage" @click="$emit('cancel-order')" class="w-full text-right px-4 py-2 text-sm text-danger hover:bg-danger/5 flex items-center gap-2">
            <Icon name="ph:x-circle" class="w-4 h-4" />
            إلغاء الطلب
          </button>
          <button v-if="canManage" @click="$emit('refund-order')" class="w-full text-right px-4 py-2 text-sm text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
            <Icon name="ph:arrows-counter-clockwise" class="w-4 h-4" />
            إنشاء استرجاع
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref, onMounted, onUnmounted } from 'vue'
import OrderStatusBadge from '../OrderStatusBadge.vue'

const props = defineProps<{
  order: any
}>()

const emit = defineEmits(['print-invoice', 'print-order', 'cancel-order', 'refund-order'])

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const copyOrderNumber = () => {
  navigator.clipboard.writeText(props.order.orderNumber)
  isDropdownOpen.value = false
  // TODO: Add toast notification
}

const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

const canManage = useCanManage('orders')
</script>
