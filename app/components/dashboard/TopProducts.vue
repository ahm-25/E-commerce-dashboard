<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">الأكثر مبيعًا</h2>
      <NuxtLink to="/dashboard/products" class="text-sm font-bold text-primary hover:text-primary-navy dark:hover:text-white transition-colors flex items-center gap-1">
        عرض الكل
        <Icon name="ph:caret-left-bold" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
    
    <div class="flex flex-col gap-4">
      <div v-for="(product, index) in products" :key="index" class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
        <div class="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 border border-border-light dark:border-border-dark">
          <Icon name="ph:image-square-bold" class="w-6 h-6 text-gray-400" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm text-primary-navy dark:text-white truncate group-hover:text-primary transition-colors leading-tight mb-1">{{ product.name }}</div>
          <div class="text-xs text-muted font-medium">{{ product.category }}</div>
        </div>
        <div class="text-left whitespace-nowrap px-4 border-r border-border-light dark:border-border-dark flex flex-col justify-center">
          <div class="text-sm font-bold text-primary-navy dark:text-white font-ibm">{{ product.sold }}</div>
          <div class="text-[10px] text-muted font-medium mt-0.5">مبيع</div>
        </div>
        <div class="text-left whitespace-nowrap min-w-[80px]">
          <div class="text-sm font-bold text-primary-navy dark:text-white font-ibm">{{ product.revenue.toLocaleString() }}</div>
          <div class="text-[10px] text-muted font-medium mt-0.5">ج.م</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = [
  { name: 'سماعات لاسلكية', category: 'إلكترونيات', sold: 124, revenue: 24800 },
  { name: 'ساعة ذكية', category: 'إلكترونيات', sold: 98, revenue: 19600 },
  { name: 'حقيبة ظهر', category: 'إكسسوارات', sold: 76, revenue: 12160 },
  { name: 'شاحن سريع', category: 'إلكترونيات', sold: 64, revenue: 9600 },
  { name: 'كابل شحن', category: 'إلكترونيات', sold: 52, revenue: 5200 },
]
</script>
