<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <h3 class="font-black text-primary-navy dark:text-white mb-4">الوسوم</h3>
    
    <div class="flex flex-wrap gap-2 mb-3">
      <span 
        v-for="(tag, index) in form.tags" 
        :key="index"
        class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
      >
        <button @click="removeTag(index)" class="hover:text-primary-navy"><Icon name="ph:x-bold" /></button>
        {{ tag }}
      </span>
      <span v-if="form.tags.length === 0" class="text-sm text-muted">لا توجد وسوم.</span>
    </div>
    
    <input 
      v-model="newTag" 
      @keydown.enter.prevent="addTag"
      type="text" 
      placeholder="أضف وسماً..." 
      class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
const newTag = ref('')

const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    isDirty.value = true
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.tags.splice(index, 1)
  isDirty.value = true
}
</script>
