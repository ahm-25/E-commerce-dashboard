<template>
  <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-light dark:border-border-dark">
    <div class="flex items-center gap-2 text-sm font-semibold text-primary-navy dark:text-white">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </span>
      معاينة مباشرة
    </div>

    <div class="flex items-center gap-1 p-1 rounded-lg bg-bg dark:bg-bg-dark border border-border-light dark:border-border-dark">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="$emit('update:modelValue', option.value)"
        class="p-1.5 rounded-md flex items-center justify-center transition-colors"
        :class="modelValue === option.value
          ? 'bg-surface dark:bg-surface-dark text-primary shadow-sm'
          : 'text-muted hover:text-primary-navy dark:hover:text-white'"
        :title="option.label"
        :aria-label="option.label"
        :aria-pressed="modelValue === option.value"
      >
        <Icon :name="option.icon" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Device = 'desktop' | 'tablet' | 'mobile'

defineProps<{
  modelValue: Device
}>()
defineEmits(['update:modelValue'])

const options: { value: Device, label: string, icon: string }[] = [
  { value: 'desktop', label: 'كمبيوتر', icon: 'lucide:monitor' },
  { value: 'tablet', label: 'تابلت', icon: 'lucide:tablet' },
  { value: 'mobile', label: 'موبايل', icon: 'lucide:smartphone' }
]
</script>
