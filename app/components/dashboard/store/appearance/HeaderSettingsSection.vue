<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-1">الهيدر (شريط التنقل)</h2>
    <p class="text-xs text-muted mb-5">يظهر أعلى كل صفحات المتجر. على الموبايل يتحول لصف واحد بقائمة جانبية.</p>

    <div class="text-sm font-bold text-primary-navy dark:text-white mb-2">الشكل</div>
    <div class="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="شكل الهيدر">
      <button
        v-for="o in HEADER_STYLES"
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
        <DashboardStoreAppearanceLayoutThumb kind="header" :variant="o.value" :tone="background" :brand="brand" />
        <div class="mt-2 text-sm font-bold" :class="style === o.value ? 'text-primary' : 'text-primary-navy dark:text-white'">{{ o.label }}</div>
        <div class="text-[11px] text-muted leading-snug">{{ o.hint }}</div>
      </button>
    </div>

    <DashboardStoreAppearanceToneSelector v-model="background" label="لون الخلفية" :brand="brand" class="mb-6" />

    <div class="border-t border-border-light dark:border-border-dark pt-4 space-y-2">
      <DashboardStoreAppearanceSettingToggle v-model="sticky" label="تثبيت الهيدر أثناء التمرير" hint="يبقى ظاهراً أعلى الشاشة أثناء التصفح" />
      <DashboardStoreAppearanceSettingToggle v-model="showSearch" label="البحث" />
      <DashboardStoreAppearanceSettingToggle v-model="showWishlist" label="المفضلة" />
      <DashboardStoreAppearanceSettingToggle v-model="showCart" label="السلة" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'
import type { HeaderStyle, StoreAppearance, SurfaceTone } from '~/stores/storeAppearance'

const HEADER_STYLES: { value: HeaderStyle, label: string, hint: string }[] = [
  { value: 'classic', label: 'كلاسيكي', hint: 'اللوجو والروابط والأيقونات في صف واحد' },
  { value: 'centered', label: 'متمركز', hint: 'اللوجو في المنتصف والروابط تحته' },
  { value: 'split', label: 'مقسوم', hint: 'الروابط على جانبي اللوجو' },
  { value: 'search', label: 'بحث بارز', hint: 'شريط بحث كبير وصف للأقسام، للمتاجر الكبيرة' },
  { value: 'floating', label: 'عائم', hint: 'شريط بزوايا وظل، منفصل عن حافة الصفحة' },
  { value: 'minimal', label: 'بسيط', hint: 'لوجو وأيقونات فقط، والروابط داخل القائمة' }
]

const { draftAppearance, updateField } = useStoreAppearance()

const brand = computed(() => draftAppearance.value?.colors.primary ?? '#2563EB')

type Header = StoreAppearance['header']
const field = <K extends keyof Header>(key: K, fallback: Header[K]) => computed({
  get: () => draftAppearance.value?.header[key] ?? fallback,
  set: (val: Header[K]) => updateField('header', key, val)
})

const style = field('style', 'classic' as HeaderStyle)
const background = field('background', 'light' as SurfaceTone)
const sticky = field('sticky', true)
const showSearch = field('showSearch', true)
const showWishlist = field('showWishlist', true)
const showCart = field('showCart', true)
</script>
