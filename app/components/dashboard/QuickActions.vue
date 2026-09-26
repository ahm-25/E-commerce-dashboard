<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">إجراءات سريعة</h2>
    
    <div class="grid grid-cols-2 gap-3">
      <NuxtLink to="/dashboard/products/new" class="flex flex-col items-center justify-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white dark:hover:bg-primary border border-border-light dark:border-border-dark rounded-xl p-4 transition-all group text-primary-navy dark:text-white hover:shadow-md hover:border-primary">
        <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
          <Icon name="ph:plus-bold" class="w-5 h-5 text-primary group-hover:text-white" />
        </div>
        <span class="text-sm font-semibold">إضافة منتج</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/categories/new" class="flex flex-col items-center justify-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white dark:hover:bg-primary border border-border-light dark:border-border-dark rounded-xl p-4 transition-all group text-primary-navy dark:text-white hover:shadow-md hover:border-primary">
        <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
          <Icon name="ph:folder-plus-bold" class="w-5 h-5 text-primary group-hover:text-white" />
        </div>
        <span class="text-sm font-semibold">إضافة قسم</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/discounts/new" class="flex flex-col items-center justify-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white dark:hover:bg-primary border border-border-light dark:border-border-dark rounded-xl p-4 transition-all group text-primary-navy dark:text-white hover:shadow-md hover:border-primary">
        <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
          <Icon name="ph:ticket-bold" class="w-5 h-5 text-primary group-hover:text-white" />
        </div>
        <span class="text-sm font-semibold">إنشاء عرض</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/orders" class="flex flex-col items-center justify-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white dark:hover:bg-primary border border-border-light dark:border-border-dark rounded-xl p-4 transition-all group text-primary-navy dark:text-white hover:shadow-md hover:border-primary">
        <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
          <Icon name="ph:package-bold" class="w-5 h-5 text-primary group-hover:text-white" />
        </div>
        <span class="text-sm font-semibold">مشاهدة الطلبات</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
