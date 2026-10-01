<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="label"
    :disabled="disabled"
    class="relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="model ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
    @click="model = !model"
  >
    <span
      class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
      :class="model ? 'left-0.5' : 'left-[22px]'"
    ></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ required: true })
</script>
