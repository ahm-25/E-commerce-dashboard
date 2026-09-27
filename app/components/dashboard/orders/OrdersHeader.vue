<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium">الطلبات</span>
      </div>
      <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الطلبات</h1>
      <p class="text-muted text-sm mt-1.5 font-bold">إدارة ومتابعة جميع طلبات متجرك.</p>
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
            تصدير الطلبات الحالية
          </button>
          <button @click="handleExport('all')" class="w-full text-right px-4 py-2 text-sm hover:bg-background dark:hover:bg-background-dark transition-colors">
            تصدير كل الطلبات
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

      <NuxtLink to="/dashboard/orders/create" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إنشاء طلب
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isExportOpen = ref(false)
const exportDropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target as Node)) {
    isExportOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.addEventListener('click', handleClickOutside)
})

const handleExport = (type: string) => {
  // TODO: Connect to export API based on type
  console.log(`Exporting ${type}`)
  isExportOpen.value = false
}
</script>
