<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">هوية المتجر</h2>
    
    <div class="space-y-6">
      <DashboardStoreAppearanceLogoUploader />
      <hr class="border-gray-100" />
      <DashboardStoreAppearanceFaviconUploader />
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic handled in child components
</script>
