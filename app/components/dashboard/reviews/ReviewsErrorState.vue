<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="w-20 h-20 mb-4 text-danger flex items-center justify-center bg-danger/10 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-xl font-bold text-text-strong dark:text-text-strong-dark mb-2">تعذر تحميل التقييمات</h3>
    <p class="text-text-regular dark:text-text-regular-dark max-w-sm mb-6">
      {{ error || 'حدث خطأ غير متوقع أثناء تحميل بيانات التقييمات.' }}
    </p>
    <button @click="$emit('retry')" class="btn btn-primary">إعادة المحاولة</button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: {
    type: String,
    default: null
  }
})

defineEmits(['retry'])
</script>
