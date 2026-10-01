<template>
  <div class="flex flex-col gap-6 max-w-3xl">
    <!-- Two-factor -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            :class="store.twoFactorEnabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
          >
            <Icon :name="store.twoFactorEnabled ? 'ph:shield-check-bold' : 'ph:shield-warning-bold'" class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-bold text-primary-navy dark:text-white font-ibm">التحقق بخطوتين</h2>
            <p class="text-sm text-muted mt-1">
              {{ store.twoFactorEnabled
                ? 'مفعّل: هيتطلب منك كود من تطبيق المصادقة عند تسجيل الدخول.'
                : 'غير مفعّل. ننصح بتفعيله لأن الحساب ده عنده صلاحيات كاملة على المتجر.' }}
            </p>
          </div>
        </div>
        <button
          @click="toggleTwoFactor"
          :disabled="togglingTwoFactor"
          class="shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          :class="store.twoFactorEnabled
            ? 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-danger hover:bg-danger/10'
            : 'bg-primary hover:bg-primary/90 text-white shadow-sm'"
        >
          {{ togglingTwoFactor ? '...' : store.twoFactorEnabled ? 'إيقاف' : 'تفعيل' }}
        </button>
      </div>
    </section>

    <!-- Sessions -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between gap-4">
        <div>
          <h2 class="font-bold text-primary-navy dark:text-white font-ibm">الأجهزة المسجّل دخولها</h2>
          <p class="text-xs text-muted mt-0.5">لو شايف جهاز مش بتاعك، اخرج منه وغيّر كلمة المرور</p>
        </div>
        <button
          v-if="otherSessions > 0"
          @click="revokeOthers"
          :disabled="revokingAll"
          class="text-sm font-bold text-danger hover:bg-danger/10 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {{ revokingAll ? 'جاري الخروج...' : 'الخروج من كل الأجهزة الأخرى' }}
        </button>
      </div>
      <div class="divide-y divide-border-light dark:divide-border-dark">
        <div v-for="session in store.sessions" :key="session.id" class="px-6 py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-muted flex items-center justify-center shrink-0">
              <Icon :name="deviceIcon(session.device)" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <div class="font-bold text-primary-navy dark:text-white text-sm flex items-center gap-2">
                <span dir="ltr">{{ session.browser }} · {{ session.device }}</span>
                <span v-if="session.isCurrent" class="px-2 py-0.5 rounded bg-success/10 text-success text-[11px] font-bold">هذا الجهاز</span>
              </div>
              <div class="text-xs text-muted mt-0.5">
                {{ session.location }} · <span dir="ltr">{{ session.ip }}</span> · {{ formatRelativeTime(session.lastActiveAt) }}
              </div>
            </div>
          </div>
          <button
            v-if="!session.isCurrent"
            @click="store.revokeSession(session.id)"
            class="text-sm font-bold text-muted hover:text-danger px-3 py-1.5 rounded-lg hover:bg-danger/10 transition-colors shrink-0"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSystemStore } from '~/stores/system'
import { formatRelativeTime } from '~/composables/useRelativeTime'

const store = useSystemStore()

const togglingTwoFactor = ref(false)
const revokingAll = ref(false)

const otherSessions = computed(() => store.sessions.filter(s => !s.isCurrent).length)

const deviceIcon = (device: string) => {
  if (/iphone|android/i.test(device)) return 'ph:device-mobile'
  return 'ph:desktop'
}

const toggleTwoFactor = async () => {
  if (store.twoFactorEnabled && !confirm('إيقاف التحقق بخطوتين يقلل حماية حسابك. متأكد؟')) return
  // TODO: Enabling needs a QR-code setup step with an authenticator app
  togglingTwoFactor.value = true
  try {
    await store.setTwoFactor(!store.twoFactorEnabled)
  } finally {
    togglingTwoFactor.value = false
  }
}

const revokeOthers = async () => {
  if (!confirm('تسجيل الخروج من كل الأجهزة ما عدا هذا الجهاز؟')) return
  revokingAll.value = true
  try {
    await store.revokeOtherSessions()
  } finally {
    revokingAll.value = false
  }
}
</script>
