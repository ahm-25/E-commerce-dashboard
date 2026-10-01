<template>
  <div v-if="actions.length" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">إجراءات سريعة</h2>

    <div class="grid grid-cols-2 gap-3">
      <NuxtLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="flex flex-col items-center justify-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white dark:hover:bg-primary border border-border-light dark:border-border-dark rounded-xl p-4 transition-all group text-primary-navy dark:text-white hover:shadow-md hover:border-primary"
      >
        <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
          <Icon :name="action.icon" class="w-5 h-5 text-primary group-hover:text-white" />
        </div>
        <span class="text-sm font-semibold">{{ action.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { getRoutePermission } from '~/utils/routePermissions'

const auth = useAuthStore()

const allActions = [
  { to: '/dashboard/products/create', label: 'إضافة منتج', icon: 'ph:plus-bold' },
  { to: '/dashboard/categories/create', label: 'إضافة قسم', icon: 'ph:folder-plus-bold' },
  { to: '/dashboard/discounts/create', label: 'إنشاء عرض', icon: 'ph:ticket-bold' },
  { to: '/dashboard/orders', label: 'مشاهدة الطلبات', icon: 'ph:package-bold' }
]

// Same rule as the route middleware, so a shown action never leads to "no access"
const actions = computed(() =>
  allActions.filter(a => {
    const required = getRoutePermission(a.to)
    return !required || auth.can(required.module, required.level)
  })
)
</script>
