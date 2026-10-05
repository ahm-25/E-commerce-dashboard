<!-- Wireframe of a header / footer layout for the style pickers: bars stand for the logo,
     links, icons and search, so each option reads at a glance without a real screenshot -->
<template>
  <div class="w-full h-16 rounded-md overflow-hidden border border-black/5" :style="{ backgroundColor: page }" aria-hidden="true">
    <!-- Headers sit at the top of the page, footers at the bottom -->
    <div class="h-full flex flex-col" :class="kind === 'footer' ? 'justify-end' : 'justify-start'">
      <!-- ===== Headers ===== -->
      <template v-if="kind === 'header'">
        <div v-if="variant === 'floating'" class="p-1.5">
          <div class="flex items-center justify-between px-2 h-5 rounded-md shadow" :style="{ backgroundColor: c.bg }">
            <Bar w="w-5" strong /> <Links :n="3" /> <Dots :n="2" />
          </div>
        </div>
        <div v-else :style="{ backgroundColor: c.bg }">
          <div v-if="variant === 'classic'" class="flex items-center justify-between px-2 h-6">
            <Bar w="w-5" strong /> <Links :n="3" /> <Dots :n="3" />
          </div>
          <div v-else-if="variant === 'centered'" class="px-2 pt-1.5 pb-1 flex flex-col items-center gap-1">
            <div class="w-full flex items-center justify-between"><Dots :n="1" /><Bar w="w-7" strong /><Dots :n="2" /></div>
            <Links :n="4" />
          </div>
          <div v-else-if="variant === 'split'" class="flex items-center justify-between px-2 h-6">
            <Links :n="2" /> <Bar w="w-6" strong /> <div class="flex items-center gap-1.5"><Links :n="1" /><Dots :n="2" /></div>
          </div>
          <div v-else-if="variant === 'search'">
            <div class="flex items-center gap-1.5 px-2 h-5">
              <Bar w="w-5" strong />
              <div class="flex-1 h-2.5 rounded-full" :style="{ backgroundColor: c.soft }"></div>
              <Dots :n="2" />
            </div>
            <div class="flex items-center px-2 h-3" :style="{ backgroundColor: c.soft }"><Links :n="4" /></div>
          </div>
          <div v-else class="flex items-center justify-between px-2 h-6">
            <div class="flex items-center gap-1"><Icon name="lucide:menu" class="w-2.5 h-2.5" :style="{ color: c.fg }" /><Bar w="w-5" strong /></div>
            <Dots :n="2" />
          </div>
        </div>
      </template>

      <!-- ===== Footers ===== -->
      <template v-else>
        <div :style="{ backgroundColor: c.bg }">
          <div v-if="variant === 'newsletter'" class="flex items-center justify-between px-2 h-3.5" :style="{ backgroundColor: c.accent }">
            <Bar w="w-8" light /> <div class="w-8 h-1.5 rounded-sm bg-white/80"></div>
          </div>
          <div v-if="variant === 'columns' || variant === 'newsletter'" class="grid grid-cols-4 gap-1.5 px-2 py-1.5">
            <div v-for="i in 4" :key="i" class="flex flex-col gap-0.5"><Bar w="w-full" strong /><Bar w="w-3/4" /><Bar w="w-1/2" /></div>
          </div>
          <div v-else-if="variant === 'centered'" class="flex flex-col items-center gap-1 py-1.5">
            <Bar w="w-7" strong /> <Links :n="4" /> <Dots :n="3" />
          </div>
          <div v-else class="flex items-center justify-between px-2 h-5">
            <Bar w="w-5" strong /> <Links :n="3" /> <Dots :n="3" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from 'vue'
import type { SurfaceTone } from '~/stores/storeAppearance'

const props = defineProps<{
  kind: 'header' | 'footer'
  variant: string
  tone: SurfaceTone
  brand: string
}>()

const page = '#F3F4F6'

const c = computed(() => {
  if (props.tone === 'dark') return { bg: '#111827', fg: '#E5E7EB', faint: '#4B5563', soft: '#1F2937', accent: props.brand }
  if (props.tone === 'brand') return { bg: props.brand, fg: '#FFFFFF', faint: 'rgba(255,255,255,0.5)', soft: 'rgba(255,255,255,0.2)', accent: 'rgba(0,0,0,0.2)' }
  return { bg: '#FFFFFF', fg: '#374151', faint: '#D1D5DB', soft: '#F3F4F6', accent: props.brand }
})

const Bar: FunctionalComponent<{ w: string, strong?: boolean, light?: boolean }> = ({ w, strong, light }) =>
  h('div', { class: [w, 'h-1.5 rounded-sm shrink-0'], style: { backgroundColor: light ? 'rgba(255,255,255,0.85)' : strong ? c.value.fg : c.value.faint } })

const Links: FunctionalComponent<{ n: number }> = ({ n }) =>
  h('div', { class: 'flex items-center gap-1' }, Array.from({ length: n }, () => h('div', { class: 'w-3 h-1 rounded-sm', style: { backgroundColor: c.value.faint } })))

const Dots: FunctionalComponent<{ n: number }> = ({ n }) =>
  h('div', { class: 'flex items-center gap-0.5' }, Array.from({ length: n }, () => h('div', { class: 'w-1.5 h-1.5 rounded-full', style: { backgroundColor: c.value.fg } })))
</script>
