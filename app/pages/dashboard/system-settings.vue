<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">الإعدادات</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الإعدادات</h1>
        <p class="text-sm text-muted mt-1">حسابك، وفريق العمل وصلاحياتهم، وأمان الدخول.</p>
      </div>

      <!-- Tabs (kept in the URL so a tab can be linked to directly) -->
      <div class="border-b border-border-light dark:border-border-dark flex gap-6 overflow-x-auto">
        <NuxtLink
          v-for="tab in visibleTabs"
          :key="tab.id"
          :to="{ query: { tab: tab.id } }"
          replace
          class="pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2"
          :class="currentTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary-navy dark:hover:text-white'"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </NuxtLink>
      </div>

      <!-- Account doesn't depend on the fetched team data -->
      <AccountSettings v-if="currentTab === 'account'" />

      <template v-else>
        <div v-if="store.loading" class="flex flex-col gap-4 animate-pulse">
          <div class="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>

        <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
          <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
          <p class="text-muted mb-6">{{ store.error }}</p>
          <button @click="store.fetchSystem()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
            <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>

        <template v-else-if="store.loaded">
          <TeamMembers v-if="currentTab === 'team'" />
          <RolesPermissions v-else-if="currentTab === 'roles'" />
          <SecuritySettings v-else-if="currentTab === 'security'" />
        </template>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSystemStore } from '~/stores/system'
import { useAuthStore } from '~/stores/auth'
import AccountSettings from '~/components/dashboard/system/AccountSettings.vue'
import TeamMembers from '~/components/dashboard/system/TeamMembers.vue'
import RolesPermissions from '~/components/dashboard/system/RolesPermissions.vue'
import SecuritySettings from '~/components/dashboard/system/SecuritySettings.vue'

const store = useSystemStore()
const auth = useAuthStore()
const route = useRoute()

const tabs = [
  { id: 'account', label: 'حسابي', icon: 'ph:user-circle' },
  { id: 'team', label: 'فريق العمل', icon: 'ph:users-three' },
  { id: 'roles', label: 'الأدوار والصلاحيات', icon: 'ph:key' },
  { id: 'security', label: 'الأمان', icon: 'ph:shield-check' }
] as const

// Team and roles need the "team" permission; account and security are for everyone
const visibleTabs = computed(() =>
  tabs.filter(t => (t.id !== 'team' && t.id !== 'roles') || auth.can('team'))
)

const currentTab = computed(() => {
  const tab = route.query.tab as string
  return visibleTabs.value.some(t => t.id === tab) ? tab : 'account'
})

useHead({
  title: 'الإعدادات | لوحة التحكم'
})

onMounted(() => {
  if (!store.loaded) store.fetchSystem()
})
</script>
