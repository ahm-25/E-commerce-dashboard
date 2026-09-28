<template>
  <div class="p-6">
    <div class="flex flex-col items-center justify-center py-8 text-center text-red-600 dark:text-red-400">
      <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 mb-4 opacity-80" />
      <h3 class="text-lg font-bold mb-2">تعذر تحميل الخصومات</h3>
      <p class="text-sm opacity-80 mb-6">{{ error }}</p>
      <UButton
        color="red"
        variant="soft"
        icon="i-heroicons-arrow-path"
        @click="$emit('retry')"
      >
        إعادة المحاولة
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string
}>()

defineEmits(['retry'])
</script>
