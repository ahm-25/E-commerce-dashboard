<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium">العملاء</span>
      </div>
      <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">العملاء</h1>
      <p class="text-muted text-sm mt-1.5 font-bold">إدارة ومتابعة عملاء متجرك وبياناتهم وطلباتهم.</p>
    </div>
    
    <div class="flex items-center gap-3 relative">
      <div class="relative" ref="exportDropdownRef">
        <button 
          @click="isExportOpen = !isExportOpen"
          class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark text-text dark:text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-background dark:hover:bg-background-dark transition-colors"
        >
          <Icon name="ph:download-simple-bold" class="w-4 h-4" />
          تصدير
        </button>
        
        <div 
          v-if="isExportOpen" 
          class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-50 py-1 overflow-hidden"
        >
          <button @click="handleExport('current')" class="w-full text-right px-4 py-2 text-sm hover:bg-background dark:hover:bg-background-dark transition-colors">
            تصدير العملاء الحاليين
          </button>
          <button @click="handleExport('all')" class="w-full text-right px-4 py-2 text-sm hover:bg-background dark:hover:bg-background-dark transition-colors">
            تصدير كل العملاء
          </button>
          <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
          <button @click="handleExport('csv')" class="w-full text-right px-4 py-2 text-sm hover:bg-background dark:hover:bg-background-dark transition-colors">
            تصدير CSV
          </button>
          <button @click="handleExport('excel')" class="w-full text-right px-4 py-2 text-sm hover:bg-background dark:hover:bg-background-dark transition-colors">
            تصدير Excel
          </button>
        </div>
      </div>
      
      <button 
        v-if="canManage" @click="store.openAddCustomer()"
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
      >
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إضافة عميل
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()
const isExportOpen = ref(false)
const exportDropdownRef = ref<HTMLElement | null>(null)

const handleExport = (type: string) => {
  isExportOpen.value = false
  // store.exportCustomers(type)
  console.log('Exporting...', type)
}

const handleClickOutside = (event: MouseEvent) => {
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target as Node)) {
    isExportOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const canManage = useCanManage('customers')
</script>
