<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6 max-w-4xl" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">الإشعارات</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الإشعارات</h1>
          <p class="text-sm text-muted mt-1">
            {{ store.unreadCount ? `${store.unreadCount} إشعار غير مقروء` : 'كل الإشعارات مقروءة' }}
          </p>
        </div>
        <button
          v-if="tab !== 'preferences' && store.unreadCount"
          @click="store.markAllRead()"
          class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Icon name="ph:checks-bold" class="w-4 h-4" />
          تحديد الكل كمقروء
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-border-light dark:border-border-dark flex gap-6 overflow-x-auto">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="tab = t.id"
          class="pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2"
          :class="tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary-navy dark:hover:text-white'"
        >
          {{ t.label }}
          <span v-if="t.id === 'unread' && store.unreadCount" class="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">{{ store.unreadCount }}</span>
        </button>
      </div>

      <!-- List -->
      <template v-if="tab !== 'preferences'">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in typeFilters"
            :key="option.value"
            @click="typeFilter = option.value"
            class="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
            :class="typeFilter === option.value
              ? 'bg-primary text-white border-primary'
              : 'bg-surface dark:bg-surface-dark border-border-light dark:border-border-dark text-muted hover:text-primary-navy dark:hover:text-white'"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
          <template v-for="group in grouped" :key="group.label">
            <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-muted border-b border-border-light dark:border-border-dark">
              {{ group.label }}
            </div>
            <div class="divide-y divide-border-light dark:divide-border-dark border-b border-border-light dark:border-border-dark last:border-b-0">
              <NotificationItem v-for="n in group.items" :key="n.id" :notification="n" />
            </div>
          </template>

          <div v-if="!filtered.length" class="py-16 text-center">
            <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-muted flex items-center justify-center mx-auto mb-3">
              <Icon :name="tab === 'unread' ? 'ph:checks' : 'ph:bell-slash'" class="w-7 h-7" />
            </div>
            <p class="font-bold text-primary-navy dark:text-white">{{ tab === 'unread' ? 'مفيش إشعارات غير مقروءة' : 'لا توجد إشعارات' }}</p>
            <p v-if="typeFilter !== 'all'" class="text-sm text-muted mt-1">
              جرّب
              <button @click="typeFilter = 'all'" class="text-primary font-bold hover:underline">عرض كل الأنواع</button>
            </p>
          </div>
        </div>
      </template>

      <!-- Preferences -->
      <div v-else class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-border-light dark:border-border-dark">
          <h2 class="font-bold text-primary-navy dark:text-white font-ibm">تفضيلات الإشعارات</h2>
          <p class="text-xs text-muted mt-0.5">اختار إيه يوصلك في لوحة التحكم وإيه يوصلك على الإيميل ({{ email }})</p>
        </div>
        <table class="w-full text-sm text-right">
          <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted">
            <tr>
              <th class="px-5 py-2.5 font-bold">النوع</th>
              <th class="px-5 py-2.5 font-bold text-center w-28">لوحة التحكم</th>
              <th class="px-5 py-2.5 font-bold text-center w-28">الإيميل</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light dark:divide-border-dark">
            <tr v-for="type in visibleTypes" :key="type">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="NOTIFICATION_TYPES[type].iconClass">
                    <Icon :name="NOTIFICATION_TYPES[type].icon" class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="font-bold text-primary-navy dark:text-white">{{ NOTIFICATION_TYPES[type].label }}</div>
                    <div class="text-xs text-muted">{{ NOTIFICATION_TYPES[type].description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3"><div class="flex justify-center"><ToggleSwitch v-model="prefs[type].inApp" :label="`${NOTIFICATION_TYPES[type].label} في لوحة التحكم`" /></div></td>
              <td class="px-5 py-3"><div class="flex justify-center"><ToggleSwitch v-model="prefs[type].email" :label="`${NOTIFICATION_TYPES[type].label} على الإيميل`" /></div></td>
            </tr>
          </tbody>
        </table>
        <div class="px-5 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
          <span v-if="justSaved" class="text-sm font-bold text-success flex items-center gap-1.5">
            <Icon name="ph:check-circle-bold" class="w-5 h-5" />
            تم الحفظ
          </span>
          <button v-if="prefsDirty" @click="resetPrefs" :disabled="saving" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
            تجاهل
          </button>
          <button @click="savePrefs" :disabled="saving || !prefsDirty" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]">
            {{ saving ? 'جاري الحفظ...' : 'حفظ التفضيلات' }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useNotificationsStore, NOTIFICATION_TYPES, type NotificationType, type AppNotification } from '~/stores/notifications'
import { useAuthStore } from '~/stores/auth'
import { useSystemStore } from '~/stores/system'
import NotificationItem from '~/components/dashboard/notifications/NotificationItem.vue'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const store = useNotificationsStore()
const auth = useAuthStore()
const system = useSystemStore()

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'unread', label: 'غير المقروءة' },
  { id: 'preferences', label: 'التفضيلات' }
] as const
const tab = ref<typeof tabs[number]['id']>('all')

// Types the user is allowed to receive
const visibleTypes = computed(() =>
  (Object.keys(NOTIFICATION_TYPES) as NotificationType[]).filter(t => {
    const module = NOTIFICATION_TYPES[t].module
    return !module || auth.can(module)
  })
)

const typeFilter = ref<NotificationType | 'all'>('all')
const typeFilters = computed(() => [
  { value: 'all' as const, label: 'كل الأنواع' },
  ...visibleTypes.value.map(t => ({ value: t, label: NOTIFICATION_TYPES[t].label }))
])

const filtered = computed(() =>
  store.items.filter(n =>
    (tab.value !== 'unread' || !n.read) && (typeFilter.value === 'all' || n.type === typeFilter.value)
  )
)

const dayLabel = (iso: string) => {
  const date = new Date(iso)
  const today = new Date()
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOf(today) - startOf(date)) / 86_400_000)
  if (diffDays === 0) return 'اليوم'
  if (diffDays === 1) return 'أمس'
  if (diffDays < 7) return 'هذا الأسبوع'
  return 'أقدم'
}

const grouped = computed(() => {
  const groups: { label: string, items: AppNotification[] }[] = []
  for (const n of filtered.value) {
    const label = dayLabel(n.createdAt)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(n)
    else groups.push({ label, items: [n] })
  }
  return groups
})

// Preferences
const email = computed(() => system.profile.email)
const prefs = ref(structuredClone(toRaw(store.preferences)))
const saving = ref(false)
const justSaved = ref(false)

const prefsDirty = computed(() => JSON.stringify(prefs.value) !== JSON.stringify(store.preferences))

const resetPrefs = () => {
  prefs.value = structuredClone(toRaw(store.preferences))
}

const savePrefs = async () => {
  saving.value = true
  try {
    await store.savePreferences(prefs.value)
    resetPrefs()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 2500)
  } finally {
    saving.value = false
  }
}

useHead({
  title: computed(() => `${store.unreadCount ? `(${store.unreadCount}) ` : ''}الإشعارات | لوحة التحكم`)
})
</script>
