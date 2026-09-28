<template>
  <div class="px-4 pb-4 flex flex-wrap items-center gap-2 border-b border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark">
    <div class="text-sm text-text-muted dark:text-text-muted-dark ml-2">الفلاتر النشطة:</div>
    
    <UBadge v-if="store.searchQuery" color="primary" variant="subtle" class="flex items-center gap-1">
      بحث: {{ store.searchQuery }}
      <button @click="store.searchQuery = ''" class="hover:text-primary-600 focus:outline-none">
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
      </button>
    </UBadge>
    
    <UBadge v-if="store.selectedType !== 'all'" color="primary" variant="subtle" class="flex items-center gap-1">
      النوع: {{ getLabel(store.selectedType, typeOptions) }}
      <button @click="store.removeFilter('type')" class="hover:text-primary-600 focus:outline-none">
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
      </button>
    </UBadge>

    <UBadge v-if="store.selectedStatus !== 'all'" color="primary" variant="subtle" class="flex items-center gap-1">
      الحالة: {{ getLabel(store.selectedStatus, statusOptions) }}
      <button @click="store.removeFilter('status')" class="hover:text-primary-600 focus:outline-none">
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
      </button>
    </UBadge>
    
    <UBadge v-if="store.selectedScope !== 'all'" color="primary" variant="subtle" class="flex items-center gap-1">
      النطاق: {{ getLabel(store.selectedScope, scopeOptions) }}
      <button @click="store.removeFilter('scope')" class="hover:text-primary-600 focus:outline-none">
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
      </button>
    </UBadge>
    
    <UButton
      variant="ghost"
      color="gray"
      size="sm"
      @click="store.clearFilters"
      class="text-xs"
    >
      مسح الكل
    </UButton>
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
