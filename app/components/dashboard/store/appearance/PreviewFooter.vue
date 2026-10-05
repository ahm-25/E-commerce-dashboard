<template>
  <footer v-if="a && f" class="mt-12" :style="{ backgroundColor: tone.bg, color: tone.text }">
    <!-- ===== Newsletter first: a full-width signup band above the links ===== -->
    <div
      v-if="style === 'newsletter' && f.showNewsletter"
      class="px-6 py-8"
      :style="{ backgroundColor: f.background === 'brand' ? 'rgba(0,0,0,0.12)' : a.colors.primary, color: '#FFFFFF' }"
    >
      <div class="flex gap-6" :class="mobile ? 'flex-col' : 'items-center justify-between'">
        <div>
          <h4 class="text-xl font-bold mb-1">خصم 10% على أول طلب</h4>
          <p class="text-sm opacity-80">اشترك في النشرة البريدية ليصلك كل جديد وعروضنا الحصرية.</p>
        </div>
        <div class="flex gap-2" :class="mobile ? 'w-full' : 'w-[380px]'">
          <div class="flex-1 px-4 py-2.5 text-sm bg-white/95 text-gray-500" :class="buttonClass">البريد الإلكتروني</div>
          <button type="button" class="px-5 py-2.5 text-sm font-bold bg-gray-900 text-white whitespace-nowrap" :class="buttonClass">اشتراك</button>
        </div>
      </div>
    </div>

    <!-- ===== Columns (default) and newsletter-first share the link columns ===== -->
    <div v-if="style === 'columns' || style === 'newsletter'" class="px-6 py-10">
      <div class="grid gap-8" :class="mobile ? 'grid-cols-1' : 'grid-cols-4'">
        <div>
          <Logo class="mb-4" />
          <p class="text-sm leading-relaxed mb-5" :style="{ color: tone.muted }">نقدم أفضل المنتجات بأعلى جودة لتناسب ذوقك الرفيع.</p>
          <Social v-if="f.showSocialLinks" />
        </div>
        <LinkColumn title="روابط هامة" :links="LINKS" />
        <div v-if="f.showContactInfo">
          <h4 class="font-bold mb-4">تواصل معنا</h4>
          <Contact />
        </div>
        <div v-if="style === 'columns' && f.showNewsletter">
          <h4 class="font-bold mb-4">النشرة البريدية</h4>
          <p class="text-sm mb-4" :style="{ color: tone.muted }">اشترك ليصلك كل جديد وعروضنا الحصرية.</p>
          <div class="flex gap-2">
            <div class="flex-1 min-w-0 px-3 py-2 text-sm truncate" :class="buttonClass" :style="{ backgroundColor: tone.soft, color: tone.muted }">البريد الإلكتروني</div>
            <button type="button" class="px-4 py-2 text-sm font-bold text-white whitespace-nowrap" :class="buttonClass" :style="{ backgroundColor: accentButton }">اشتراك</button>
          </div>
        </div>
        <LinkColumn v-else title="خدمة العملاء" :links="['تتبع طلبك', 'الأسئلة الشائعة', 'الشحن والتوصيل', 'دليل المقاسات']" />
      </div>
    </div>

    <!-- ===== Centered: everything stacked in the middle ===== -->
    <div v-else-if="style === 'centered'" class="px-6 py-12 flex flex-col items-center text-center gap-5">
      <Logo size="lg" />
      <p class="text-sm max-w-md leading-relaxed" :style="{ color: tone.muted }">نقدم أفضل المنتجات بأعلى جودة لتناسب ذوقك الرفيع.</p>
      <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
        <a v-for="l in LINKS" :key="l" href="#" class="hover:opacity-70" @click.prevent>{{ l }}</a>
      </nav>
      <Social v-if="f.showSocialLinks" />
      <div v-if="f.showContactInfo" class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm" :style="{ color: tone.muted }">
        <span dir="ltr">+20 123 456 7890</span>
        <span>support@store.com</span>
      </div>
      <div v-if="f.showNewsletter" class="flex gap-2 w-full max-w-sm">
        <div class="flex-1 px-3 py-2 text-sm text-right" :class="buttonClass" :style="{ backgroundColor: tone.soft, color: tone.muted }">البريد الإلكتروني</div>
        <button type="button" class="px-4 py-2 text-sm font-bold text-white" :class="buttonClass" :style="{ backgroundColor: accentButton }">اشتراك</button>
      </div>
    </div>

    <!-- ===== Compact: one slim row ===== -->
    <div v-else class="px-6 py-6 flex gap-5" :class="mobile ? 'flex-col items-center text-center' : 'items-center justify-between'">
      <Logo />
      <nav class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        <a v-for="l in LINKS" :key="l" href="#" class="hover:opacity-70" :style="{ color: tone.muted }" @click.prevent>{{ l }}</a>
      </nav>
      <Social v-if="f.showSocialLinks" small />
    </div>

    <!-- Bottom bar -->
    <div
      class="px-6 py-4 flex gap-3 text-xs"
      :class="[mobile || style === 'centered' ? 'flex-col items-center' : 'items-center justify-between']"
      :style="{ borderTop: `1px solid ${tone.border}`, color: tone.muted }"
    >
      <p>© 2026 متجري. جميع الحقوق محفوظة</p>
      <div v-if="f.showPaymentMethods" class="flex items-center gap-1.5">
        <span v-for="p in PAYMENTS" :key="p" class="h-6 px-2 rounded bg-white text-[10px] font-bold text-gray-800 flex items-center border border-gray-200">{{ p }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from 'vue'
import { Icon } from '#components'
import { useStoreAppearance } from '~/composables/useStoreAppearance'
import { toneColors } from '~/utils/appearanceTone'

defineProps<{ mobile?: boolean }>()

const { draftAppearance: a } = useStoreAppearance()

const LINKS = ['من نحن', 'سياسة الخصوصية', 'الشروط والأحكام', 'سياسة الاسترجاع']
// Common in Egypt: cards, wallets, cash on delivery
const PAYMENTS = ['VISA', 'Mastercard', 'فودافون كاش', 'InstaPay', 'كاش']

const f = computed(() => a.value?.footer)
const style = computed(() => f.value?.style ?? 'columns')
const tone = computed(() => toneColors(f.value?.background ?? 'dark', a.value?.colors.primary ?? '#2563EB', a.value?.colors.text ?? '#111827'))
// A brand-colored button disappears on a brand-colored footer
const accentButton = computed(() => f.value?.background === 'brand' ? '#111827' : a.value?.colors.primary)
const buttonClass = computed(() => ({ square: 'rounded-none', rounded: 'rounded-md', soft: 'rounded-xl', pill: 'rounded-full' } as const)[a.value?.shape.buttonStyle ?? 'rounded'])

const Logo: FunctionalComponent<{ size?: 'md' | 'lg' }> = ({ size = 'md' }) => {
  const app = a.value!
  if (app.logo) {
    // Light logos are inverted to white on dark backgrounds
    return h('img', { src: app.logo, alt: 'الشعار', class: [size === 'lg' ? 'h-10' : 'h-8', 'object-contain', f.value?.background !== 'light' && 'brightness-0 invert'] })
  }
  return h('div', { class: ['font-bold', size === 'lg' ? 'text-3xl' : 'text-2xl'], style: { color: f.value?.background === 'light' ? app.colors.primary : tone.value.text } }, 'متجري')
}

const Social: FunctionalComponent<{ small?: boolean }> = ({ small }) =>
  h('div', { class: 'flex gap-2' }, ['lucide:facebook', 'lucide:instagram', 'ph:tiktok-logo', 'ph:whatsapp-logo'].map(icon =>
    h('span', {
      class: [small ? 'w-8 h-8' : 'w-9 h-9', 'rounded-full flex items-center justify-center'],
      style: { backgroundColor: tone.value.soft, color: tone.value.text }
    }, [h(Icon, { name: icon, class: small ? 'w-3.5 h-3.5' : 'w-4 h-4' })])
  ))

const LinkColumn: FunctionalComponent<{ title: string, links: string[] }> = ({ title, links }) =>
  h('div', [
    h('h4', { class: 'font-bold mb-4' }, title),
    h('ul', { class: 'space-y-2 text-sm' }, links.map(l => h('li', { style: { color: tone.value.muted } }, l)))
  ])

const Contact: FunctionalComponent = () =>
  h('ul', { class: 'space-y-3 text-sm', style: { color: tone.value.muted } }, [
    ['lucide:map-pin', 'القاهرة، مصر'],
    ['lucide:phone', '+20 123 456 7890'],
    ['lucide:mail', 'support@store.com']
  ].map(([icon, text]) => h('li', { class: 'flex items-center gap-2' }, [h(Icon, { name: icon!, class: 'w-4 h-4 shrink-0' }), h('span', { dir: icon === 'lucide:phone' ? 'ltr' : undefined }, text)])))
</script>
