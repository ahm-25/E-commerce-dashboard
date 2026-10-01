<template>
  <div class="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center p-4" dir="rtl">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <span class="font-black text-4xl text-primary-navy dark:text-white tracking-wider font-ibm">EDIX</span>
        <p class="text-muted text-sm mt-2">سجّل الدخول للوحة تحكم متجرك</p>
      </div>

      <form
        class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-5"
        @submit.prevent="submit"
      >
        <div>
          <label for="email" class="block text-sm font-bold text-primary-navy dark:text-white mb-2">البريد الإلكتروني</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            dir="ltr"
            required
            :class="inputClass"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-bold text-primary-navy dark:text-white mb-2">كلمة المرور</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              dir="ltr"
              required
              :class="[inputClass, 'pl-10']"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary-navy dark:hover:text-white"
              :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
            >
              <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer text-primary-navy dark:text-white font-medium">
            <input v-model="remember" type="checkbox" class="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
            تذكرني
          </label>
          <span class="text-muted text-xs" title="إعادة تعيين كلمة المرور تحتاج ربط خدمة البريد">نسيت كلمة المرور؟ تواصل مع مالك المتجر</span>
        </div>

        <p v-if="error" role="alert" class="text-sm font-bold text-danger bg-danger/10 rounded-lg p-3">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Icon v-if="loading" name="ph:spinner-gap" class="w-4 h-4 animate-spin" />
          {{ loading ? 'جاري الدخول...' : 'تسجيل الدخول' }}
        </button>
      </form>

      <!-- TODO: Remove the demo accounts once login uses the real API -->
      <div class="mt-6 bg-surface dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark rounded-xl p-4">
        <p class="text-xs font-bold text-muted mb-3">
          حسابات تجريبية · كلمة المرور: <span dir="ltr" class="font-mono text-primary-navy dark:text-white">{{ DEMO_PASSWORD }}</span>
        </p>
        <div class="flex flex-col gap-1.5">
          <button
            v-for="account in demoAccounts"
            :key="account.email"
            type="button"
            @click="fillDemo(account.email)"
            class="flex items-center justify-between gap-3 text-right text-sm px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span class="font-bold text-primary-navy dark:text-white">{{ account.role }}</span>
            <span class="text-xs text-muted" dir="ltr">{{ account.email }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore, DEMO_PASSWORD } from '~/stores/auth'
import { useSystemStore } from '~/stores/system'

const auth = useAuthStore()
const system = useSystemStore()
const route = useRoute()

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

system.seed()
const demoAccounts = computed(() =>
  system.team
    .filter(m => m.status !== 'invited')
    .map(m => ({ email: m.email, role: `${system.roleById(m.roleId)?.name}${m.status === 'suspended' ? ' (موقوف)' : ''}` }))
)

const fillDemo = (demoEmail: string) => {
  email.value = demoEmail
  password.value = DEMO_PASSWORD
  error.value = ''
}

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value, remember.value)
    const redirect = route.query.redirect as string | undefined
    await navigateTo(redirect?.startsWith('/dashboard') ? redirect : '/dashboard', { replace: true })
  } catch (err: any) {
    error.value = err.message || 'تعذر تسجيل الدخول'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'تسجيل الدخول | EDIX'
})

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors'
</script>
