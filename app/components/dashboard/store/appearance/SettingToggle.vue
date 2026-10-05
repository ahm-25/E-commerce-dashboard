<!-- A labelled on/off row used by the appearance sections -->
<template>
  <div class="flex items-center justify-between gap-4 py-1">
    <div class="min-w-0">
      <div class="text-sm font-semibold text-primary-navy dark:text-white">{{ label }}</div>
      <div v-if="hint" class="text-xs text-muted mt-0.5">{{ hint }}</div>
    </div>
    <ToggleSwitch v-model="model" :label="label" />
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

defineProps<{ label: string, hint?: string }>()
const model = defineModel<boolean>({ required: true })
</script>
