<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">الدعم</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الدعم والمساعدة</h1>
          <p class="text-sm text-muted mt-1">دوّر على إجابة، أو كلّم فريق دعم EDIX.</p>
        </div>
        <button
          @click="openNewTicket()"
          class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Icon name="ph:plus-bold" class="w-4 h-4" />
          تذكرة جديدة
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- Tabs -->
          <div class="border-b border-border-light dark:border-border-dark flex gap-6">
            <button
              v-for="t in tabs"
              :key="t.id"
              @click="tab = t.id"
              class="pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2"
              :class="tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary-navy dark:hover:text-white'"
            >
              {{ t.label }}
              <span v-if="t.id === 'tickets' && store.openTicketsCount" class="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">{{ store.openTicketsCount }}</span>
            </button>
          </div>

          <HelpCenter v-if="tab === 'help'" @ask="openNewTicket" />

          <!-- Tickets -->
          <div v-else class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div class="divide-y divide-border-light dark:divide-border-dark">
              <NuxtLink
                v-for="ticket in store.sortedTickets"
                :key="ticket.id"
                :to="`/dashboard/support/${ticket.id}`"
                class="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-bold text-muted" dir="ltr">{{ ticket.number }}</span>
                    <TicketStatusBadge :status="ticket.status" />
                  </div>
                  <div class="font-bold text-primary-navy dark:text-white truncate">{{ ticket.subject }}</div>
                  <div class="text-xs text-muted mt-0.5">
                    {{ TICKET_CATEGORIES[ticket.category] }} · آخر تحديث {{ formatRelativeTime(ticket.updatedAt) }} · {{ ticket.messages.length }} رسائل
                  </div>
                </div>
                <Icon name="ph:caret-left-bold" class="w-4 h-4 text-muted shrink-0" />
              </NuxtLink>
            </div>
            <div v-if="!store.tickets.length" class="py-14 text-center">
              <Icon name="ph:chats-circle" class="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
              <p class="font-bold text-primary-navy dark:text-white">مفيش تذاكر</p>
              <p class="text-sm text-muted mt-1">لو عندك مشكلة افتح تذكرة وهنرد عليك</p>
            </div>
          </div>
        </div>

        <!-- Contact & status -->
        <aside class="flex flex-col gap-4">
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
            <h2 class="font-bold text-primary-navy dark:text-white font-ibm mb-4">تواصل معنا</h2>
            <div class="flex flex-col gap-2">
              <a
                v-for="channel in SUPPORT_CHANNELS"
                :key="channel.label"
                :href="channel.href"
                :target="channel.external ? '_blank' : undefined"
                rel="noopener"
                class="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="channel.iconClass">
                  <Icon :name="channel.icon" class="w-5 h-5" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-primary-navy dark:text-white">{{ channel.label }}</div>
                  <div class="text-xs text-muted">{{ channel.detail }}</div>
                </div>
              </a>
            </div>
            <p class="text-xs text-muted mt-4 flex items-center gap-1.5">
              <Icon name="ph:clock" class="w-4 h-4" />
              مواعيد الدعم: السبت إلى الخميس، 9 ص إلى 9 م
            </p>
          </div>

          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
            <h2 class="font-bold text-primary-navy dark:text-white font-ibm mb-3">حالة الخدمات</h2>
            <!-- TODO: Read from the platform status API -->
            <div class="flex items-center gap-2 text-sm font-bold text-success mb-3">
              <Icon name="ph:check-circle-fill" class="w-5 h-5" />
              كل الخدمات شغالة
            </div>
            <ul class="flex flex-col gap-2 text-sm">
              <li v-for="service in services" :key="service" class="flex items-center justify-between">
                <span class="text-muted">{{ service }}</span>
                <span class="flex items-center gap-1.5 text-xs font-bold text-success">
                  <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                  يعمل
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <NewTicketDialog :initial-subject="ticketSubject" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupportStore, TICKET_CATEGORIES } from '~/stores/support'
import { formatRelativeTime } from '~/composables/useRelativeTime'
import HelpCenter from '~/components/dashboard/support/HelpCenter.vue'
import TicketStatusBadge from '~/components/dashboard/support/TicketStatusBadge.vue'
import NewTicketDialog from '~/components/dashboard/support/NewTicketDialog.vue'

const store = useSupportStore()

const tabs = [
  { id: 'help', label: 'مركز المساعدة' },
  { id: 'tickets', label: 'تذاكري' }
] as const
const tab = ref<typeof tabs[number]['id']>('help')

// TODO: Replace with the platform's real support contacts
const SUPPORT_CHANNELS = [
  { label: 'واتساب', detail: 'أسرع رد، عادةً خلال 15 دقيقة', href: 'https://wa.me/', icon: 'ph:whatsapp-logo-bold', iconClass: 'bg-success/10 text-success', external: true },
  { label: 'البريد الإلكتروني', detail: 'support@edix.app · خلال 24 ساعة', href: 'mailto:support@edix.app', icon: 'ph:envelope-simple-bold', iconClass: 'bg-primary/10 text-primary', external: false }
]

const services = ['لوحة التحكم', 'واجهة المتجر', 'الدفع الإلكتروني', 'إشعارات البريد']

const ticketSubject = ref('')
const openNewTicket = (subject = '') => {
  ticketSubject.value = subject
  store.isNewTicketOpen = true
}

useHead({
  title: 'الدعم | لوحة التحكم'
})
</script>
