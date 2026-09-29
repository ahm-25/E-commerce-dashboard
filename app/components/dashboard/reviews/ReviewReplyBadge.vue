<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="hasReply ? 'bg-primary/10 text-primary' : 'bg-surface-alt dark:bg-surface-dark-alt text-text-muted dark:text-text-muted-dark'"
  >
    {{ hasReply ? 'تم الرد' : 'بدون رد' }}
  </span>
</template>

<script setup lang="ts">
defineProps({
  hasReply: {
    type: Boolean,
    required: true
  }
})
</script>
