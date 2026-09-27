<template>
  <div class="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center gap-2 flex-wrap bg-gray-50/50 dark:bg-gray-800/30">
    <span class="text-xs font-bold text-muted ml-1">تصفية نشطة:</span>
    
    <div v-if="store.searchQuery" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      بحث: {{ store.searchQuery }}
      <button @click="store.searchQuery = ''" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedStatus && store.selectedStatus !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      الحالة: {{ store.selectedStatus }}
      <button @click="store.removeFilter('status')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedPaymentStatus && store.selectedPaymentStatus !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      حالة الدفع: {{ store.selectedPaymentStatus }}
      <button @click="store.removeFilter('paymentStatus')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedPaymentMethod && store.selectedPaymentMethod !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      الدفع: {{ store.selectedPaymentMethod }}
      <button @click="store.removeFilter('paymentMethod')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedDateRange && store.selectedDateRange !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      التاريخ: {{ store.selectedDateRange }}
      <button @click="store.removeFilter('dateRange')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <div v-if="store.selectedTotalValue && store.selectedTotalValue !== 'الكل'" class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
      القيمة: {{ store.selectedTotalValue }}
      <button @click="store.removeFilter('totalValue')" class="hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </div>
    
    <button @click="store.clearFilters()" class="text-xs font-bold text-danger hover:text-danger/80 transition-colors mr-auto flex items-center gap-1">
      <Icon name="ph:trash-bold" class="w-3 h-3" />
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()
</script>
