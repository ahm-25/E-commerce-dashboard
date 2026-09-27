<template>
  <div>
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="store.isPreviewDrawerOpen" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="store.closePreviewDrawer()"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full rtl:-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full rtl:-translate-x-full"
    >
      <div 
        v-if="store.isPreviewDrawerOpen" 
        class="fixed top-0 bottom-0 left-0 rtl:right-0 rtl:left-auto w-full sm:w-[400px] bg-white dark:bg-background-dark shadow-2xl z-50 flex flex-col border-r rtl:border-l rtl:border-r-0 border-border-light dark:border-border-dark overflow-y-auto"
        dir="rtl"
      >
        <div class="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-surface dark:bg-surface-dark sticky top-0 z-10">
          <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">نظرة سريعة على الطلب</h2>
          <button 
            @click="store.closePreviewDrawer()"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted transition-colors"
          >
            <Icon name="ph:x-bold" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 flex flex-col gap-6" v-if="order">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div>
              <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm mb-1">
                {{ order.orderNumber }}
              </div>
              <div class="text-sm text-muted font-medium flex items-center gap-1.5">
                <Icon name="ph:calendar-blank" class="w-4 h-4" />
                {{ order.createdAt }}
              </div>
            </div>
            <OrderStatusBadge :status="order.status" />
          </div>
          
          <!-- Customer -->
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-border-light dark:border-border-dark">
            <h3 class="text-sm font-bold text-muted mb-3">معلومات العميل</h3>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                <img v-if="order.customer.avatar" :src="order.customer.avatar" :alt="order.customer.name" class="w-full h-full object-cover">
                <span v-else>{{ getInitials(order.customer.name) }}</span>
              </div>
              <div>
                <div class="font-bold text-primary-navy dark:text-white">{{ order.customer.name }}</div>
                <div class="text-sm text-muted mt-0.5" dir="ltr" style="text-align: right;">
                  {{ order.customer.email }}
                </div>
                <div v-if="order.customer.phone" class="text-sm text-muted" dir="ltr" style="text-align: right;">
                  {{ order.customer.phone }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Products -->
          <div>
            <h3 class="text-sm font-bold text-muted mb-3 flex items-center justify-between">
              <span>المنتجات ({{ order.itemsCount }})</span>
            </h3>
            <div class="flex flex-col gap-3">
              <div v-for="item in order.previewItems" :key="item.id" class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0">
                  <Icon name="ph:image" class="w-5 h-5 text-muted" v-if="!item.image" />
                  <img v-else :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded-lg">
                </div>
                <div class="flex-1">
                  <div class="font-bold text-sm text-primary-navy dark:text-white line-clamp-1">{{ item.name }}</div>
                </div>
              </div>
              <div v-if="order.itemsCount > order.previewItems.length" class="text-sm text-primary font-bold mt-1 text-center py-2 bg-primary/5 rounded-lg">
                + {{ order.itemsCount - order.previewItems.length }} منتجات أخرى
              </div>
            </div>
          </div>
          
          <!-- Summary -->
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-border-light dark:border-border-dark">
            <h3 class="text-sm font-bold text-muted mb-3">ملخص الطلب</h3>
            <div class="flex flex-col gap-2 mb-3 pb-3 border-b border-border-light dark:border-border-dark">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted font-medium">المجموع الفرعي</span>
                <span class="font-bold text-primary-navy dark:text-white">{{ order.subtotal.toLocaleString('ar-EG') }} {{ order.currency }}</span>
              </div>
              <div v-if="order.shippingCost" class="flex items-center justify-between text-sm">
                <span class="text-muted font-medium">الشحن</span>
                <span class="font-bold text-primary-navy dark:text-white">{{ order.shippingCost.toLocaleString('ar-EG') }} {{ order.currency }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-primary-navy dark:text-white">الإجمالي</span>
              <span class="font-black text-lg text-primary">{{ order.total.toLocaleString('ar-EG') }} <span class="text-sm font-bold">{{ order.currency }}</span></span>
            </div>
          </div>
          
          <!-- Payment -->
          <div>
            <h3 class="text-sm font-bold text-muted mb-3">الدفع</h3>
            <div class="flex items-center gap-2">
              <OrderPaymentBadge :status="order.paymentStatus" :method="order.paymentMethod" class="!w-auto !px-3" />
              <div class="text-sm font-bold text-primary-navy dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full" v-if="order.paymentMethod">
                {{ order.paymentMethod }}
              </div>
            </div>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark mt-auto sticky bottom-0 z-10" v-if="order">
          <NuxtLink 
            :to="`/dashboard/orders/${order.id}`"
            @click="store.closePreviewDrawer()"
            class="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            عرض تفاصيل الطلب كاملة
            <Icon name="ph:arrow-left-bold" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrdersStore } from '~/stores/orders'
import OrderStatusBadge from '~/components/dashboard/orders/OrderStatusBadge.vue'
import OrderPaymentBadge from '~/components/dashboard/orders/OrderPaymentBadge.vue'

const store = useOrdersStore()
const order = computed(() => store.previewOrder)

const getInitials = (name: string) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}
</script>
