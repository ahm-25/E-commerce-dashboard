<template>
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">Favicon</h3>
    <p class="text-xs text-gray-500 mb-4">أيقونة المتجر التي تظهر في متصفح الزوار. (يفضل 32x32 أو 64x64 بيكسل)</p>
    
    <div class="flex items-center gap-4">
      <div 
        class="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden"
      >
        <img v-if="faviconPreview" :src="faviconPreview" alt="Favicon" class="w-8 h-8 object-contain" />
        <Icon v-else name="lucide:globe" class="w-6 h-6 text-gray-400" />
      </div>
      
      <div class="flex items-center gap-2">
        <button @click="triggerUpload" class="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
          تغيير
        </button>
        <button v-if="faviconPreview" @click="handleRemove" class="text-xs px-3 py-1.5 text-red-600 hover:text-red-700">
          حذف
        </button>
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="image/png, image/x-icon, image/svg+xml" 
          @change="onFileChange" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, handleImageUpload, removeImage } = useStoreAppearance()
const fileInput = ref<HTMLInputElement | null>(null)

const faviconPreview = computed(() => draftAppearance.value?.favicon || '')

const triggerUpload = () => {
  fileInput.value?.click()
}

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    await handleImageUpload('favicon', file)
  }
}

const handleRemove = () => {
  removeImage('favicon')
}
</script>
