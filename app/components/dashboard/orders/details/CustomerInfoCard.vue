<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">بيانات العميل</h2>
      <NuxtLink v-if="order.customer.id" :to="`/dashboard/customers/${order.customer.id}`" class="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
        <Icon name="ph:user-circle" class="w-4 h-4" />
        عرض ملف العميل
      </NuxtLink>
    </div>

    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-full bg-primary-light dark:bg-primary-navy flex items-center justify-center text-primary text-xl font-bold overflow-hidden shrink-0 border border-primary/20">
        <img v-if="order.customer.avatar" :src="order.customer.avatar" :alt="order.customer.name" class="w-full h-full object-cover">
        <span v-else>{{ order.customer.name.substring(0, 2).toUpperCase() }}</span>
      </div>
      <div>
        <h3 class="font-bold text-primary-navy dark:text-white text-lg mb-1">{{ order.customer.name }}</h3>
        <div class="flex items-center gap-4 text-sm text-muted">
          <div v-if="order.customer.email" class="flex items-center gap-1.5">
            <Icon name="ph:envelope-simple" class="w-4 h-4 text-gray-400" />
            <a :href="`mailto:${order.customer.email}`" class="hover:text-primary transition-colors" dir="ltr">{{ order.customer.email }}</a>
          </div>
          <div v-if="order.customer.phone" class="flex items-center gap-1.5">
            <Icon name="ph:phone" class="w-4 h-4 text-gray-400" />
            <a :href="`tel:${order.customer.phone}`" class="hover:text-primary transition-colors" dir="ltr">{{ order.customer.phone }}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div>
        <div class="text-xs text-muted mb-1 flex items-center gap-1"><Icon name="ph:shopping-cart" /> الطلبات السابقة</div>
        <div class="font-bold text-primary-navy dark:text-white">{{ order.customer.previousOrdersCount || 0 }} طلب سابق</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-1 flex items-center gap-1"><Icon name="ph:calendar-blank" /> عميل منذ</div>
        <div class="font-bold text-primary-navy dark:text-white">{{ order.customer.createdAt ? new Date(order.customer.createdAt).getFullYear() : 'غير متوفر' }}</div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <a v-if="order.customer.email" :href="`mailto:${order.customer.email}`" class="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 border border-border-light dark:border-border-dark rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs font-medium">
        <Icon name="ph:envelope-simple" class="w-5 h-5 text-primary" />
        إرسال بريد
      </a>
      <a v-if="order.customer.phone" :href="`tel:${order.customer.phone}`" class="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 border border-border-light dark:border-border-dark rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs font-medium">
        <Icon name="ph:phone" class="w-5 h-5 text-success" />
        اتصال
      </a>
      <button v-if="order.customer.phone" @click="copy(order.customer.phone)" class="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 border border-border-light dark:border-border-dark rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs font-medium">
        <Icon name="ph:copy" class="w-5 h-5 text-gray-500" />
        نسخ الهاتف
      </button>
      <button v-if="order.customer.email" @click="copy(order.customer.email)" class="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 border border-border-light dark:border-border-dark rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs font-medium">
        <Icon name="ph:copy" class="w-5 h-5 text-gray-500" />
        نسخ البريد
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any
}>()

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  // TODO: Add Toast
}
</script>
