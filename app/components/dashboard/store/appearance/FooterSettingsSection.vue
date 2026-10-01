<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">الفوتر</h2>
    
    <div class="space-y-4">
      <label class="flex items-center gap-3">
        <input 
          type="checkbox" 
          v-model="showNewsletter" 
          class="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span class="text-sm font-medium text-gray-700">إظهار الاشتراك في النشرة البريدية (Newsletter)</span>
      </label>

      <label class="flex items-center gap-3">
        <input 
          type="checkbox" 
          v-model="showSocialLinks" 
          class="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span class="text-sm font-medium text-gray-700">إظهار روابط التواصل الاجتماعي</span>
      </label>

      <label class="flex items-center gap-3">
        <input 
          type="checkbox" 
          v-model="showContactInfo" 
          class="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span class="text-sm font-medium text-gray-700">إظهار معلومات التواصل</span>
      </label>

      <label class="flex items-center gap-3">
        <input 
          type="checkbox" 
          v-model="showPaymentMethods" 
          class="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span class="text-sm font-medium text-gray-700">إظهار أيقونات طرق الدفع</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const showNewsletter = computed({
  get: () => draftAppearance.value?.footer?.showNewsletter ?? true,
  set: (val) => updateField('footer', 'showNewsletter', val)
})

const showSocialLinks = computed({
  get: () => draftAppearance.value?.footer?.showSocialLinks ?? true,
  set: (val) => updateField('footer', 'showSocialLinks', val)
})

const showContactInfo = computed({
  get: () => draftAppearance.value?.footer?.showContactInfo ?? true,
  set: (val) => updateField('footer', 'showContactInfo', val)
})

const showPaymentMethods = computed({
  get: () => draftAppearance.value?.footer?.showPaymentMethods ?? true,
  set: (val) => updateField('footer', 'showPaymentMethods', val)
})
</script>
