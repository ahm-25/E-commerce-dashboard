<template>
  <div class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
    <div>
      <label :for="`color-${field}`" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <p class="text-xs text-gray-500 mt-0.5">{{ description }}</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs font-mono text-gray-500 uppercase">{{ colorValue }}</span>
      <div class="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 shadow-sm cursor-pointer">
        <input 
          :id="`color-${field}`"
          type="color" 
          :value="colorValue" 
          @input="onInput"
          class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0" 
        />
        <div class="w-full h-full" :style="{ backgroundColor: colorValue }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const props = defineProps<{
  label: string
  field: 'primary' | 'secondary' | 'accent' | 'text' | 'background'
  description?: string
}>()

const { draftAppearance, updateField } = useStoreAppearance()

const colorValue = computed(() => {
  return draftAppearance.value?.colors[props.field] || '#000000'
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  updateField('colors', props.field, target.value)
}
</script>
