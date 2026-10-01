<template>
  <div v-if="canManage" class="flex flex-wrap items-center gap-2">
    <button 
      @click="showResetDialog = true"
      class="px-4 py-2 text-sm font-medium text-primary-navy dark:text-gray-100 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-bg dark:hover:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors inline-flex items-center gap-1.5"
    >
      <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
      إعادة للافتراضي
    </button>
    <button 
      @click="handleSaveDraft"
      :disabled="!hasUnsavedChanges || isSaving"
      class="px-4 py-2 text-sm font-medium text-primary-navy dark:text-gray-100 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-bg dark:hover:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon v-if="isSaving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
      <Icon v-else name="lucide:save" class="w-4 h-4" />
      حفظ كمسودة
    </button>
    <button 
      @click="showPublishDialog = true"
      :disabled="isPublishing"
      class="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      <Icon v-if="isPublishing" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
      <Icon v-else name="lucide:globe" class="w-4 h-4" />
      نشر التغييرات
    </button>

    <DashboardStoreAppearanceResetAppearanceDialog 
      v-if="showResetDialog" 
      @close="showResetDialog = false"
      @confirm="handleReset"
    />
    
    <DashboardStoreAppearancePublishAppearanceDialog 
      v-if="showPublishDialog" 
      @close="showPublishDialog = false"
      @confirm="handlePublish"
    />
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { hasUnsavedChanges, isSaving, isPublishing, saveDraft, publishAppearance, resetToDefault } = useStoreAppearance()

const showResetDialog = ref(false)
const showPublishDialog = ref(false)

const handleSaveDraft = async () => {
  await saveDraft()
}

const handlePublish = async () => {
  showPublishDialog.value = false
  await publishAppearance()
}

const handleReset = () => {
  resetToDefault()
  showResetDialog.value = false
}

const canManage = useCanManage('storefront')
</script>
