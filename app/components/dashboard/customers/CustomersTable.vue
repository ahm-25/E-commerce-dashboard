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
          <th class="py-4 px-4 font-semibold">العميل</th>
          <th class="py-4 px-4 font-semibold">تاريخ التسجيل</th>
          <th class="py-4 px-4 font-semibold text-center">الطلبات</th>
          <th class="py-4 px-4 font-semibold">إجمالي الإنفاق</th>
          <th class="py-4 px-4 font-semibold">آخر طلب</th>
          <th class="py-4 px-4 font-semibold text-center">الحالة</th>
          <th class="py-4 px-4 font-semibold w-24">الإجراءات</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-light dark:divide-border-dark">
        <CustomerTableRow 
          v-for="customer in store.filteredCustomers" 
          :key="customer.id" 
          :customer="customer" 
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCustomersStore } from '~/stores/customers'
import CustomerTableRow from '~/components/dashboard/customers/CustomerTableRow.vue'

const store = useCustomersStore()

const isAllSelected = computed(() => {
  return store.filteredCustomers.length > 0 && store.selectedCustomers.length === store.filteredCustomers.length
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.selectAll(target.checked)
}
</script>
