<template>
  <div class="p-4 flex flex-col lg:flex-row items-center gap-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
    <!-- Search -->
    <div class="w-full lg:w-96 relative">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث باسم الخصم أو كود الخصم..."
        size="md"
        class="w-full"
      />
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar">
      <USelectMenu
        v-model="store.selectedType"
        :options="typeOptions"
        placeholder="النوع"
        class="w-32 lg:w-40"
        value-attribute="value"
        option-attribute="label"
      />
      
      <USelectMenu
        v-model="store.selectedStatus"
        :options="statusOptions"
        placeholder="الحالة"
        class="w-32 lg:w-40"
        value-attribute="value"
        option-attribute="label"
      />
      
      <USelectMenu
        v-model="store.selectedScope"
        :options="scopeOptions"
        placeholder="النطاق"
        class="w-32 lg:w-40"
        value-attribute="value"
        option-attribute="label"
      />
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
