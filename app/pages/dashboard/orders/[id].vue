<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-text-muted">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <NuxtLink to="/dashboard/orders" class="hover:text-primary transition-colors">الطلبات</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <span class="text-text">{{ route.params.id }}</span>
      </div>

      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:receipt" class="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
        <h1 class="text-2xl font-semibold mb-2">تفاصيل الطلب: {{ route.params.id }}</h1>
        <p class="text-text-muted max-w-md mx-auto">
          هذه الصفحة قيد التطوير. سيتم عرض تفاصيل الطلب، معلومات العميل، المنتجات، المبالغ، ومعلومات الشحن هنا.
        </p>
        <NuxtLink to="/dashboard/orders" class="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
          العودة للطلبات
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({
  title: `الطلب ${route.params.id} | لوحة التحكم`
})
</script>
