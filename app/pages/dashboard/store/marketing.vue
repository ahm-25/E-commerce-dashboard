<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">التسويق والتتبع</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">التسويق والتتبع</h1>
        <p class="text-sm text-muted mt-1">زر واتساب في المتجر، وربط بيكسلات الإعلانات وGoogle Analytics لقياس المبيعات من حملاتك.</p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex flex-col gap-6 animate-pulse">
        <div class="h-72 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div class="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <h2 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تعذر تحميل الإعدادات</h2>
        <p class="text-muted mb-6">{{ store.error }}</p>
        <button @click="load" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>

      <fieldset v-else-if="form" :disabled="!canManage" class="flex flex-col gap-6 min-w-0">
        <ReadOnlyNotice v-if="!canManage" />

        <!-- WhatsApp -->
        <SettingsCard id="whatsapp" title="واتساب" description="معظم عملاء المتاجر في مصر يسألون عبر واتساب قبل الشراء" icon="ph:whatsapp-logo-bold">
          <div class="flex flex-col gap-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-bold text-primary-navy dark:text-white">زر واتساب العائم</div>
                <p class="text-xs text-muted mt-1">يظهر في ركن كل صفحات المتجر ويفتح محادثة مع رقمك.</p>
              </div>
              <ToggleSwitch v-model="form.whatsapp.enabled" label="زر واتساب العائم" :disabled="!canManage" />
            </div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-bold text-primary-navy dark:text-white">زر "اطلب عبر واتساب" في صفحة المنتج</div>
                <p class="text-xs text-muted mt-1">يرسل لك اسم المنتج واللون والمقاس والسعر ورابطه في الرسالة.</p>
              </div>
              <ToggleSwitch v-model="form.whatsapp.productButton" label="زر اطلب عبر واتساب" :disabled="!canManage" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="wa-phone" class="block text-sm font-bold text-primary-navy dark:text-white mb-2">
                  رقم الواتساب <span v-if="whatsappOn" class="text-danger">*</span>
                </label>
                <input id="wa-phone" v-model="form.whatsapp.phone" type="tel" dir="ltr" placeholder="01012345678" :class="[inputClass, phoneError && 'border-danger']" />
                <p class="text-xs mt-1" :class="phoneError ? 'text-danger' : 'text-muted'">{{ phoneError || 'رقم موبايل مصري عليه واتساب' }}</p>
              </div>
              <div>
                <label for="wa-message" class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الرسالة الافتراضية</label>
                <input id="wa-message" v-model="form.whatsapp.message" type="text" maxlength="300" :class="inputClass" />
                <p class="text-xs text-muted mt-1">تظهر مكتوبة للعميل عند فتح المحادثة من الزر العائم.</p>
              </div>
            </div>

            <a
              v-if="waTestLink"
              :href="waTestLink"
              target="_blank"
              rel="noopener"
              class="self-start inline-flex items-center gap-2 text-sm font-bold text-success hover:underline"
            >
              <Icon name="ph:arrow-square-out" class="w-4 h-4" />
              جرّب الرابط
            </a>
          </div>
        </SettingsCard>

        <!-- Pixels -->
        <SettingsCard id="tracking" title="بيكسلات الإعلانات والتحليلات" description="اترك الحقل فارغاً لإيقاف المنصة. يتم تحميلها في المتجر تلقائياً بعد الحفظ." icon="ph:chart-bar-bold">
          <div class="flex flex-col gap-5">
            <div v-for="p in pixels" :key="p.key" class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-4 md:items-start">
              <label :for="`px-${p.key}`" class="flex items-center gap-2 text-sm font-bold text-primary-navy dark:text-white md:pt-2.5">
                <Icon :name="p.icon" class="w-5 h-5" :class="p.color" />
                {{ p.label }}
                <span v-if="form.tracking[p.key]" class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">مفعّل</span>
              </label>
              <div>
                <input
                  :id="`px-${p.key}`"
                  v-model="form.tracking[p.key]"
                  type="text"
                  dir="ltr"
                  :placeholder="p.placeholder"
                  spellcheck="false"
                  autocomplete="off"
                  :class="[inputClass, 'font-mono', pixelErrors[p.key] && 'border-danger']"
                />
                <p class="text-xs mt-1" :class="pixelErrors[p.key] ? 'text-danger' : 'text-muted'">
                  {{ pixelErrors[p.key] || p.hint }}
                </p>
              </div>
            </div>

            <!-- What gets sent -->
            <div class="rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-primary-navy dark:text-white">الأحداث التي يرسلها المتجر</div>
              <table class="w-full text-xs">
                <tbody>
                  <tr v-for="e in events" :key="e.label" class="border-t border-border-light dark:border-border-dark">
                    <td class="px-4 py-2 font-semibold text-primary-navy dark:text-white whitespace-nowrap">{{ e.label }}</td>
                    <td class="px-4 py-2 text-muted">{{ e.when }}</td>
                    <td class="px-4 py-2 text-muted font-mono hidden md:table-cell" dir="ltr">{{ e.names }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SettingsCard>
      </fieldset>

      <!-- Save Bar -->
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
              :disabled="store.saving || hasErrors"
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
import { ref, computed, onMounted, toRaw } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useCanManage } from '~/composables/useCanManage'
import { useMarketingStore, type MarketingSettings } from '~/stores/marketing'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'
import ReadOnlyNotice from '~/components/dashboard/ReadOnlyNotice.vue'

