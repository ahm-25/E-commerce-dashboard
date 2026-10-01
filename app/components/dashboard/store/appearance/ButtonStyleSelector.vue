<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">شكل الأزرار</label>
    
    <div class="grid grid-cols-2 gap-4">
      <button 
        v-for="option in options" 
        :key="option.value"
        @click="buttonStyle = option.value"
        class="border p-4 flex flex-col items-center gap-4 transition-colors text-center"
        :class="[
          buttonStyle === option.value ? 'border-primary bg-primary-light ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300',
          'rounded-lg' // Container itself is rounded
        ]"
      >
        <div 
          class="w-full py-2.5 px-4 text-white text-sm font-medium flex items-center justify-center transition-all"
          :class="[option.previewClass]"
          :style="{ backgroundColor: draftAppearance?.colors.primary || '#2563EB' }"
        >
          أضف إلى السلة
        </div>
        <span class="text-xs font-medium" :class="buttonStyle === option.value ? 'text-primary' : 'text-gray-600'">
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

const buttonStyle = computed({
  get: () => draftAppearance.value?.shape.buttonStyle || 'rounded',
  set: (val) => updateField('shape', 'buttonStyle', val)
})

const options: { value: StoreAppearance['shape']['buttonStyle'], label: string, previewClass: string }[] = [
  { value: 'square', label: 'مستطيلة', previewClass: 'rounded-none' },
  { value: 'rounded', label: 'دائرية الحواف', previewClass: 'rounded-md' },
  { value: 'soft', label: 'ناعمة', previewClass: 'rounded-xl' },
  { value: 'pill', label: 'بيضاوية', previewClass: 'rounded-full' }
]
</script>
