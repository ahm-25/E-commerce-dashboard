<template>
  <div class="flex flex-col gap-1 w-full max-w-[120px]">
    <div class="text-xs text-text-muted dark:text-text-muted-dark flex justify-between">
      <span>{{ usageCount }}</span>
      <span v-if="usageLimit">{{ usageLimit }}</span>
      <span v-else>∞</span>
    </div>
    <div class="w-full bg-border-light dark:bg-border-dark h-1.5 rounded-full overflow-hidden">
      <div 
        class="h-full rounded-full bg-primary transition-all duration-300"
        :style="{ width: progressPercentage + '%' }"
        :class="{ 'bg-red-500': progressPercentage >= 100 }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  usageCount: number
  usageLimit?: number
}>()

const progressPercentage = computed(() => {
  if (!props.usageLimit) return 0 // or 100 depending on design for unlimited, let's say 0 to mean it's not filling up
  const percentage = (props.usageCount / props.usageLimit) * 100
  return Math.min(percentage, 100)
})
</script>
