<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:warning-circle-bold" class="w-10 h-10 text-danger" />
    </div>
    
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2 font-ibm">
      تعذر تحميل الطلبات
    </h3>
    
    <p class="text-muted max-w-md mx-auto mb-8 text-sm font-medium leading-relaxed">
      {{ error || 'حدث خطأ أثناء تحميل بيانات الطلبات. يرجى المحاولة مرة أخرى.' }}
    </p>
    
    <button @click="$emit('retry')" class="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
      <Icon name="ph:arrows-clockwise-bold" class="w-4 h-4" />
      إعادة المحاولة
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
