<template>
  <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
    <td class="py-3 px-4">
      <div class="flex items-center justify-center">
        <input 
          type="checkbox" 
          :checked="store.selectedCustomers.includes(customer.id)"
          @change="store.toggleSelection(customer.id)"
          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
        >
      </div>
    </td>
    <td class="py-3 px-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {{ customer.avatar ? '' : customer.name.charAt(0) }}
          <img v-if="customer.avatar" :src="customer.avatar" :alt="customer.name" class="w-full h-full rounded-full object-cover" />
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
            {{ customer.name }}
            <CustomerTypeBadge v-if="customer.customerType" :type="customer.customerType" />
          </div>
          <div class="text-xs text-muted flex items-center gap-2 mt-0.5">
            <span v-if="customer.email">{{ customer.email }}</span>
            <span v-if="customer.email && customer.phone" class="text-border-light dark:text-border-dark">•</span>
            <span v-if="customer.phone" dir="ltr">{{ customer.phone }}</span>
          </div>
        </div>
      </div>
    </td>
    <td class="py-3 px-4">
      <div class="text-sm font-medium text-primary-navy dark:text-white">
        {{ new Date(customer.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) }}
      </div>
      <div class="text-xs text-muted">
        {{ customer.id }}
      </div>
    </td>
    <td class="py-3 px-4 text-center">
      <NuxtLink 
        v-if="customer.ordersCount > 0"
        :to="`/dashboard/orders?customerId=${customer.id}`" 
        class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-primary-navy dark:text-white font-bold text-xs hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors"
      >
        {{ customer.ordersCount }} طلب
      </NuxtLink>
      <span v-else class="text-muted text-xs font-medium">بدون طلبات</span>
    </td>
    <td class="py-3 px-4">
      <div class="font-bold text-primary-navy dark:text-white">
        {{ customer.totalSpent.toLocaleString() }} {{ customer.currency }}
      </div>
    </td>
    <td class="py-3 px-4">
      <div v-if="customer.lastOrder">
        <div class="text-sm font-medium text-primary-navy dark:text-white">
          {{ new Date(customer.lastOrder.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </div>
        <NuxtLink :to="`/dashboard/orders/${customer.lastOrder.id}`" class="text-xs text-primary hover:underline font-medium inline-block" dir="ltr">
          {{ customer.lastOrder.orderNumber }}
        </NuxtLink>
      </div>
      <span v-else class="text-muted text-xs">-</span>
    </td>
    <td class="py-3 px-4 text-center">
      <CustomerStatusBadge :status="customer.status" />
    </td>
    <td class="py-3 px-4">
      <div class="flex items-center justify-end gap-2">
        <button 
          @click="store.openPreview(customer.id)"
          class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 text-muted hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
          title="عرض التفاصيل"
        >
          <Icon name="ph:eye-bold" class="w-4 h-4" />
        </button>
        
        <div class="relative" ref="dropdownRef">
          <button 
            @click="isDropdownOpen = !isDropdownOpen"
            class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 text-muted hover:text-primary-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <Icon name="ph:dots-three-vertical-bold" class="w-4 h-4" />
          </button>
          
          <div 
            v-if="isDropdownOpen"
            class="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-20 overflow-hidden py-1"
          >
            <button @click="store.openPreview(customer.id); isDropdownOpen = false" class="w-full text-right px-4 py-2 text-sm text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
              <Icon name="ph:user-bold" class="w-4 h-4 text-muted" />
              عرض العميل
            </button>
            <button @click="store.openEditCustomer(customer); isDropdownOpen = false" class="w-full text-right px-4 py-2 text-sm text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
              <Icon name="ph:pencil-simple-bold" class="w-4 h-4 text-muted" />
              تعديل البيانات
            </button>
            <NuxtLink :to="`/dashboard/orders?customerId=${customer.id}`" class="w-full text-right px-4 py-2 text-sm text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
              <Icon name="ph:shopping-bag-bold" class="w-4 h-4 text-muted" />
              عرض الطلبات
            </NuxtLink>
            <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
            <button v-if="customer.email" @click="copyToClipboard(customer.email); isDropdownOpen = false" class="w-full text-right px-4 py-2 text-sm text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
              <Icon name="ph:envelope-simple-bold" class="w-4 h-4 text-muted" />
              نسخ البريد
            </button>
            <button v-if="customer.phone" @click="copyToClipboard(customer.phone); isDropdownOpen = false" class="w-full text-right px-4 py-2 text-sm text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
              <Icon name="ph:phone-bold" class="w-4 h-4 text-muted" />
              نسخ الهاتف
            </button>
            <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
            <button class="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
              <Icon name="ph:prohibit-bold" class="w-4 h-4" />
              حظر العميل
            </button>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomersStore, type Customer } from '~/stores/customers'
import CustomerStatusBadge from '~/components/dashboard/customers/CustomerStatusBadge.vue'
import CustomerTypeBadge from '~/components/dashboard/customers/CustomerTypeBadge.vue'

const props = defineProps<{
  customer: Customer
}>()

const store = useCustomersStore()
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Would normally show a toast here
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
