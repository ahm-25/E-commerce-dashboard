<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">ملخص السعر</h2>
    
    <div class="space-y-4">
      <div class="flex justify-between items-center text-sm">
        <span class="text-muted">المجموع الفرعي</span>
        <span class="font-bold">{{ formatCurrency(order.pricing.subtotal) }} <span class="text-xs font-normal text-muted">{{ order.pricing.currency }}</span></span>
      </div>
      
      <div v-if="order.pricing.discount" class="flex justify-between items-center text-sm text-success">
        <span>الخصم</span>
        <span class="font-bold">-{{ formatCurrency(order.pricing.discount) }} <span class="text-xs font-normal opacity-70">{{ order.pricing.currency }}</span></span>
      </div>
      
      <div class="flex justify-between items-center text-sm">
        <span class="text-muted">الشحن</span>
        <span class="font-bold">{{ formatCurrency(order.pricing.shipping || 0) }} <span class="text-xs font-normal text-muted">{{ order.pricing.currency }}</span></span>
      </div>
      
      <div class="flex justify-between items-center text-sm">
        <span class="text-muted">الضريبة</span>
        <span class="font-bold">{{ formatCurrency(order.pricing.tax || 0) }} <span class="text-xs font-normal text-muted">{{ order.pricing.currency }}</span></span>
      </div>
      
      <div class="h-px bg-border-light dark:bg-border-dark my-4"></div>
      
      <div class="flex justify-between items-center text-lg">
        <span class="font-bold text-primary-navy dark:text-white">الإجمالي</span>
        <span class="font-black text-primary text-xl">{{ formatCurrency(order.pricing.total) }} <span class="text-sm font-bold">{{ order.pricing.currency }}</span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any
}>()

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US')
}
</script>
