<template>
  <div ref="rootRef" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 text-muted hover:text-primary-navy dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      :aria-label="store.unreadCount ? `الإشعارات، ${store.unreadCount} غير مقروء` : 'الإشعارات'"
      :aria-expanded="isOpen"
    >
      <Icon name="ph:bell-bold" class="w-5 h-5" />
      <span
        v-if="store.unreadCount"
        class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-danger text-white text-[10px] font-bold rounded-full border-2 border-surface dark:border-surface-dark flex items-center justify-center leading-none"
      >
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-40 overflow-hidden"
      dir="rtl"
    >
      <div class="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <span class="font-bold text-primary-navy dark:text-white">الإشعارات</span>
        <button
          v-if="store.unreadCount"
          @click="store.markAllRead()"
          class="text-xs font-bold text-primary hover:underline"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <div class="max-h-[400px] overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
        <NotificationItem
          v-for="n in latest"
          :key="n.id"
          :notification="n"
          compact
          @navigate="isOpen = false"
        />
        <div v-if="!latest.length" class="px-4 py-10 text-center text-sm text-muted">
          <Icon name="ph:bell-slash" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          لا توجد إشعارات
        </div>
      </div>

      <NuxtLink
        to="/dashboard/notifications"
        @click="isOpen = false"
        class="block text-center text-sm font-bold text-primary py-3 border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/40"
      >
        عرض كل الإشعارات
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNotificationsStore } from '~/stores/notifications'
import NotificationItem from '~/components/dashboard/notifications/NotificationItem.vue'

const store = useNotificationsStore()
const route = useRoute()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const latest = computed(() => store.items.slice(0, 6))

const onOutsideClick = (e: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
}
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

watch(() => route.fullPath, () => { isOpen.value = false })

onMounted(() => {
  document.addEventListener('click', onOutsideClick)
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>
