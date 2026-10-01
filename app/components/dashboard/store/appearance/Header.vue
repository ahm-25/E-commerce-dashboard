<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 md:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
    <div>
      <nav class="flex text-sm text-muted mb-2" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 space-x-reverse">
          <li><NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink></li>
          <li><span>/</span></li>
          <li><span>المتجر</span></li>
          <li><span>/</span></li>
          <li class="text-primary-navy dark:text-gray-100 font-medium">المظهر</li>
        </ol>
      </nav>
      <h1 class="text-2xl font-bold text-primary-navy dark:text-white">مظهر المتجر</h1>
      <p class="text-sm text-muted mt-1">خصص المظهر العام لمتجرك ليتناسب مع هوية علامتك التجارية.</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div v-if="hasUnsavedChanges" class="text-sm text-warning font-medium flex items-center gap-1">
        <Icon name="lucide:alert-circle" class="w-4 h-4" />
        توجد تغييرات غير محفوظة
      </div>
      <div v-else-if="lastPublished" class="text-sm text-muted flex items-center gap-1">
        <Icon name="lucide:check-circle-2" class="w-4 h-4 text-success" />
        آخر نشر: {{ formattedLastPublished }}
      </div>
      
      <DashboardStoreAppearanceActions />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { hasUnsavedChanges, lastPublished } = useStoreAppearance()

const formattedLastPublished = computed(() => {
  if (!lastPublished.value) return ''
  const date = new Date(lastPublished.value)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
  
  if (diffInMinutes < 1) return 'الآن'
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
  
  return date.toLocaleDateString('ar-EG')
})
</script>
