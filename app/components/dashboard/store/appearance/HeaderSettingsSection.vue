<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">الهيدر</h2>
    
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">شكل الهيدر</label>
        <select 
          v-model="headerStyle" 
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
        >
          <option value="classic">كلاسيكي (اللوجو يمين، الروابط يسار)</option>
          <option value="centered">متمركز (اللوجو في المنتصف)</option>
          <option value="minimal">بسيط (بدون روابط علوية)</option>
        </select>
      </div>

      <hr class="border-gray-100" />

      <div class="space-y-4">
        <label class="flex items-center gap-3">
          <input 
            type="checkbox" 
            v-model="stickyHeader" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="text-sm font-medium text-gray-700">تثبيت الهيدر أثناء التمرير (Sticky)</span>
        </label>

        <label class="flex items-center gap-3">
          <input 
            type="checkbox" 
            v-model="showSearch" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="text-sm font-medium text-gray-700">إظهار أيقونة البحث</span>
        </label>

        <label class="flex items-center gap-3">
          <input 
            type="checkbox" 
            v-model="showWishlist" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="text-sm font-medium text-gray-700">إظهار المفضلة</span>
        </label>

        <label class="flex items-center gap-3">
          <input 
            type="checkbox" 
            v-model="showCart" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="text-sm font-medium text-gray-700">إظهار السلة</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const headerStyle = computed({
  get: () => draftAppearance.value?.header.style || 'classic',
  set: (val) => updateField('header', 'style', val)
})

const stickyHeader = computed({
  get: () => draftAppearance.value?.header.sticky ?? true,
  set: (val) => updateField('header', 'sticky', val)
})

const showSearch = computed({
  get: () => draftAppearance.value?.header.showSearch ?? true,
  set: (val) => updateField('header', 'showSearch', val)
})

const showWishlist = computed({
  get: () => draftAppearance.value?.header.showWishlist ?? true,
  set: (val) => updateField('header', 'showWishlist', val)
})

const showCart = computed({
  get: () => draftAppearance.value?.header.showCart ?? true,
  set: (val) => updateField('header', 'showCart', val)
})
</script>
