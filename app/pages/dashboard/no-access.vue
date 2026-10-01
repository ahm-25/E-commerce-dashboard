<template>
  <NuxtLayout name="dashboard">
    <div class="flex items-center justify-center py-16" dir="rtl">
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-12 text-center max-w-md">
        <div class="w-16 h-16 rounded-full bg-warning/10 text-warning flex items-center justify-center mx-auto mb-4">
          <Icon name="ph:lock-simple-bold" class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold text-primary-navy dark:text-white mb-2">ليس لديك صلاحية</h1>
        <p class="text-muted mb-6">
          دورك الحالي ({{ roleName }}) لا يسمح بفتح هذه الصفحة. اطلب من مالك المتجر تعديل صلاحياتك.
        </p>
        <NuxtLink to="/dashboard" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          العودة للوحة التحكم
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSystemStore } from '~/stores/system'

const auth = useAuthStore()
const system = useSystemStore()

const roleName = computed(() => (auth.user ? system.roleById(auth.user.roleId)?.name : '') || '')

useHead({
  title: 'ليس لديك صلاحية | لوحة التحكم'
})
</script>
