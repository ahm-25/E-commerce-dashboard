<template>
  <div class="px-4 pb-4 flex flex-wrap items-center gap-2 border-b border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark">
    <div class="text-sm text-text-muted dark:text-text-muted-dark ml-2">الفلاتر النشطة:</div>
    
    <span v-if="store.searchQuery" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
      بحث: {{ store.searchQuery }}
      <button @click="store.searchQuery = ''" class="hover:text-primary-700 focus:outline-none flex items-center">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </span>
    
    <span v-if="store.selectedType !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
      النوع: {{ getLabel(store.selectedType, typeOptions) }}
      <button @click="store.removeFilter('type')" class="hover:text-primary-700 focus:outline-none flex items-center">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </span>

    <span v-if="store.selectedStatus !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
      الحالة: {{ getLabel(store.selectedStatus, statusOptions) }}
      <button @click="store.removeFilter('status')" class="hover:text-primary-700 focus:outline-none flex items-center">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </span>
    
    <span v-if="store.selectedScope !== 'all'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
      النطاق: {{ getLabel(store.selectedScope, scopeOptions) }}
      <button @click="store.removeFilter('scope')" class="hover:text-primary-700 focus:outline-none flex items-center">
        <Icon name="ph:x-bold" class="w-3 h-3" />
      </button>
    </span>
    
    <button @click="store.clearFilters" class="text-xs font-bold text-muted hover:text-danger px-2 py-1 rounded-md transition-colors">
      مسح الكل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore } from '~/stores/discounts'
const store = useDiscountsStore()

const typeOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'نسبة مئوية', value: 'percentage' },
  { label: 'مبلغ ثابت', value: 'fixed' },
  { label: 'شحن مجاني', value: 'free_shipping' },
]

const statusOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'نشط', value: 'active' },
  { label: 'مجدول', value: 'scheduled' },
  { label: 'منتهي', value: 'expired' },
  { label: 'متوقف', value: 'disabled' },
]

const scopeOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'جميع المنتجات', value: 'all_products' },
  { label: 'منتجات محددة', value: 'products' },
  { label: 'أقسام محددة', value: 'categories' },
]

const getLabel = (value: string, options: {label: string, value: string}[]) => {
  return options.find(o => o.value === value)?.label || value
}
</script>
