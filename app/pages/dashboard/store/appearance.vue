<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <div v-if="isLoading" class="animate-pulse flex flex-col gap-6">
        <!-- Skeleton Loading -->
        <div class="h-32 bg-gray-200 dark:bg-surface-dark rounded-xl"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 xl:col-span-4 space-y-6">
            <div class="h-64 bg-gray-200 dark:bg-surface-dark rounded-xl"></div>
            <div class="h-64 bg-gray-200 dark:bg-surface-dark rounded-xl"></div>
          </div>
          <div class="lg:col-span-7 xl:col-span-8">
            <div class="h-[600px] bg-gray-200 dark:bg-surface-dark rounded-xl"></div>
          </div>
        </div>
      </div>

      <template v-else-if="draftAppearance">
        <DashboardStoreAppearanceHeader />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Settings Panel -->
          <div class="lg:col-span-5 xl:col-span-4 min-w-0">
            <DashboardStoreAppearanceSettings />
          </div>

          <!-- Live Preview (sticky on desktop) -->
          <div class="lg:col-span-7 xl:col-span-8 min-w-0 lg:sticky lg:top-8 h-[70vh] lg:h-[calc(100vh-72px-4rem)]">
            <DashboardStoreAppearancePreview />
          </div>
        </div>

        <!-- Dialogs -->
        <DashboardStoreAppearanceUnsavedChangesDialog
          v-if="showUnsavedDialog"
          @close="showUnsavedDialog = false"
          @confirm="handleUnsavedConfirm"
          @discard="handleUnsavedDiscard"
        />
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { fetchAppearance, isLoading, hasUnsavedChanges, saveDraft, draftAppearance } = useStoreAppearance()
const showUnsavedDialog = ref(false)
const router = useRouter()
let pendingRoute: any = null

onMounted(async () => {
  await fetchAppearance()
})

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedDialog.value = true
    pendingRoute = to
    next(false)
  } else {
    next()
  }
})

const handleUnsavedConfirm = async () => {
  await saveDraft()
  showUnsavedDialog.value = false
  if (pendingRoute) {
    router.push(pendingRoute)
  }
}

const handleUnsavedDiscard = () => {
  hasUnsavedChanges.value = false
  showUnsavedDialog.value = false
  if (pendingRoute) {
    router.push(pendingRoute)
  }
}
</script>

<style scoped>
/* Keeps the sticky preview from overlapping content while scrolling */
.lg\:sticky {
  z-index: 1;
}
</style>
