<template>
  <!-- Floating sits on the page background with a gap; the others span the full width -->
  <header
    v-if="a"
    class="transition-all z-50"
    :class="[a.header.sticky ? 'sticky top-0' : 'relative', isFloating ? 'px-3 pt-3' : '']"
    :style="isFloating ? {} : { backgroundColor: tone.bg, color: tone.text, borderBottom: `1px solid ${tone.border}` }"
  >
    <div
      :class="isFloating ? 'shadow-lg ring-1 ring-black/5 ' + floatingRadius : ''"
      :style="isFloating ? { backgroundColor: tone.bg, color: tone.text } : {}"
    >
      <!-- ===== Phone: one compact row for every style (+ search bar for "search") ===== -->
      <template v-if="mobile">
        <div class="flex items-center justify-between gap-3 px-4 py-3">
          <button type="button" aria-label="القائمة" :style="{ color: tone.text }"><Icon name="lucide:menu" class="w-6 h-6" /></button>
          <Logo :size="'sm'" />
          <div class="flex items-center gap-3">
            <IconButton v-if="a.header.showSearch && a.header.style !== 'search'" icon="lucide:search" />
            <IconButton v-if="a.header.showCart" :icon="cartIcon" :badge="2" />
          </div>
        </div>
        <div v-if="a.header.style === 'search' && a.header.showSearch" class="px-4 pb-3">
          <SearchBar />
        </div>
      </template>

      <!-- ===== Classic: logo | links | icons ===== -->
      <div v-else-if="a.header.style === 'classic' || isFloating" class="flex items-center justify-between gap-6" :class="isFloating ? 'px-5 py-3' : 'px-6 py-4'">
        <Logo />
        <NavLinks />
        <Icons />
      </div>

      <!-- ===== Centered: logo in the middle, links underneath ===== -->
      <div v-else-if="a.header.style === 'centered'" class="px-6 pt-4 pb-3">
        <div class="grid grid-cols-3 items-center">
          <div class="flex items-center">
            <IconButton v-if="a.header.showSearch" icon="lucide:search" />
          </div>
          <div class="flex justify-center"><Logo size="lg" /></div>
          <div class="flex items-center justify-end gap-4">
            <IconButton v-if="a.header.showWishlist" icon="lucide:heart" />
            <IconButton v-if="a.header.showCart" :icon="cartIcon" :badge="2" />
          </div>
        </div>
        <div class="flex justify-center mt-3 pt-3" :style="{ borderTop: `1px solid ${tone.border}` }">
          <NavLinks />
        </div>
      </div>

      <!-- ===== Split: links on both sides of a centered logo ===== -->
      <div v-else-if="a.header.style === 'split'" class="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-4">
        <NavLinks :links="LINKS.slice(0, 2)" />
        <Logo size="lg" />
        <div class="flex items-center justify-end gap-6">
          <NavLinks :links="LINKS.slice(2)" />
          <Icons />
        </div>
      </div>

      <!-- ===== Search first: wide search bar + category row (marketplace style) ===== -->
      <div v-else-if="a.header.style === 'search'">
        <div class="flex items-center gap-6 px-6 py-3">
          <Logo />
          <div class="flex-1 max-w-xl mx-auto">
            <SearchBar v-if="a.header.showSearch" />
          </div>
          <div class="flex items-center gap-4">
            <span class="hidden lg:flex items-center gap-1.5 text-sm font-medium" :style="{ color: tone.text }">
              <Icon name="lucide:user" class="w-5 h-5" /> حسابي
            </span>
            <IconButton v-if="a.header.showWishlist" icon="lucide:heart" />
            <IconButton v-if="a.header.showCart" :icon="cartIcon" :badge="2" />
          </div>
        </div>
        <div class="flex items-center gap-6 px-6 py-2 text-sm" :style="{ backgroundColor: tone.soft }">
          <span class="flex items-center gap-1.5 font-bold"><Icon name="lucide:layout-grid" class="w-4 h-4" /> كل الأقسام</span>
          <NavLinks />
        </div>
      </div>

      <!-- ===== Minimal: logo + icons, links behind the menu button ===== -->
      <div v-else class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <button type="button" aria-label="القائمة" :style="{ color: tone.text }"><Icon name="lucide:menu" class="w-6 h-6" /></button>
          <Logo />
        </div>
        <Icons />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from 'vue'
