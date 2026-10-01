<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="stat in stats" :key="stat.label" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted font-bold">{{ stat.label }}</span>
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="stat.iconClass">
          <Icon :name="stat.icon" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ stat.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShippingStore, EGYPT_GOVERNORATES } from '~/stores/shipping'

const store = useShippingStore()

const stats = computed(() => [
  { label: 'مناطق الشحن المفعّلة', value: `${store.activeZonesCount} من ${store.zones.length}`, icon: 'ph:map-trifold-bold', iconClass: 'bg-primary/10 text-primary' },
  { label: 'المحافظات المغطاة', value: `${store.coveredRegions.size} من ${EGYPT_GOVERNORATES.length}`, icon: 'ph:map-pin-bold', iconClass: 'bg-success/10 text-success' },
  { label: 'شركات الشحن المتصلة', value: store.connectedCarriersCount, icon: 'ph:truck-bold', iconClass: 'bg-primary/10 text-primary' },
  { label: 'محافظات بدون شحن', value: store.uncoveredRegions.length, icon: 'ph:warning-bold', iconClass: 'bg-warning/10 text-warning' }
])
</script>
