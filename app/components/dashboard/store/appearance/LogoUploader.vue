<template>
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">شعار المتجر</h3>
    <p class="text-xs text-gray-500 mb-4">يفضل استخدام صورة واضحة بخلفية شفافة للحصول على أفضل نتيجة. (الحد الأقصى 2MB)</p>
    
    <div class="flex items-start gap-4">
      <div 
        class="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative group"
        :class="{'border-dashed border-2 hover:border-primary transition-colors': !logoPreview}"
      >
        <img v-if="logoPreview" :src="logoPreview" alt="Store Logo" class="max-w-full max-h-full object-contain p-2" />
        <div v-else class="text-gray-400 flex flex-col items-center">
          <Icon name="lucide:image" class="w-8 h-8 mb-2" />
          <span class="text-xs">لا يوجد شعار</span>
        </div>
        
        <div v-if="logoPreview" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button @click="triggerUpload" class="p-2 bg-white rounded-full text-gray-700 hover:text-primary" title="تغيير">
            <Icon name="lucide:upload" class="w-4 h-4" />
          </button>
          <button @click="handleRemove" class="p-2 bg-white rounded-full text-red-600 hover:text-red-700" title="حذف">
            <Icon name="lucide:trash-2" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div class="flex flex-col gap-2 pt-2">
        <button v-if="!logoPreview" @click="triggerUpload" class="text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
          رفع شعار
        </button>
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="image/png, image/jpeg, image/svg+xml, image/webp" 
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

const logoPreview = computed(() => draftAppearance.value?.logo || '')

const triggerUpload = () => {
  fileInput.value?.click()
}

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، الحد الأقصى هو 2MB')
      return
    }
    await handleImageUpload('logo', file)
  }
}

const handleRemove = () => {
  removeImage('logo')
}
</script>
