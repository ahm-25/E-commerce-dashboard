<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-right">
      <thead class="text-muted border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/20">
        <tr>
          <th class="py-4 px-4 font-semibold w-12">
            <div class="flex items-center justify-center">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
              >
            </div>
          </th>
          <th class="py-4 px-4 font-semibold">المنتج</th>
          <th class="py-4 px-4 font-semibold">SKU</th>
          <th class="py-4 px-4 font-semibold">القسم</th>
          <th class="py-4 px-4 font-semibold">السعر</th>
          <th class="py-4 px-4 font-semibold">المخزون</th>
          <th class="py-4 px-4 font-semibold">الحالة</th>
          <th class="py-4 px-4 font-semibold">آخر تحديث</th>
          <th class="py-4 px-4 font-semibold w-24">الإجراءات</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-light dark:divide-border-dark">
        <ProductTableRow 
          v-for="product in store.filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '~/stores/products'
import ProductTableRow from '~/components/dashboard/products/ProductTableRow.vue'

const store = useProductsStore()

const isAllSelected = computed(() => {
  return store.filteredProducts.length > 0 && store.selectedProducts.length === store.filteredProducts.length
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.selectAll(target.checked)
}
</script>
