<template>
  <div class="flex flex-col gap-6 max-w-3xl">
    <!-- Profile -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm mb-5">الملف الشخصي</h2>

      <div class="flex items-center gap-4 mb-6">
        <div class="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0">
          <img v-if="profile.avatar" :src="profile.avatar" alt="" class="w-full h-full object-cover" />
          <template v-else>{{ profile.name.charAt(0) }}</template>
        </div>
        <div class="flex gap-2">
          <label class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors">
            <Icon name="ph:upload-simple-bold" class="w-4 h-4" />
            تغيير الصورة
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </label>
          <button v-if="profile.avatar" type="button" @click="profile.avatar = ''" class="px-4 py-2 rounded-lg font-bold text-sm text-danger hover:bg-danger/10 transition-colors">
            إزالة
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">الاسم <span class="text-danger">*</span></label>
          <input v-model="profile.name" type="text" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">المسمى الوظيفي</label>
          <input v-model="profile.jobTitle" type="text" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">البريد الإلكتروني <span class="text-danger">*</span></label>
          <input v-model="profile.email" type="email" dir="ltr" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">رقم الهاتف</label>
          <input v-model="profile.phone" type="tel" dir="ltr" :class="inputClass" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
        <span v-if="profileSaved" class="text-sm font-bold text-success flex items-center gap-1.5">
          <Icon name="ph:check-circle-bold" class="w-5 h-5" />
          تم الحفظ
        </span>
        <button v-if="profileDirty" @click="resetProfile" :disabled="savingProfile" :class="secondaryBtn">تجاهل</button>
        <button @click="saveProfile" :disabled="savingProfile || !profileDirty" :class="primaryBtn">
          {{ savingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>
    </section>

    <!-- Password -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm mb-1">كلمة المرور</h2>
      <p class="text-xs text-muted mb-5">8 أحرف على الأقل، وتحتوي على حرف ورقم</p>

      <form class="grid grid-cols-1 md:grid-cols-3 gap-4" @submit.prevent="savePassword">
        <div>
          <label :class="labelClass">كلمة المرور الحالية</label>
          <input v-model="password.current" type="password" autocomplete="current-password" dir="ltr" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">كلمة المرور الجديدة</label>
          <input v-model="password.next" type="password" autocomplete="new-password" dir="ltr" :class="inputClass" />
          <div v-if="password.next" class="flex gap-1 mt-2">
            <span v-for="i in 3" :key="i" class="h-1 flex-1 rounded" :class="i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'"></span>
          </div>
          <p v-if="password.next" class="text-xs mt-1 font-bold" :class="strength.text">{{ strength.label }}</p>
        </div>
        <div>
          <label :class="labelClass">تأكيد كلمة المرور</label>
          <input v-model="password.confirm" type="password" autocomplete="new-password" dir="ltr" :class="inputClass" />
          <p v-if="password.confirm && password.confirm !== password.next" class="text-xs text-danger font-bold mt-1">غير متطابقة</p>
        </div>

        <div class="md:col-span-3 flex items-center justify-end gap-3">
          <span v-if="passwordError" class="text-sm font-bold text-danger">{{ passwordError }}</span>
          <span v-if="passwordSaved" class="text-sm font-bold text-success flex items-center gap-1.5">
            <Icon name="ph:check-circle-bold" class="w-5 h-5" />
            تم تغيير كلمة المرور
          </span>
          <button type="submit" :disabled="savingPassword || !password.current || !password.next" :class="primaryBtn">
            {{ savingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRaw } from 'vue'
import { useSystemStore, type UserProfile } from '~/stores/system'

const store = useSystemStore()

// Profile
const profile = ref<UserProfile>(structuredClone(toRaw(store.profile)))
const savingProfile = ref(false)
const profileSaved = ref(false)

const profileDirty = computed(() => JSON.stringify(profile.value) !== JSON.stringify(store.profile))

const resetProfile = () => {
  profile.value = structuredClone(toRaw(store.profile))
}

const onAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('حجم الصورة يجب ألا يتجاوز 2 ميجابايت')
    return
  }
  // TODO: Upload to storage; a data URL is enough for the mock store
  const reader = new FileReader()
  reader.onload = () => { profile.value.avatar = reader.result as string }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!profile.value.name.trim()) return alert('يرجى إدخال الاسم')
  if (!/^\S+@\S+\.\S+$/.test(profile.value.email)) return alert('يرجى إدخال بريد إلكتروني صحيح')

  savingProfile.value = true
  try {
    await store.updateProfile(profile.value)
    resetProfile()
    profileSaved.value = true
    setTimeout(() => { profileSaved.value = false }, 2500)
  } finally {
    savingProfile.value = false
  }
}

// Password
const password = reactive({ current: '', next: '', confirm: '' })
const savingPassword = ref(false)
const passwordSaved = ref(false)
const passwordError = ref('')

const strength = computed(() => {
  const p = password.next
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Za-z]/.test(p) && /\d/.test(p)) score++
  if (p.length >= 12 || /[^A-Za-z0-9]/.test(p)) score++
  return [
    { score: 0, label: 'ضعيفة جداً', color: 'bg-danger', text: 'text-danger' },
    { score: 1, label: 'ضعيفة', color: 'bg-danger', text: 'text-danger' },
    { score: 2, label: 'متوسطة', color: 'bg-warning', text: 'text-warning' },
    { score: 3, label: 'قوية', color: 'bg-success', text: 'text-success' }
  ][score]
})

const savePassword = async () => {
  passwordError.value = ''
  if (password.next.length < 8 || !/[A-Za-z]/.test(password.next) || !/\d/.test(password.next)) {
    passwordError.value = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم'
    return
  }
  if (password.next !== password.confirm) {
    passwordError.value = 'تأكيد كلمة المرور غير متطابق'
    return
  }
  if (password.next === password.current) {
    passwordError.value = 'كلمة المرور الجديدة مطابقة للحالية'
    return
  }

  savingPassword.value = true
  try {
    await store.changePassword(password.current, password.next)
    Object.assign(password, { current: '', next: '', confirm: '' })
    passwordSaved.value = true
    setTimeout(() => { passwordSaved.value = false }, 3000)
  } catch (err: any) {
    passwordError.value = err.message || 'تعذر تغيير كلمة المرور'
  } finally {
    savingPassword.value = false
  }
}

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
const primaryBtn = 'bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]'
const secondaryBtn = 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50'
</script>
