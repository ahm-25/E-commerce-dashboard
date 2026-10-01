<template>
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap" :class="config.class">
    <span class="w-1.5 h-1.5 rounded-full" :class="config.dot"></span>
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TicketStatus } from '~/stores/support'

const props = defineProps<{
  status: TicketStatus
}>()

const config = computed(() => ({
  open: { label: 'بانتظار الدعم', class: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  awaiting_reply: { label: 'بانتظار ردك', class: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  closed: { label: 'مغلقة', class: 'bg-gray-100 dark:bg-gray-800 text-muted', dot: 'bg-muted' }
}[props.status]))
</script>
