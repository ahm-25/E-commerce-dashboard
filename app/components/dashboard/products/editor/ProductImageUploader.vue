<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="mb-4">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">صور المنتج</h2>
      <p class="text-muted text-sm mt-1">أضف صورًا واضحة للمنتج. يمكنك ترتيب الصور بالسحب والإفلات.</p>
    </div>
    
    <!-- Upload Area -->
    <div 
      class="border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-bg dark:hover:bg-bg-dark hover:border-primary/50 transition-all"
    >
      <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
        <Icon name="ph:upload-simple-bold" class="w-6 h-6" />
      </div>
      <p class="text-primary-navy dark:text-white font-bold mb-1">اسحب الصور هنا</p>
      <p class="text-muted text-sm mb-4">أو</p>
      <button class="text-primary font-bold text-sm hover:underline">اختر الصور من جهازك</button>
      <p class="text-muted text-xs mt-4">PNG, JPG, WEBP</p>
    </div>

    <!-- Gallery (Mock display) -->
    <div v-if="form.images.length > 0 || showMockImages" class="mt-6 flex flex-wrap gap-4">
      <div v-if="showMockImages" class="w-24 h-24 rounded-lg border-2 border-primary overflow-hidden relative group cursor-grab">
        <div class="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">الصورة الرئيسية</div>
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" class="w-full h-full object-cover" />
        <button class="absolute bottom-1 left-1 bg-white/80 dark:bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-danger">
          <Icon name="ph:trash-bold" class="w-4 h-4" />
        </button>
      </div>
      <div v-if="showMockImages" class="w-24 h-24 rounded-lg border border-border-light dark:border-border-dark overflow-hidden relative group cursor-grab">
        <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop" class="w-full h-full object-cover" />
        <button class="absolute bottom-1 left-1 bg-white/80 dark:bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-danger">
          <Icon name="ph:trash-bold" class="w-4 h-4" />
        </button>
      </div>
      <!-- Add new -->
      <div v-if="showMockImages" class="w-24 h-24 rounded-lg border border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:bg-bg dark:hover:bg-bg-dark cursor-pointer transition-colors">
        <Icon name="ph:plus-bold" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductForm } from '~/composables/useProductForm'
const { form } = useProductForm()

// To show the mock images as in the design screenshot
const showMockImages = ref(true)
</script>
