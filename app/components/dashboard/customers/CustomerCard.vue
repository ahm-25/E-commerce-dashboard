<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
          {{ customer.avatar ? '' : customer.name.charAt(0) }}
          <img v-if="customer.avatar" :src="customer.avatar" :alt="customer.name" class="w-full h-full rounded-full object-cover" />
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
            {{ customer.name }}
            <CustomerTypeBadge v-if="customer.customerType" :type="customer.customerType" />
          </div>
          <div class="text-xs text-muted mt-1">{{ customer.id }}</div>
        </div>
      </div>
      <CustomerStatusBadge :status="customer.status" />
    </div>
    
    <div class="flex flex-col gap-2 text-sm">
      <div v-if="customer.email" class="flex items-center gap-2 text-muted">
        <Icon name="ph:envelope-simple" class="w-4 h-4" />
        <span>{{ customer.email }}</span>
      </div>
      <div v-if="customer.phone" class="flex items-center gap-2 text-muted">
        <Icon name="ph:phone" class="w-4 h-4" />
        <span dir="ltr">{{ customer.phone }}</span>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 border-y border-border-light dark:border-border-dark py-3">
      <div class="flex flex-col gap-1">
        <span class="text-xs text-muted">الطلبات</span>
        <span class="font-bold text-primary-navy dark:text-white">{{ customer.ordersCount }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-xs text-muted">الإجمالي</span>
        <span class="font-bold text-primary-navy dark:text-white">{{ customer.totalSpent.toLocaleString() }} {{ customer.currency }}</span>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-xs text-muted">آخر طلب</span>
        <span v-if="customer.lastOrder" class="text-sm font-medium text-primary-navy dark:text-white">
          {{ new Date(customer.lastOrder.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </span>
        <span v-else class="text-sm text-muted">-</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          @click="store.openPreview(customer.id)"
          class="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-bold text-primary-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomersStore, type Customer } from '~/stores/customers'
import CustomerStatusBadge from '~/components/dashboard/customers/CustomerStatusBadge.vue'
import CustomerTypeBadge from '~/components/dashboard/customers/CustomerTypeBadge.vue'

const props = defineProps<{
  customer: Customer
}>()

const store = useCustomersStore()
</script>
