<template>
  <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto">
    <div class="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:warning-circle-duotone" class="w-10 h-10 text-red-500" />
    </div>
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تعذر تحميل العملاء</h3>
    <p class="text-muted mb-8 leading-relaxed">
      {{ error || 'حدث خطأ أثناء تحميل بيانات العملاء. يرجى المحاولة مرة أخرى لاحقاً.' }}
    </p>
    <button 
      @click="$emit('retry')"
      class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm shadow-primary/20"
    >
      <Icon name="ph:arrows-clockwise-bold" class="w-5 h-5" />
      إعادة المحاولة
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string | null
}>()

defineEmits(['retry'])
</script>
