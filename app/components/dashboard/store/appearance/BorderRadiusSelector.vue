<template>
  <div>
    <label class="block text-sm font-medium text-primary-navy dark:text-gray-200 mb-3">حواف العناصر</label>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button 
        v-for="option in options" 
        :key="option.value"
        @click="borderRadius = option.value"
        class="border rounded-lg p-3 flex flex-col items-center gap-3 transition-colors text-center"
        :class="borderRadius === option.value ? 'border-primary bg-primary-light dark:bg-primary/10 ring-1 ring-primary' : 'border-border-light dark:border-border-dark hover:border-gray-300'"
      >
        <div 
          class="w-12 h-12 bg-gray-200 border border-gray-300"
          :class="option.previewClass"
        ></div>
        <span class="text-xs font-medium" :class="borderRadius === option.value ? 'text-primary' : 'text-muted'">
          {{ option.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance, type StoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const borderRadius = computed({
  get: () => draftAppearance.value?.shape.borderRadius || 'medium',
  set: (val) => updateField('shape', 'borderRadius', val)
})

const options: { value: StoreAppearance['shape']['borderRadius'], label: string, previewClass: string }[] = [
  { value: 'sharp', label: 'حادة', previewClass: 'rounded-none' },
  { value: 'small', label: 'صغيرة', previewClass: 'rounded-sm' },
  { value: 'medium', label: 'متوسطة', previewClass: 'rounded-md' },
  { value: 'large', label: 'كبيرة', previewClass: 'rounded-2xl' }
]
</script>
