<template>
  <div class="bg-surface dark:bg-surface-dark border border-warning/30 dark:border-warning/20 rounded-xl p-6 shadow-sm relative overflow-hidden">
    <!-- background accent -->
    <div class="absolute top-0 left-0 w-32 h-32 bg-warning/5 rounded-br-[100px] -z-10"></div>
    
    <div class="flex items-center gap-2 mb-2">
      <Icon name="ph:warning-circle-bold" class="w-5 h-5 text-warning" />
      <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">تنبيهات المخزون</h2>
    </div>
    
    <p class="text-sm font-medium text-muted mb-4">
      <span class="text-warning font-bold">{{ products.length }} منتجات</span> تحتاج إلى إعادة تخزين
    </p>
    
    <div class="flex flex-col gap-3 mb-5 relative z-10">
      <div v-for="(product, index) in products" :key="index" class="flex items-center justify-between bg-white dark:bg-gray-800/80 p-3 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
            <Icon name="ph:package-bold" class="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <div class="text-sm font-bold text-primary-navy dark:text-white leading-none mb-1">{{ product.name }}</div>
            <div class="text-[11px] font-bold text-danger">{{ product.stock }} متبقي</div>
          </div>
        </div>
      </div>
    </div>
    
    <NuxtLink to="/dashboard/products?filter=low-stock" class="block w-full text-center text-sm font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary dark:bg-primary/20 dark:hover:bg-primary transition-colors py-2.5 rounded-lg relative z-10">
      إدارة المخزون
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const products = [
  { name: 'سماعات لاسلكية', stock: 3 },
  { name: 'ساعة ذكية', stock: 5 },
  { name: 'حقيبة ظهر', stock: 7 },
]
</script>
