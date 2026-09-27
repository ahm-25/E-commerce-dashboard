<template>
  <div class="bg-primary/5 border-b border-primary/20 px-4 py-3 flex items-center justify-between flex-wrap gap-4">
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center">
        <input 
          type="checkbox" 
          :checked="true"
          @change="store.selectAll(false)"
          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
        >
      </div>
      <div class="text-sm font-bold text-primary">
        تم تحديد {{ store.selectedOrders.length }} طلب
      </div>
    </div>
    
    <div class="flex items-center gap-2">
      <div class="relative group" ref="statusDropdownRef">
        <button 
          @click="isStatusDropdownOpen = !isStatusDropdownOpen"
          class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Icon name="ph:arrows-clockwise-bold" class="w-4 h-4" />
          تغيير الحالة
        </button>
        
        <div 
          v-if="isStatusDropdownOpen" 
          class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-50 py-1 overflow-hidden"
        >
          <button @click="updateStatus('processing')" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">قيد التجهيز</button>
          <button @click="updateStatus('shipped')" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">تم الشحن</button>
          <button @click="updateStatus('delivered')" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">تم التسليم</button>
        </div>
      </div>
      
      <button class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
        <Icon name="ph:download-simple-bold" class="w-4 h-4" />
        تصدير
      </button>
      
      <button class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm hidden sm:flex">
        <Icon name="ph:printer-bold" class="w-4 h-4" />
        طباعة
      </button>
      
      <button 
        @click="store.bulkDelete()"
        class="bg-danger/10 text-danger border border-danger/20 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-danger hover:text-white transition-colors shadow-sm"
      >
        <Icon name="ph:trash-bold" class="w-4 h-4" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()
const isStatusDropdownOpen = ref(false)
const statusDropdownRef = ref<HTMLElement | null>(null)

const updateStatus = (status: string) => {
  // TODO: Implement bulk status update
  console.log('Update status to', status, 'for orders:', store.selectedOrders)
  isStatusDropdownOpen.value = false
  store.selectAll(false)
}

const handleClickOutside = (event: MouseEvent) => {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target as Node)) {
    isStatusDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
