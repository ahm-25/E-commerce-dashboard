<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-1">الفوتر</h2>
    <p class="text-xs text-muted mb-5">أسفل كل صفحات المتجر: روابط السياسات، التواصل، وطرق الدفع.</p>

    <div class="text-sm font-bold text-primary-navy dark:text-white mb-2">الشكل</div>
    <div class="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="شكل الفوتر">
      <button
        v-for="o in FOOTER_STYLES"
        :key="o.value"
        type="button"
        role="radio"
        :aria-checked="style === o.value"
        @click="style = o.value"
        class="text-right p-2.5 rounded-xl border transition-colors"
        :class="style === o.value
          ? 'border-primary ring-1 ring-primary bg-primary-light dark:bg-primary/10'
          : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-500'"
      >
        <DashboardStoreAppearanceLayoutThumb kind="footer" :variant="o.value" :tone="background" :brand="brand" />
        <div class="mt-2 text-sm font-bold" :class="style === o.value ? 'text-primary' : 'text-primary-navy dark:text-white'">{{ o.label }}</div>
        <div class="text-[11px] text-muted leading-snug">{{ o.hint }}</div>
      </button>
    </div>

    <DashboardStoreAppearanceToneSelector v-model="background" label="لون الخلفية" :brand="brand" class="mb-6" />

    <div class="border-t border-border-light dark:border-border-dark pt-4 space-y-2">
      <DashboardStoreAppearanceSettingToggle v-model="showNewsletter" label="الاشتراك في النشرة البريدية" />
      <DashboardStoreAppearanceSettingToggle v-model="showSocialLinks" label="روابط التواصل الاجتماعي" />
      <DashboardStoreAppearanceSettingToggle v-model="showContactInfo" label="معلومات التواصل" hint="العنوان والهاتف والبريد" />
      <DashboardStoreAppearanceSettingToggle v-model="showPaymentMethods" label="شعارات طرق الدفع" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'
import type { FooterStyle, StoreAppearance, SurfaceTone } from '~/stores/storeAppearance'

const FOOTER_STYLES: { value: FooterStyle, label: string, hint: string }[] = [
  { value: 'columns', label: 'أعمدة', hint: 'أربعة أعمدة: عن المتجر، روابط، تواصل، نشرة' },
  { value: 'newsletter', label: 'اشتراك بارز', hint: 'شريط اشتراك كبير بعرض الصفحة فوق الروابط' },
  { value: 'centered', label: 'متمركز', hint: 'كل العناصر في المنتصف، شكل هادئ' },
  { value: 'compact', label: 'مختصر', hint: 'صف واحد رفيع: اللوجو والروابط والسوشيال' }
]

const { draftAppearance, updateField } = useStoreAppearance()

const brand = computed(() => draftAppearance.value?.colors.primary ?? '#2563EB')

type Footer = NonNullable<StoreAppearance['footer']>
const field = <K extends keyof Footer>(key: K, fallback: NonNullable<Footer[K]>) => computed({
  get: () => (draftAppearance.value?.footer?.[key] ?? fallback) as NonNullable<Footer[K]>,
  set: (val: NonNullable<Footer[K]>) => updateField('footer', key, val)
})

const style = field('style', 'columns' as FooterStyle)
const background = field('background', 'dark' as SurfaceTone)
const showNewsletter = field('showNewsletter', true)
const showSocialLinks = field('showSocialLinks', true)
const showContactInfo = field('showContactInfo', true)
const showPaymentMethods = field('showPaymentMethods', true)
</script>
