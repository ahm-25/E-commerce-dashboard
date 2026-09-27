<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <input 
          type="checkbox" 
          :checked="isSelected"
          @change="store.toggleOrderSelection(order.id)"
          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
        >
        <NuxtLink :to="`/dashboard/orders/${order.id}`" class="text-primary hover:text-primary-navy dark:hover:text-white font-bold transition-colors font-ibm flex items-center gap-1.5">
          {{ order.orderNumber }}
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <OrderStatusBadge :status="order.status" class="!w-auto !px-2" />
        <button 
          @click="store.openPreviewDrawer(order.id)"
          class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 text-muted hover:text-primary transition-colors flex items-center justify-center"
        >
          <Icon name="ph:eye-bold" class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-border-light dark:border-border-dark">
      <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
        <img v-if="order.customer.avatar" :src="order.customer.avatar" :alt="order.customer.name" class="w-full h-full object-cover">
        <span v-else>{{ getInitials(order.customer.name) }}</span>
      </div>
      <div class="flex-1">
        <div class="font-bold text-primary-navy dark:text-white text-sm">{{ order.customer.name }}</div>
        <div class="text-xs text-muted" dir="ltr" style="text-align: right;">{{ order.customer.email || order.customer.phone }}</div>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="text-xs text-muted font-medium flex items-center gap-1">
        <Icon name="ph:calendar-blank" class="w-4 h-4" />
        {{ order.createdAt }}
      </div>
      <div class="font-bold text-primary-navy dark:text-white">
        {{ order.total.toLocaleString('ar-EG') }} <span class="text-xs text-muted font-normal">{{ order.currency }}</span>
      </div>
    </div>
    
    <div class="flex items-center justify-between pt-3 border-t border-border-light dark:border-border-dark">
      <div class="flex -space-x-2 rtl:space-x-reverse" @click="store.openPreviewDrawer(order.id)">
        <div v-for="(item, i) in order.previewItems.slice(0, 3)" :key="item.id" class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 border border-white dark:border-surface-dark flex items-center justify-center shrink-0 z-10" :style="{ zIndex: 10 - i }">
          <Icon name="ph:image" class="w-4 h-4 text-muted" v-if="!item.image" />
          <img v-else :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded-lg">
        </div>
        <div v-if="order.itemsCount > 3" class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center text-xs font-bold text-muted z-0">
          +{{ order.itemsCount - 3 }}
        </div>
      </div>
      <OrderPaymentBadge :status="order.paymentStatus" class="!w-auto !px-2" />
    </div>
    
    <NuxtLink :to="`/dashboard/orders/${order.id}`" class="w-full py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-center text-sm font-bold text-primary-navy dark:text-white rounded-lg transition-colors border border-border-light dark:border-border-dark mt-2">
      عرض تفاصيل الطلب
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrdersStore, type Order } from '~/stores/orders'
import OrderStatusBadge from '~/components/dashboard/orders/OrderStatusBadge.vue'
import OrderPaymentBadge from '~/components/dashboard/orders/OrderPaymentBadge.vue'

const props = defineProps<{
  order: Order
}>()

const store = useOrdersStore()

const isSelected = computed(() => store.selectedOrders.includes(props.order.id))

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}
</script>
