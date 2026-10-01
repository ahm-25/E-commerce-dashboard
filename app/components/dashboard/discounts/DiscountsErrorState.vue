<template>
  <div class="p-6">
    <div class="flex flex-col items-center justify-center py-8 text-center text-red-600 dark:text-red-400">
      <Icon name="ph:warning-circle" class="w-12 h-12 mb-4 opacity-80" />
      <h3 class="text-lg font-bold mb-2">تعذر تحميل الخصومات</h3>
      <p class="text-sm opacity-80 mb-6">{{ error }}</p>
      <button @click="$emit('retry')" class="inline-flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger px-5 py-2.5 rounded-lg font-bold text-sm transition-colors">
        <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
        إعادة المحاولة
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string
}>()

defineEmits(['retry'])
</script>
