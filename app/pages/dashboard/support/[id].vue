<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6 max-w-3xl" dir="rtl">
      <div class="flex items-center gap-2 text-sm text-muted">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <NuxtLink to="/dashboard/support" class="hover:text-primary transition-colors">الدعم</NuxtLink>
        <Icon name="ph:caret-left" class="w-3 h-3" />
        <span class="text-primary-navy dark:text-white font-medium" dir="ltr">{{ ticket?.number || '' }}</span>
      </div>

      <!-- Not Found -->
      <div v-if="!ticket" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:chats-circle" class="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
        <h1 class="text-2xl font-bold text-primary-navy dark:text-white mb-2">التذكرة غير موجودة</h1>
        <NuxtLink to="/dashboard/support" class="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          العودة للدعم
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold text-muted" dir="ltr">{{ ticket.number }}</span>
              <TicketStatusBadge :status="ticket.status" />
            </div>
            <h1 class="text-xl font-black text-primary-navy dark:text-white font-ibm">{{ ticket.subject }}</h1>
            <p class="text-xs text-muted mt-1">
              {{ TICKET_CATEGORIES[ticket.category] }} · أولوية {{ TICKET_PRIORITIES[ticket.priority] }} · فُتحت {{ formatRelativeTime(ticket.createdAt) }}
            </p>
          </div>
          <button
            v-if="ticket.status !== 'closed'"
            @click="close"
            class="shrink-0 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            <Icon name="ph:check-circle" class="w-4 h-4 inline -mt-0.5" />
            تم حل المشكلة
          </button>
        </div>

        <!-- Thread -->
        <div class="flex flex-col gap-4">
          <div
            v-for="message in ticket.messages"
            :key="message.id"
            class="flex gap-3"
            :class="message.author === 'me' ? '' : 'flex-row-reverse'"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0"
              :class="message.author === 'me' ? 'bg-primary/10 text-primary' : 'bg-primary-navy text-white'"
            >
              <Icon v-if="message.author === 'support'" name="ph:headset-bold" class="w-4 h-4" />
              <template v-else>{{ message.authorName.charAt(0) }}</template>
            </div>
            <div
              class="max-w-[85%] rounded-xl p-4 border"
              :class="message.author === 'me'
                ? 'bg-surface dark:bg-surface-dark border-border-light dark:border-border-dark'
                : 'bg-primary/5 border-primary/20'"
            >
              <div class="flex items-center justify-between gap-4 mb-1.5">
                <span class="text-sm font-bold text-primary-navy dark:text-white">{{ message.authorName }}</span>
                <span class="text-[11px] text-muted whitespace-nowrap">{{ formatRelativeTime(message.createdAt) }}</span>
              </div>
              <p class="text-sm text-primary-navy dark:text-white leading-relaxed whitespace-pre-line">{{ message.body }}</p>
            </div>
          </div>
        </div>

        <!-- Reply -->
        <form class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4 flex flex-col gap-3" @submit.prevent="send">
          <p v-if="ticket.status === 'closed'" class="text-xs text-muted flex items-center gap-1.5">
            <Icon name="ph:info" class="w-4 h-4" />
            التذكرة مغلقة. لو بعتّ رد هتتفتح تاني.
          </p>
          <textarea
            v-model="reply"
            rows="3"
            placeholder="اكتب ردك..."
            aria-label="الرد"
            class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
            @keydown.ctrl.enter="send"
          ></textarea>
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs text-muted">Ctrl + Enter للإرسال</span>
            <button
              type="submit"
              :disabled="sending || !reply.trim()"
              class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name="ph:paper-plane-tilt-bold" class="w-4 h-4" />
              {{ sending ? 'جاري الإرسال...' : 'إرسال' }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupportStore, TICKET_CATEGORIES, TICKET_PRIORITIES } from '~/stores/support'
import { formatRelativeTime } from '~/composables/useRelativeTime'
import TicketStatusBadge from '~/components/dashboard/support/TicketStatusBadge.vue'

const store = useSupportStore()
const route = useRoute()

const ticket = computed(() => store.ticketById(route.params.id as string))

const reply = ref('')
const sending = ref(false)

const send = async () => {
  if (!ticket.value || !reply.value.trim() || sending.value) return
  sending.value = true
  try {
    await store.reply(ticket.value.id, reply.value.trim())
    reply.value = ''
  } catch (err: any) {
    alert(err.message || 'تعذر إرسال الرد')
  } finally {
    sending.value = false
  }
}

const close = () => {
  if (ticket.value && confirm('تقفل التذكرة؟ تقدر تفتحها تاني لو رديت عليها.')) {
    store.closeTicket(ticket.value.id)
  }
}

useHead({
  title: computed(() => `${ticket.value?.number || 'تذكرة'} | الدعم`)
})
</script>
