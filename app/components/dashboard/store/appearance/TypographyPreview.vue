<template>
  <div :style="previewStyle">
    <h3 class="font-bold mb-2 text-2xl" :style="{ color: draftAppearance?.colors.primary }">
      عنوان رئيسي للمتجر
    </h3>
    <h4 class="font-semibold mb-3 text-lg" :style="{ color: draftAppearance?.colors.text }">
      عنوان فرعي يعرض هنا
    </h4>
    <p class="leading-relaxed opacity-90" :style="{ color: draftAppearance?.colors.text }">
      هذا مثال على النص العادي داخل المتجر. يمكن لعملائك قراءة وصف المنتجات والتفاصيل الأخرى بهذا الخط. تأكد من أن الخط واضح ومقروء.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance } = useStoreAppearance()

const previewStyle = computed(() => {
  if (!draftAppearance.value) return {}
  return {
    fontFamily: draftAppearance.value.typography.fontFamily,
    fontSize: `${draftAppearance.value.typography.baseFontSize}px`
  }
})
</script>