type PixelKey = keyof MarketingSettings['tracking']

const store = useMarketingStore()
const canManage = useCanManage('storeSettings')

const form = ref<MarketingSettings | null>(null)
const justSaved = ref(false)

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'

// Same rules as server/utils/marketing.ts, checked while typing
const pixels: { key: PixelKey, label: string, icon: string, color: string, placeholder: string, hint: string, re: RegExp, error: string }[] = [
  { key: 'metaPixelId', label: 'Meta Pixel', icon: 'ph:meta-logo-bold', color: 'text-blue-600', placeholder: '123456789012345', hint: 'Events Manager ← مصادر البيانات ← رقم الـ Pixel', re: /^\d{15,16}$/, error: 'المعرّف يتكون من 15 أو 16 رقماً' },
  { key: 'tiktokPixelId', label: 'TikTok Pixel', icon: 'ph:tiktok-logo-bold', color: 'text-primary-navy dark:text-white', placeholder: 'C1ABCD2EFGH3IJKL4MN0', hint: 'TikTok Ads Manager ← Assets ← Events', re: /^[A-Z0-9]{20}$/i, error: 'المعرّف يتكون من 20 حرفاً ورقماً' },
  { key: 'snapPixelId', label: 'Snap Pixel', icon: 'ph:snapchat-logo-bold', color: 'text-yellow-400', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hint: 'Snapchat Ads Manager ← Events Manager', re: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, error: 'المعرّف بصيغة UUID' },
  { key: 'ga4MeasurementId', label: 'Google Analytics 4', icon: 'ph:google-logo-bold', color: 'text-orange-500', placeholder: 'G-ABC123XYZ', hint: 'Admin ← Data streams ← Measurement ID', re: /^G-[A-Z0-9]{4,12}$/i, error: 'المعرّف يبدأ بـ G-' }
]

const events = [
  { label: 'مشاهدة صفحة', when: 'كل صفحة يفتحها العميل', names: 'PageView · page_view' },
  { label: 'مشاهدة منتج', when: 'فتح صفحة منتج', names: 'ViewContent · view_item' },
  { label: 'إضافة للسلة', when: 'إضافة منتج للسلة', names: 'AddToCart · add_to_cart' },
  { label: 'بدء الدفع', when: 'فتح صفحة إتمام الشراء', names: 'InitiateCheckout · begin_checkout' },
  { label: 'شراء', when: 'تأكيد الطلب (مرة واحدة لكل طلب)', names: 'Purchase · purchase' }
]

const whatsappOn = computed(() => !!form.value && (form.value.whatsapp.enabled || form.value.whatsapp.productButton))
const localPhone = computed(() => (form.value?.whatsapp.phone ?? '').replace(/\D/g, '').replace(/^(0020|20)/, '').replace(/^0/, ''))
const phoneError = computed(() => {
  if (!whatsappOn.value) return null
  return /^1[0125]\d{8}$/.test(localPhone.value) ? null : 'أدخل رقم موبايل مصري صحيح'
})
const waTestLink = computed(() => !phoneError.value && localPhone.value
  ? `https://wa.me/20${localPhone.value}?text=${encodeURIComponent(form.value?.whatsapp.message ?? '')}`
  : null)

const pixelErrors = computed(() => {
  const errors: Partial<Record<PixelKey, string>> = {}
  for (const p of pixels) {
    const value = form.value?.tracking[p.key]?.trim()
    if (value && !p.re.test(value)) errors[p.key] = p.error
  }
  return errors
})

const hasErrors = computed(() => !!phoneError.value || Object.keys(pixelErrors.value).length > 0)

const isDirty = computed(() =>
  !!form.value && !!store.settings && JSON.stringify(form.value) !== JSON.stringify(store.settings)
)

const resetForm = () => {
  form.value = store.settings ? structuredClone(toRaw(store.settings)) : null
}

const save = async () => {
  if (!form.value || hasErrors.value) return
  try {
    await store.updateSettings(form.value)
    resetForm()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 2500)
  } catch (err: any) {
    alert(err.message)
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

useHead({ title: 'التسويق والتتبع | لوحة التحكم' })

onMounted(() => {
  if (store.settings) resetForm()
  else load()
})
</script>
