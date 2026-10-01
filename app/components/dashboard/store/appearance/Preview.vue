<template>
  <div class="h-full flex flex-col bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
    <!-- Toolbar -->
    <DashboardStoreAppearancePreviewToolbar v-model="device" class="shrink-0" />

    <!-- Preview Area -->
    <div class="flex-1 min-h-0 flex justify-center bg-bg dark:bg-bg-dark p-4 lg:p-6">
      <div
        class="h-full bg-white rounded-lg shadow-lg ring-1 ring-black/5 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300"
        :class="{
          'w-full': device === 'desktop',
          'w-[768px] max-w-full': device === 'tablet',
          'w-[375px] max-w-full': device === 'mobile'
        }"
      >
        <DashboardStoreAppearanceStorefrontPreview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const device = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
</style>
