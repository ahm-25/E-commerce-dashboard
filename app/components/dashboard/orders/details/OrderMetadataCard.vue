<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
        <Icon name="ph:info" class="w-5 h-5" />
      </div>
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">معلومات الطلب</h2>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">رقم الطلب</span>
        <span class="text-sm font-bold text-primary-navy dark:text-white font-mono">{{ order.orderNumber }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">تاريخ الإنشاء</span>
        <span class="text-sm text-primary-navy dark:text-white">{{ formatDate(order.createdAt) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">آخر تحديث</span>
        <span class="text-sm text-primary-navy dark:text-white">{{ formatDate(order.updatedAt) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">مصدر الطلب</span>
        <span class="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-primary-navy dark:text-white">{{ order.source || 'متجر إلكتروني' }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">عدد المنتجات</span>
        <span class="text-sm font-bold text-primary-navy dark:text-white">{{ order.items?.length || 0 }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">مرات التحديث</span>
        <span class="text-sm font-bold text-primary-navy dark:text-white">{{ order.updateCount || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}
</script>
