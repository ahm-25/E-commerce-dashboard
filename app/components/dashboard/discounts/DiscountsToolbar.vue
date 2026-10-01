<template>
  <div class="p-4 flex flex-col lg:flex-row items-center gap-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
    <!-- Search -->
    <div class="w-full lg:w-96 relative">
      <Icon name="ph:magnifying-glass" class="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ابحث باسم الخصم أو كود الخصم..."
        class="w-full pr-9 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
      />
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar">
      <select
        v-model="store.selectedType"
        aria-label="النوع"
        class="w-32 lg:w-40 shrink-0 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
      >
        <option v-for="option in typeOptions" :key="option.value" :value="option.value">
          {{ option.value === 'all' ? 'النوع: ' + option.label : option.label }}
        </option>
      </select>
      
      <select
        v-model="store.selectedStatus"
        aria-label="الحالة"
        class="w-32 lg:w-40 shrink-0 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
      >
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.value === 'all' ? 'الحالة: ' + option.label : option.label }}
        </option>
      </select>
      
      <select
        v-model="store.selectedScope"
        aria-label="النطاق"
        class="w-32 lg:w-40 shrink-0 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
      >
        <option v-for="option in scopeOptions" :key="option.value" :value="option.value">
          {{ option.value === 'all' ? 'النطاق: ' + option.label : option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDiscountsStore } from '~/stores/discounts'

const store = useDiscountsStore()
const searchQuery = ref(store.searchQuery)

// Debounce search
let timeout: any
watch(searchQuery, (newVal) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    store.searchQuery = newVal
  }, 300)
})

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
  { label: 'جميع المنتجات', value: 'all_products' }, // Mapped internally or in filter logic
  { label: 'منتجات محددة', value: 'products' },
  { label: 'أقسام محددة', value: 'categories' },
]
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
