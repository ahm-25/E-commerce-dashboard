<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
    <td class="py-4 px-4 text-center">
      <input 
        type="checkbox" 
        :checked="isSelected"
        @change="store.toggleOrderSelection(order.id)"
        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
      >
    </td>
    
    <td class="py-4 px-4">
      <NuxtLink :to="`/dashboard/orders/${order.id}`" class="text-primary hover:text-primary-navy dark:hover:text-white font-bold transition-colors font-ibm flex items-center gap-1.5">
        {{ order.orderNumber }}
      </NuxtLink>
    </td>
    
    <td class="py-4 px-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
          <img v-if="order.customer.avatar" :src="order.customer.avatar" :alt="order.customer.name" class="w-full h-full object-cover">
          <span v-else>{{ getInitials(order.customer.name) }}</span>
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white text-sm">{{ order.customer.name }}</div>
          <div class="text-xs text-muted" dir="ltr" style="text-align: right;">{{ order.customer.email || order.customer.phone }}</div>
        </div>
      </div>
    </td>
    
    <td class="py-4 px-4">
      <div class="flex items-center gap-2 group/products cursor-pointer" @click="store.openPreviewDrawer(order.id)">
        <div class="flex -space-x-2 rtl:space-x-reverse">
          <div v-for="(item, i) in order.previewItems.slice(0, 2)" :key="item.id" class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 border border-white dark:border-surface-dark flex items-center justify-center shrink-0 z-10" :style="{ zIndex: 10 - i }">
            <Icon name="ph:image" class="w-4 h-4 text-muted" v-if="!item.image" />
            <img v-else :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded-lg">
          </div>
          <div v-if="order.itemsCount > 2" class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center text-xs font-bold text-muted z-0">
            +{{ order.itemsCount - 2 }}
          </div>
        </div>
        <div class="text-xs text-muted font-bold whitespace-nowrap hidden lg:block group-hover/products:text-primary transition-colors">
          {{ order.itemsCount }} منتجات
        </div>
      </div>
    </td>
    
    <td class="py-4 px-4 font-bold text-primary-navy dark:text-white">
      {{ order.total.toLocaleString('ar-EG') }} <span class="text-xs text-muted font-normal">{{ order.currency }}</span>
    </td>
    
    <td class="py-4 px-4 text-center">
      <OrderPaymentBadge :status="order.paymentStatus" :method="order.paymentMethod" />
    </td>
    
    <td class="py-4 px-4 text-center">
      <OrderStatusBadge :status="order.status" />
    </td>
    
    <td class="py-4 px-4 text-muted text-xs font-medium">
      {{ order.createdAt }}
    </td>
    
    <td class="py-4 px-4 text-muted text-xs font-medium">
      {{ order.updatedAt }}
    </td>
    
    <td class="py-4 px-4">
      <div class="flex items-center justify-end gap-2" ref="actionMenuRef">
        <button 
          @click="store.openPreviewDrawer(order.id)"
          class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted hover:text-primary transition-colors hidden sm:flex"
          title="عرض سريع"
        >
          <Icon name="ph:eye-bold" class="w-4 h-4" />
        </button>
        
        <div class="relative">
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted hover:text-primary-navy dark:hover:text-white transition-colors"
          >
            <Icon name="ph:dots-three-vertical-bold" class="w-4 h-4" />
          </button>
          
          <div 
            v-if="isMenuOpen" 
            class="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-50 py-1 overflow-hidden"
          >
            <NuxtLink :to="`/dashboard/orders/${order.id}`" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:file-text" class="w-4 h-4 text-muted" />
              عرض تفاصيل الطلب
            </NuxtLink>
            <a :href="`/dashboard/orders/print?ids=${order.id}&type=invoice`" target="_blank" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:printer" class="w-4 h-4 text-muted" />
              طباعة الفاتورة
            </a>
            <a :href="`/dashboard/orders/print?ids=${order.id}&type=label`" target="_blank" class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:barcode" class="w-4 h-4 text-muted" />
              طباعة بوليصة الشحن
            </a>
            <button class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:copy" class="w-4 h-4 text-muted" />
              نسخ رقم الطلب
            </button>
            <button class="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:chat-circle" class="w-4 h-4 text-muted" />
              التواصل مع العميل
            </button>
            
            <div class="h-px bg-border-light dark:bg-border-dark my-1"></div>
            
            <button class="w-full text-right px-4 py-2 text-sm hover:bg-danger/10 text-danger transition-colors flex items-center gap-2 font-medium">
              <Icon name="ph:x-circle" class="w-4 h-4" />
              إلغاء الطلب
            </button>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOrdersStore, type Order } from '~/stores/orders'
import OrderStatusBadge from '~/components/dashboard/orders/OrderStatusBadge.vue'
import OrderPaymentBadge from '~/components/dashboard/orders/OrderPaymentBadge.vue'

const props = defineProps<{
  order: Order
}>()

const store = useOrdersStore()
const isMenuOpen = ref(false)
const actionMenuRef = ref<HTMLElement | null>(null)

const isSelected = computed(() => store.selectedOrders.includes(props.order.id))

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

const handleClickOutside = (event: MouseEvent) => {
  if (actionMenuRef.value && !actionMenuRef.value.contains(event.target as Node)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
