<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">الشحن</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">الشحن والتوصيل</h1>
          <p class="text-sm text-muted mt-1">المناطق التي توصّل لها، وأسعار الشحن، وشركات الشحن.</p>
        </div>
        <button
          v-if="canManage && currentTab === 'zones' && !store.loading && !store.error"
          @click="store.openZoneDialog()"
          class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Icon name="ph:plus-bold" class="w-4 h-4" />
          إضافة منطقة شحن
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="flex flex-col gap-6 animate-pulse">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <h2 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تعذر تحميل إعدادات الشحن</h2>
        <p class="text-muted mb-6">{{ store.error }}</p>
        <button @click="store.fetchShipping()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>

      <template v-else>
        <ShippingStats />

        <!-- Tabs -->
        <div class="border-b border-border-light dark:border-border-dark flex gap-6 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap"
            :class="currentTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary-navy dark:hover:text-white'"
          >
            {{ tab.label }}
          </button>
        </div>

        <ReadOnlyNotice v-if="!canManage" />

        <fieldset :disabled="!canManage" class="min-w-0">
        <!-- Zones Tab -->
        <div v-if="currentTab === 'zones'" class="flex flex-col gap-4">
          <div
            v-if="store.uncoveredRegions.length > 0 && store.zones.length > 0"
            class="flex items-start gap-3 bg-warning/10 text-warning rounded-xl p-4"
          >
            <Icon name="ph:warning-bold" class="w-5 h-5 shrink-0 mt-0.5" />
            <div class="text-sm">
              <span class="font-bold">{{ store.uncoveredRegions.length }} محافظة بدون شحن:</span>
              العملاء فيها لن يستطيعوا إتمام الطلب.
              <span class="block text-xs mt-1 opacity-90">{{ store.uncoveredRegions.join('، ') }}</span>
            </div>
          </div>

          <ShippingZoneCard v-for="zone in store.zones" :key="zone.id" :zone="zone" />

          <div v-if="store.zones.length === 0" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Icon name="ph:map-trifold" class="w-8 h-8" />
            </div>
            <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-2">لا توجد مناطق شحن</h2>
            <p class="text-sm text-muted max-w-sm mx-auto mb-6">أضف أول منطقة شحن وحدد المحافظات وأسعار التوصيل لكي يستطيع العملاء إتمام الطلب.</p>
            <button
              @click="store.openZoneDialog()"
              class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              <Icon name="ph:plus-bold" class="w-4 h-4" />
              إضافة منطقة شحن
            </button>
          </div>
        </div>

        <!-- Carriers Tab -->
        <ShippingCarriers v-else-if="currentTab === 'carriers'" />

        <!-- Settings Tab -->
        <ShippingGeneralSettings v-else-if="currentTab === 'settings'" />
        </fieldset>
      </template>
    </div>

    <ShippingZoneDialog />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref, onMounted } from 'vue'
import { useShippingStore } from '~/stores/shipping'
import ShippingStats from '~/components/dashboard/store/shipping/ShippingStats.vue'
import ShippingZoneCard from '~/components/dashboard/store/shipping/ShippingZoneCard.vue'
import ShippingZoneDialog from '~/components/dashboard/store/shipping/ShippingZoneDialog.vue'
import ShippingCarriers from '~/components/dashboard/store/shipping/ShippingCarriers.vue'
import ShippingGeneralSettings from '~/components/dashboard/store/shipping/ShippingGeneralSettings.vue'
import ReadOnlyNotice from '~/components/dashboard/ReadOnlyNotice.vue'

const store = useShippingStore()

const tabs = [
  { id: 'zones', label: 'مناطق الشحن' },
  { id: 'carriers', label: 'شركات الشحن' },
  { id: 'settings', label: 'إعدادات عامة' }
] as const

const currentTab = ref<typeof tabs[number]['id']>('zones')

useHead({
  title: 'الشحن | لوحة التحكم'
})

onMounted(() => {
  if (!store.loaded) store.fetchShipping()
})

const canManage = useCanManage('storeSettings')
</script>
