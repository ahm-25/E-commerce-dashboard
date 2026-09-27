<template>
  <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
    <div class="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:warning-circle-bold" class="w-10 h-10" />
    </div>
    
    <h3 class="text-xl font-black text-primary-navy dark:text-white font-ibm mb-2">تعذر تحميل الأقسام</h3>
    <p class="text-muted text-sm leading-relaxed mb-6">
      {{ error || 'حدث خطأ أثناء تحميل بيانات الأقسام.' }}
    </p>
    
    <button @click="$emit('retry')" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
      <Icon name="ph:arrows-clockwise-bold" class="w-4 h-4" />
      إعادة المحاولة
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string
}>()

defineEmits(['retry'])
</script>
