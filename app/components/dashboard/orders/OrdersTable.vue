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
          <th class="py-4 px-4 font-semibold">الطلب</th>
          <th class="py-4 px-4 font-semibold">العميل</th>
          <th class="py-4 px-4 font-semibold">المنتجات</th>
          <th class="py-4 px-4 font-semibold">الإجمالي</th>
          <th class="py-4 px-4 font-semibold text-center">الدفع</th>
          <th class="py-4 px-4 font-semibold text-center">حالة الطلب</th>
          <th class="py-4 px-4 font-semibold">التاريخ</th>
          <th class="py-4 px-4 font-semibold">آخر تحديث</th>
          <th class="py-4 px-4 font-semibold w-24">الإجراءات</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-light dark:divide-border-dark">
        <OrderTableRow 
          v-for="order in store.filteredOrders" 
          :key="order.id" 
          :order="order" 
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrdersStore } from '~/stores/orders'
import OrderTableRow from '~/components/dashboard/orders/OrderTableRow.vue'

const store = useOrdersStore()

const isAllSelected = computed(() => {
  return store.filteredOrders.length > 0 && store.selectedOrders.length === store.filteredOrders.length
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.selectAll(target.checked)
}
</script>
