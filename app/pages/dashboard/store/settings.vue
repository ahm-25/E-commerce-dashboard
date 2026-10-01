<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">إعدادات المتجر</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">إعدادات المتجر</h1>
        <p class="text-sm text-muted mt-1">البيانات الأساسية والعملة والضرائب وقواعد الطلبات.</p>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
        <div class="hidden lg:block h-56 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div class="lg:col-span-3 flex flex-col gap-6">
          <div class="h-80 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <h2 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تعذر تحميل الإعدادات</h2>
        <p class="text-muted mb-6">{{ store.error }}</p>
        <button @click="load" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>

      <div v-else-if="form" class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <!-- Section Nav -->
        <nav class="hidden lg:flex flex-col gap-1 sticky top-0 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-2">
          <a
            v-for="section in sections"
            :key="section.id"
            :href="`#${section.id}`"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-navy dark:hover:text-white transition-colors"
          >
            <Icon :name="section.icon" class="w-4 h-4" />
            {{ section.label }}
          </a>
        </nav>

        <!-- A disabled fieldset disables every control inside it -->
        <fieldset :disabled="!canManage" class="lg:col-span-3 flex flex-col gap-6 min-w-0">
          <ReadOnlyNotice v-if="!canManage" />
          <StoreInfoSection v-model="form" />
          <LocaleSection v-model="form" :initial-currency="store.settings?.currency" />
          <TaxSection v-model="form" />
          <CheckoutSection v-model="form" />
          <StoreStatusSection v-model="form" />
        </fieldset>
      </div>

      <!-- Save Bar (sticky inside the scrolling main area, so it follows the sidebar width) -->
      <Transition
        enter-from-class="translate-y-full opacity-0"
        leave-to-class="translate-y-full opacity-0"
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-200"
      >
        <div
          v-if="isDirty || justSaved"
          class="sticky bottom-0 z-30 -mx-4 md:-mx-6 lg:-mx-8 -mb-4 md:-mb-6 lg:-mb-8 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 md:px-8 py-3 flex items-center justify-between gap-4"
        >
          <span v-if="justSaved && !isDirty" class="text-sm font-bold text-success flex items-center gap-2">
            <Icon name="ph:check-circle-bold" class="w-5 h-5" />
            تم حفظ التغييرات
          </span>
          <span v-else class="text-sm font-bold text-primary-navy dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-warning"></span>
            لديك تغييرات غير محفوظة
          </span>
          <div v-if="isDirty" class="flex items-center gap-3">
            <button
              @click="resetForm"
              :disabled="store.saving"
              class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              تجاهل
            </button>
            <button
              @click="save"
              :disabled="store.saving"
              class="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[110px]"
            >
              {{ store.saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref, computed, onMounted, toRaw } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useStoreSettingsStore, type StoreSettings } from '~/stores/storeSettings'
import StoreInfoSection from '~/components/dashboard/store/settings/StoreInfoSection.vue'
import LocaleSection from '~/components/dashboard/store/settings/LocaleSection.vue'
import TaxSection from '~/components/dashboard/store/settings/TaxSection.vue'
import CheckoutSection from '~/components/dashboard/store/settings/CheckoutSection.vue'
import StoreStatusSection from '~/components/dashboard/store/settings/StoreStatusSection.vue'
import ReadOnlyNotice from '~/components/dashboard/ReadOnlyNotice.vue'

const store = useStoreSettingsStore()

const form = ref<StoreSettings | null>(null)
const justSaved = ref(false)

const sections = [
  { id: 'info', label: 'معلومات المتجر', icon: 'ph:storefront' },
  { id: 'locale', label: 'العملة والمنطقة', icon: 'ph:globe-hemisphere-east' },
  { id: 'tax', label: 'الضرائب', icon: 'ph:receipt' },
  { id: 'checkout', label: 'الطلبات', icon: 'ph:shopping-cart' },
  { id: 'status', label: 'حالة المتجر', icon: 'ph:power' }
]

const isDirty = computed(() =>
  !!form.value && !!store.settings && JSON.stringify(form.value) !== JSON.stringify(store.settings)
)

const resetForm = () => {
  form.value = store.settings ? structuredClone(toRaw(store.settings)) : null
}

// Empty number inputs come back as '' from v-model.number
const emptyToNull = (value: number | null | string) => (value === '' ? null : value as number | null)

const validate = (s: StoreSettings) => {
  if (!s.name.trim()) return 'يرجى إدخال اسم المتجر'
  if (!/^\S+@\S+\.\S+$/.test(s.email)) return 'يرجى إدخال بريد إلكتروني صحيح'
  if (s.taxEnabled && (s.taxRate < 0 || s.taxRate > 100)) return 'نسبة الضريبة يجب أن تكون بين 0 و 100'
  return null
}

const save = async () => {
  if (!form.value) return
  const settings: StoreSettings = {
    ...form.value,
    minOrderValue: emptyToNull(form.value.minOrderValue),
    autoCancelUnpaidHours: emptyToNull(form.value.autoCancelUnpaidHours)
  }

  const error = validate(settings)
  if (error) {
    alert(error)
    return
  }

  try {
    await store.updateSettings(settings)
    resetForm()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 2500)
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ الإعدادات')
  }
}

const load = async () => {
  await store.fetchSettings()
  resetForm()
}

onBeforeRouteLeave(() => {
  if (isDirty.value && !confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة بدون حفظ؟')) {
    return false
  }
})

useHead({
  title: 'إعدادات المتجر | لوحة التحكم'
})

onMounted(() => {
  if (store.settings) resetForm()
  else load()
})

const canManage = useCanManage('storeSettings')
</script>
