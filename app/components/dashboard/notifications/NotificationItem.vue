<template>
  <div
    class="group flex items-start gap-3 px-4 py-3 transition-colors"
    :class="notification.read ? 'hover:bg-gray-50 dark:hover:bg-gray-800/40' : 'bg-primary/5 hover:bg-primary/10'"
  >
    <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0" :class="config.iconClass">
      <Icon :name="config.icon" class="w-4 h-4" />
    </div>

    <button type="button" class="flex-1 min-w-0 text-right" @click="open">
      <div class="flex items-center gap-2">
        <span class="text-sm text-primary-navy dark:text-white truncate" :class="notification.read ? 'font-semibold' : 'font-black'">
          {{ notification.title }}
        </span>
        <span v-if="!notification.read" class="w-2 h-2 rounded-full bg-primary shrink-0" aria-label="غير مقروء"></span>
      </div>
      <p class="text-xs text-muted mt-0.5" :class="compact ? 'line-clamp-1' : 'line-clamp-2'">{{ notification.body }}</p>
      <span class="text-[11px] text-muted mt-1 block">{{ formatRelativeTime(notification.createdAt) }}</span>
    </button>

    <div v-if="!compact" class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <button
        v-if="!notification.read"
        type="button"
        @click="store.markRead(notification.id)"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-white dark:hover:bg-gray-800"
        title="تحديد كمقروء"
      >
        <Icon name="ph:check-bold" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="store.remove(notification.id)"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10"
        title="حذف"
      >
        <Icon name="ph:trash-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationsStore, NOTIFICATION_TYPES, type AppNotification } from '~/stores/notifications'
import { formatRelativeTime } from '~/composables/useRelativeTime'

const props = defineProps<{
  notification: AppNotification
  compact?: boolean
}>()

const emit = defineEmits<{ navigate: [] }>()

const store = useNotificationsStore()
const config = computed(() => NOTIFICATION_TYPES[props.notification.type])

const open = async () => {
  store.markRead(props.notification.id)
  if (props.notification.link) {
    emit('navigate')
    await navigateTo(props.notification.link)
  }
}
</script>
