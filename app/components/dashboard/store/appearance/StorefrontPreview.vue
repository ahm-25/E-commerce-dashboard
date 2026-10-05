<template>
  <div v-if="draftAppearance" class="flex flex-col min-h-full" :style="rootStyles">
    
    <!-- Announcement Bar -->
    <div 
      v-if="draftAppearance.announcementBar?.enabled" 
      class="py-2 px-4 text-center text-sm font-medium transition-colors"
      :style="{ backgroundColor: draftAppearance.colors.accent, color: '#ffffff' }"
    >
      <a v-if="draftAppearance.announcementBar.link" :href="draftAppearance.announcementBar.link" class="hover:underline">
        {{ draftAppearance.announcementBar.text }}
      </a>
      <span v-else>{{ draftAppearance.announcementBar.text }}</span>
    </div>

    <!-- Header -->
    <DashboardStoreAppearancePreviewHeader :mobile="device === 'mobile'" />

    <!-- Main Content -->
    <main class="flex-1 space-y-12" :class="isMobile ? 'p-4' : 'p-6'">
      <!-- Hero Section -->
      <div 
        class="w-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
        :style="{ backgroundColor: draftAppearance.colors.secondary }"
        :class="[borderRadiusClass, isMobile ? 'h-64' : 'h-80']"
      >
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 class="font-bold text-white mb-4 relative z-10" :class="isMobile ? 'text-2xl' : 'text-4xl'" :style="{ fontFamily: draftAppearance.typography.fontFamily }">
          أحدث المنتجات العصرية
        </h1>
        <p class="text-white/80 mb-6 max-w-lg relative z-10">
          اكتشف مجموعتنا الجديدة من المنتجات المميزة بتصميمات عصرية وجودة لا مثيل لها.
        </p>
        <button 
          class="px-6 py-3 font-bold text-white relative z-10 transition-transform hover:scale-105"
          :class="[buttonStyleClass]"
          :style="{ backgroundColor: draftAppearance.colors.primary }"
        >
          تسوق الآن
        </button>
      </div>

      <!-- Categories -->
      <section>
        <h2 class="font-bold mb-6 text-center" :class="isMobile ? 'text-xl' : 'text-2xl'" :style="{ color: draftAppearance.colors.text }">تسوق حسب التصنيف</h2>
        <div class="grid gap-4" :class="isMobile ? 'grid-cols-2' : 'grid-cols-4'">
          <div v-for="i in 4" :key="i" class="flex flex-col items-center gap-2 group cursor-pointer">
            <div 
              class="w-24 h-24 bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105"
              :class="buttonStyleClass === 'rounded-full' ? 'rounded-full' : borderRadiusClass"
            >
              <Icon name="lucide:shopping-bag" class="w-8 h-8 text-gray-400" />
            </div>
            <span class="font-medium" :style="{ color: draftAppearance.colors.text }">تصنيف {{ i }}</span>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-bold" :class="isMobile ? 'text-xl' : 'text-2xl'" :style="{ color: draftAppearance.colors.text }">المنتجات المميزة</h2>
          <a href="#" class="text-sm font-medium hover:underline" :style="{ color: draftAppearance.colors.primary }">عرض الكل</a>
        </div>
        <div class="grid" :class="isMobile ? 'grid-cols-2 gap-3' : device === 'tablet' ? 'grid-cols-3 gap-4' : 'grid-cols-4 gap-6'">
          <div 
            v-for="i in 4" 
            :key="i" 
            class="bg-white overflow-hidden flex flex-col transition-all group"
            :class="productCardClass"
          >
            <!-- Image -->
            <div class="aspect-square bg-gray-100 relative">
              <div v-if="i === 1" class="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 z-10" :class="buttonStyleClass" :style="{ backgroundColor: draftAppearance.colors.accent }">
                جديد
              </div>
              <div class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:image" class="w-12 h-12 text-gray-300" />
              </div>
            </div>
            
            <!-- Details -->
            <div class="p-4 flex flex-col flex-1">
              <div class="text-xs text-gray-500 mb-1">تصنيف {{ i }}</div>
              <h3 class="font-bold mb-2 line-clamp-1" :style="{ color: draftAppearance.colors.text }">اسم المنتج الأنيق والحديث {{ i }}</h3>
              
              <div class="flex items-center gap-1 mb-3">
                <Icon v-for="s in 5" :key="s" name="lucide:star" class="w-3 h-3 text-amber-400 fill-amber-400" />
                <span class="text-xs text-gray-500 mr-1">(24)</span>
              </div>
              
              <div class="mt-auto flex items-center justify-between">
                <div class="font-bold text-lg" :style="{ color: draftAppearance.colors.primary }">15,999 ج.م</div>
                <button 
                  class="w-10 h-10 flex items-center justify-center text-white transition-colors"
                  :class="buttonStyleClass"
                  :style="{ backgroundColor: draftAppearance.colors.primary }"
                >
                  <Icon name="lucide:plus" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <div ref="footerEl">
      <DashboardStoreAppearancePreviewFooter :mobile="device === 'mobile'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useStoreAppearance, useAppearanceFocus } from '~/composables/useStoreAppearance'

// The frame is narrower than the window, so layout follows the chosen device, not CSS breakpoints
const props = withDefaults(defineProps<{ device?: 'desktop' | 'tablet' | 'mobile' }>(), { device: 'desktop' })
const isMobile = computed(() => props.device === 'mobile')

const { draftAppearance } = useStoreAppearance()

// The header / footer tabs keep what they change in view: on opening the tab and on every edit
const focus = useAppearanceFocus()
const footerEl = ref<HTMLElement | null>(null)
watch(
  () => [focus.value, focus.value === 'footer' ? JSON.stringify(draftAppearance.value?.footer) : JSON.stringify(draftAppearance.value?.header), props.device],
  async () => {
    await nextTick()
    const scroller = footerEl.value?.closest('.overflow-y-auto')
    if (!scroller) return
    if (focus.value === 'footer') scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' })
    else if (focus.value === 'header') scroller.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

const rootStyles = computed(() => {
  if (!draftAppearance.value) return {}
  return {
    fontFamily: draftAppearance.value.typography.fontFamily,
    fontSize: `${draftAppearance.value.typography.baseFontSize}px`,
    backgroundColor: draftAppearance.value.colors.background
  }
})

const borderRadiusClass = computed(() => {
  switch (draftAppearance.value?.shape.borderRadius) {
    case 'sharp': return 'rounded-none'
    case 'small': return 'rounded-sm'
    case 'medium': return 'rounded-md'
    case 'large': return 'rounded-2xl'
    default: return 'rounded-md'
  }
})

const buttonStyleClass = computed(() => {
  switch (draftAppearance.value?.shape.buttonStyle) {
    case 'square': return 'rounded-none'
    case 'rounded': return 'rounded-md'
    case 'soft': return 'rounded-xl'
    case 'pill': return 'rounded-full'
    default: return 'rounded-md'
  }
})

const productCardClass = computed(() => {
  const baseRadius = borderRadiusClass.value
  switch (draftAppearance.value?.productCard.style) {
    case 'minimal': return 'shadow-none border-none ' + baseRadius
    case 'classic': return 'border border-gray-200 ' + baseRadius
    case 'elevated': return 'shadow-md hover:shadow-lg border-none ' + baseRadius
    case 'bordered': return 'border-2 border-gray-200 ' + baseRadius
    default: return 'border border-gray-200 ' + baseRadius
  }
})
</script>
