<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white flex items-center gap-2">
        المنتجات
      </h2>
      <span class="text-sm font-medium text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
        {{ order.items.length }} منتجات
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right">
        <thead>
          <tr class="text-muted text-sm border-b border-border-light dark:border-border-dark">
            <th class="pb-3 font-medium">المنتج</th>
            <th class="pb-3 font-medium text-center">الكمية</th>
            <th class="pb-3 font-medium text-center">سعر الوحدة</th>
            <th class="pb-3 font-medium text-left">الإجمالي</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="item in order.items" :key="item.id" class="group">
            <td class="py-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark overflow-hidden flex-shrink-0">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="ph:image" class="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-primary-navy dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {{ item.name }}
                  </h3>
                  <div class="text-xs text-muted font-mono mb-1">SKU: {{ item.sku }}</div>
                  <div v-if="item.variant" class="text-xs text-gray-500">{{ item.variant }}</div>
                </div>
              </div>
            </td>
            <td class="py-4 text-center">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark text-sm font-bold">
                {{ item.quantity }}
              </span>
            </td>
            <td class="py-4 text-center font-medium">
              <div class="flex items-center justify-center gap-1">
                {{ formatCurrency(item.unitPrice) }} <span class="text-xs text-muted">{{ order.pricing.currency }}</span>
              </div>
              <div v-if="item.discount" class="text-xs text-danger line-through mt-1">
                {{ formatCurrency(item.unitPrice + item.discount) }}
              </div>
            </td>
            <td class="py-4 text-left font-bold text-primary-navy dark:text-white">
              {{ formatCurrency(item.total) }} <span class="text-xs text-muted">{{ order.pricing.currency }}</span>
            </td>
          </tr>
        </tbody>
      </table>
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
