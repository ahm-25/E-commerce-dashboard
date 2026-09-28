<template>
  <div class="flex items-center gap-1.5">
    <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary">
      <template v-if="type === 'percentage'">{{ value }}%</template>
      <template v-else-if="type === 'fixed'">{{ value }} ج.م</template>
      <template v-else-if="type === 'free_shipping'">شحن مجاني</template>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'percentage' | 'fixed' | 'free_shipping' | string
  value: number
}>()
</script>