import { Icon } from '#components'
import { useStoreAppearance } from '~/composables/useStoreAppearance'
import { toneColors } from '~/utils/appearanceTone'

defineProps<{ mobile?: boolean }>()

const { draftAppearance: a } = useStoreAppearance()

const LINKS = ['الرئيسية', 'المنتجات', 'التصنيفات', 'العروض']

const tone = computed(() => toneColors(a.value?.header.background, a.value?.colors.primary ?? '#2563EB', a.value?.colors.text ?? '#111827'))
const isFloating = computed(() => a.value?.header.style === 'floating')
const cartIcon = computed(() => a.value?.header.style === 'minimal' ? 'lucide:shopping-bag' : 'lucide:shopping-cart')
// The floating bar follows the store's corner style
const floatingRadius = computed(() => ({ sharp: 'rounded-none', small: 'rounded-md', medium: 'rounded-xl', large: 'rounded-2xl' } as const)[a.value?.shape.borderRadius ?? 'medium'])

// Small render helpers shared by every layout
const Logo: FunctionalComponent<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const app = a.value!
  if (app.logo) return h('img', { src: app.logo, alt: 'الشعار', class: size === 'lg' ? 'h-10 object-contain' : size === 'sm' ? 'h-7 object-contain' : 'h-8 object-contain' })
  // On a brand-colored bar the brand-colored name would vanish
  const color = a.value!.header.background === 'light' ? app.colors.primary : tone.value.text
  return h('div', { class: ['font-bold whitespace-nowrap', size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'], style: { color } }, 'متجري')
}

const NavLinks: FunctionalComponent<{ links?: string[] }> = ({ links = LINKS }) =>
  h('nav', { class: 'flex items-center gap-6 text-sm font-medium' }, links.map(l => h('a', { href: '#', class: 'hover:opacity-70 whitespace-nowrap', style: { color: tone.value.text }, onClick: (e: Event) => e.preventDefault() }, l)))

const IconButton: FunctionalComponent<{ icon: string, badge?: number }> = ({ icon, badge }) =>
  h('button', { type: 'button', class: 'relative hover:opacity-70', style: { color: tone.value.text } }, [
    h(Icon, { name: icon, class: 'w-5 h-5' }),
    badge
      ? h('span', {
          class: 'absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full',
          // Inverted on the brand bar so the badge stays visible
          style: a.value!.header.background === 'brand'
            ? { backgroundColor: '#FFFFFF', color: a.value!.colors.primary }
            : { backgroundColor: a.value!.colors.primary, color: '#FFFFFF' }
        }, String(badge))
      : null
  ])

const Icons: FunctionalComponent = () => {
  const hd = a.value!.header
  return h('div', { class: 'flex items-center gap-4' }, [
    hd.showSearch ? h(IconButton, { icon: 'lucide:search' }) : null,
    hd.showWishlist ? h(IconButton, { icon: 'lucide:heart' }) : null,
    hd.showCart ? h(IconButton, { icon: cartIcon.value, badge: 2 }) : null
  ])
}

const SearchBar: FunctionalComponent = () =>
  h('div', {
    class: 'flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-full',
    style: { backgroundColor: a.value!.header.background === 'light' ? '#F3F4F6' : 'rgba(255,255,255,0.12)', color: tone.value.muted }
  }, [h(Icon, { name: 'lucide:search', class: 'w-4 h-4 shrink-0' }), 'ابحث عن منتج، قسم أو ماركة...'])
</script>
