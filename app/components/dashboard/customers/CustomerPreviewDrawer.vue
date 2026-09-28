<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div 
      v-if="store.previewCustomerId"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity"
      @click="store.closePreview()"
    ></div>

    <!-- Drawer -->
    <div 
      class="fixed top-0 bottom-0 left-0 w-full sm:w-[400px] bg-white dark:bg-surface-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col"
      :class="store.previewCustomerId ? 'translate-x-0' : '-translate-x-full'"
    >
      <div v-if="customer" class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/20 sticky top-0 z-10 backdrop-blur-md">
          <h2 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">تفاصيل العميل</h2>
          <div class="flex items-center gap-2">
            <button 
              @click="store.openEditCustomer(customer)"
              class="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-primary transition-colors shadow-sm"
              title="تعديل العميل"
            >
              <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
            </button>
            <button 
              @click="store.closePreview()"
              class="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-red-500 transition-colors shadow-sm"
            >
              <Icon name="ph:x-bold" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col gap-6">
          <!-- Profile Section -->
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-4 shadow-inner">
              {{ customer.avatar ? '' : customer.name.charAt(0) }}
              <img v-if="customer.avatar" :src="customer.avatar" :alt="customer.name" class="w-full h-full rounded-full object-cover" />
            </div>
            <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-1">{{ customer.name }}</h3>
            <div class="text-muted text-sm mb-3">{{ customer.id }}</div>
            <div class="flex items-center gap-2 mb-4">
              <CustomerStatusBadge :status="customer.status" />
              <CustomerTypeBadge v-if="customer.customerType" :type="customer.customerType" />
            </div>
            
            <div class="flex gap-2 w-full mt-2">
              <NuxtLink 
                :to="`/dashboard/orders?customerId=${customer.id}`"
                class="flex-1 bg-gray-50 dark:bg-gray-800 text-primary-navy dark:text-white border border-border-light dark:border-border-dark rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="store.closePreview()"
              >
                <Icon name="ph:shopping-bag-bold" class="w-4 h-4" />
                الطلبات
              </NuxtLink>
              <button class="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <Icon name="ph:envelope-simple-bold" class="w-4 h-4" />
                مراسلة
              </button>
            </div>
          </div>

          <div class="h-px bg-border-light dark:bg-border-dark"></div>

          <!-- Contact Info -->
          <div class="flex flex-col gap-4">
            <h4 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
              <Icon name="ph:address-book-bold" class="w-5 h-5 text-muted" />
              بيانات التواصل
            </h4>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-white dark:bg-surface-dark flex items-center justify-center text-muted shadow-sm shrink-0">
                  <Icon name="ph:envelope-simple-bold" class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-0.5 min-w-0">
                  <span class="text-xs text-muted font-bold">البريد الإلكتروني</span>
                  <span class="text-sm font-medium text-primary-navy dark:text-white truncate" dir="ltr">{{ customer.email || 'غير متوفر' }}</span>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-white dark:bg-surface-dark flex items-center justify-center text-muted shadow-sm shrink-0">
                  <Icon name="ph:phone-bold" class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-0.5 min-w-0">
                  <span class="text-xs text-muted font-bold">رقم الهاتف</span>
                  <span class="text-sm font-medium text-primary-navy dark:text-white truncate" dir="ltr">{{ customer.phone || 'غير متوفر' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="h-px bg-border-light dark:bg-border-dark"></div>

          <!-- Stats Info -->
          <div class="flex flex-col gap-4">
            <h4 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
              <Icon name="ph:chart-bar-bold" class="w-5 h-5 text-muted" />
              إحصائيات العميل
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-1">
                <span class="text-xs text-muted font-bold">عدد الطلبات</span>
                <span class="text-xl font-black text-primary-navy dark:text-white font-ibm">{{ customer.ordersCount }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-1">
                <span class="text-xs text-muted font-bold">إجمالي الإنفاق</span>
                <span class="text-xl font-black text-primary-navy dark:text-white font-ibm">{{ customer.totalSpent.toLocaleString() }} <span class="text-xs">{{ customer.currency }}</span></span>
              </div>
            </div>
          </div>

          <!-- Last Order -->
          <div class="flex flex-col gap-4" v-if="customer.lastOrder">
            <h4 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
              <Icon name="ph:clock-counter-clockwise-bold" class="w-5 h-5 text-muted" />
              آخر طلب
            </h4>
            <div class="bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col gap-3 transition-colors hover:border-primary/30 group">
              <div class="flex items-center justify-between">
                <div class="font-bold text-primary-navy dark:text-white text-sm" dir="ltr">
                  {{ customer.lastOrder.orderNumber }}
                </div>
                <div class="font-bold text-primary-navy dark:text-white text-sm">
                  {{ customer.lastOrder.total.toLocaleString() }} {{ customer.currency }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-muted">
                <span>{{ new Date(customer.lastOrder.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <NuxtLink 
                :to="`/dashboard/orders/${customer.lastOrder.id}`"
                class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-center py-2 rounded-lg text-sm font-bold text-primary-navy dark:text-white hover:text-primary dark:hover:text-primary transition-colors mt-1"
                @click="store.closePreview()"
              >
                عرض تفاصيل الطلب
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useCustomersStore } from '~/stores/customers'
import CustomerStatusBadge from '~/components/dashboard/customers/CustomerStatusBadge.vue'
import CustomerTypeBadge from '~/components/dashboard/customers/CustomerTypeBadge.vue'

const store = useCustomersStore()

const customer = computed(() => store.previewCustomer)

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && store.previewCustomerId) {
    store.closePreview()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
