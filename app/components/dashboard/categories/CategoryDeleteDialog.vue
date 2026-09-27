<template>
  <UModal v-model="isOpen">
    <div class="p-6">
      <div class="flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
          <Icon name="ph:warning-circle-bold" class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">حذف القسم؟</h3>
        <p class="text-muted text-sm mb-6">
          هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        
        <div class="flex items-center gap-3 w-full">
          <UButton color="gray" variant="soft" block @click="isOpen = false" class="flex-1">
            إلغاء
          </UButton>
          <UButton color="red" variant="solid" block @click="confirmDelete" class="flex-1">
            حذف القسم
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const categoryIdToDelete = ref<string | null>(null)

// For actual implementation, this could be driven by a store state 
// or an event bus. This is a placeholder for the component structure.
const confirmDelete = () => {
  // Execute delete logic
  isOpen.value = false
}
</script>
