<template>
  <div class="flex flex-col items-center justify-center text-center py-8">
    <div class="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
      <Icon name="ph:warning-circle-bold" class="w-8 h-8" />
    </div>
    
    <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-2">تعذر تحميل المنتجات</h2>
    <p class="text-muted font-medium mb-6">{{ error || 'حدث خطأ أثناء تحميل بيانات المنتجات.' }}</p>
    
    <button @click="$emit('retry')" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
      <Icon name="ph:arrows-clockwise-bold" class="w-4 h-4" />
      إعادة المحاولة
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
