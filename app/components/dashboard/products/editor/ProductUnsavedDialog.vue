<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg w-full max-w-sm overflow-hidden transform transition-all">
      <div class="p-6">
        <div class="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-4">
          <Icon name="ph:warning-circle-bold" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-black text-primary-navy dark:text-white mb-2">لديك تغييرات غير محفوظة</h3>
        <p class="text-muted text-sm">هل تريد مغادرة الصفحة دون حفظ التغييرات؟</p>
      </div>
      <div class="px-6 py-4 bg-bg dark:bg-bg-dark border-t border-border-light dark:border-border-dark flex items-center gap-3 justify-end">
        <button @click="$emit('stay')" class="px-4 py-2 text-sm font-bold border border-border-light dark:border-border-dark rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors text-primary-navy dark:text-white">
          البقاء
        </button>
        <button @click="$emit('leave')" class="px-4 py-2 text-sm font-bold bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors shadow-sm">
          مغادرة الصفحة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: { type: Boolean, default: false }
})
defineEmits(['stay', 'leave'])
</script>
