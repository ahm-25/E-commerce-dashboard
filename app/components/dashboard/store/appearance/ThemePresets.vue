<template>
  <div>
    <h3 class="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">القوالب الجاهزة</h3>
    <div class="flex flex-wrap gap-3">
      <button 
        v-for="preset in presets" 
        :key="preset.id"
        @click="applyPreset(preset)"
        class="flex flex-col items-center gap-2 group"
      >
        <div 
          class="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all"
          :class="isPresetActive(preset) ? 'border-primary ring-2 ring-primary-light' : 'border-transparent ring-1 ring-gray-200 group-hover:ring-gray-300'"
        >
          <div class="w-full h-full flex flex-col">
            <div class="h-1/2 w-full" :style="{ backgroundColor: preset.colors.primary }"></div>
            <div class="h-1/2 w-full flex">
              <div class="h-full w-1/2" :style="{ backgroundColor: preset.colors.secondary }"></div>
              <div class="h-full w-1/2" :style="{ backgroundColor: preset.colors.accent }"></div>
            </div>
          </div>
        </div>
        <span class="text-xs font-medium text-gray-600" :class="{ 'text-primary': isPresetActive(preset) }">
          {{ preset.name }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateDraft } = useStoreAppearance()

const presets = [
  {
    id: 'edix-blue',
    name: 'EDIX Blue',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#111827',
      background: '#F9FAFB'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0891B2',
      secondary: '#164E63',
      accent: '#06B6D4',
      text: '#0F172A',
      background: '#F8FAFC'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant',
    colors: {
      primary: '#18181B',
      secondary: '#27272A',
      accent: '#52525B',
      text: '#18181B',
      background: '#FFFFFF'
    }
  },
  {
    id: 'fresh',
    name: 'Fresh',
    colors: {
      primary: '#16A34A',
      secondary: '#14532D',
      accent: '#22C55E',
      text: '#1C1917',
      background: '#FAFAF9'
    }
  }
]

const applyPreset = (preset: typeof presets[0]) => {
  updateDraft('colors', { ...preset.colors })
}

const isPresetActive = (preset: typeof presets[0]) => {
  if (!draftAppearance.value) return false
  const currentColors = draftAppearance.value.colors
  return (
    currentColors.primary === preset.colors.primary &&
    currentColors.secondary === preset.colors.secondary &&
    currentColors.accent === preset.colors.accent
  )
}
</script>
