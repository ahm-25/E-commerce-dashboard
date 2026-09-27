<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium">الأقسام</span>
      </div>
      <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الأقسام</h1>
      <p class="text-muted text-sm mt-1.5 font-bold">نظّم منتجات متجرك من خلال إنشاء وإدارة الأقسام.</p>
    </div>
    
    <div class="flex items-center gap-3">
      <NuxtLink to="/dashboard/categories/create" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إضافة قسم
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
