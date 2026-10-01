<template>
  <div
    class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden transition-opacity"
    :class="{ 'opacity-60': !zone.isActive }"
  >
    <!-- Header -->
    <div class="px-5 py-4 flex items-start justify-between gap-4 border-b border-border-light dark:border-border-dark">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="font-bold text-primary-navy dark:text-white font-ibm truncate">{{ zone.name }}</h3>
          <span
            class="px-2 py-0.5 rounded text-xs font-bold shrink-0"
            :class="zone.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-gray-800 text-muted'"
          >
            {{ zone.isActive ? 'مفعّلة' : 'متوقفة' }}
          </span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="region in visibleRegions"
            :key="region"
            class="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-primary-navy dark:text-white"
          >
            {{ region }}
          </span>
          <button
            v-if="hiddenCount > 0"
            @click="showAllRegions = true"
            class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            +{{ hiddenCount }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <ToggleSwitch :model-value="zone.isActive" label="تفعيل المنطقة" @update:model-value="store.toggleZone(zone.id)" />
        <button
          @click="store.openZoneDialog(zone)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
          title="تعديل"
        >
          <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
        </button>
        <button
          @click="confirmDelete"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          title="حذف"
        >
          <Icon name="ph:trash-bold" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Rates -->
    <div class="divide-y divide-border-light dark:divide-border-dark">
      <div v-for="rate in zone.rates" :key="rate.id" class="px-5 py-3 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="text-sm font-bold text-primary-navy dark:text-white">{{ rate.name }}</div>
          <div class="text-xs text-muted mt-0.5 flex items-center gap-1">
            <Icon name="ph:clock" class="w-3.5 h-3.5" />
            {{ formatDeliveryTime(rate) }}
          </div>
        </div>
        <div class="text-left shrink-0">
          <div class="text-sm font-black text-primary-navy dark:text-white">{{ formatRatePrice(rate) }}</div>
          <div v-if="rate.type === 'weight'" class="text-xs text-muted mt-0.5">{{ formatExtraWeight(rate) }}</div>
          <div v-if="rate.freeAbove" class="text-xs text-success font-bold mt-0.5">مجاني فوق {{ rate.freeAbove.toLocaleString() }} ج.م</div>
        </div>
      </div>
      <div v-if="zone.rates.length === 0" class="px-5 py-4 text-sm text-warning font-bold flex items-center gap-2">
        <Icon name="ph:warning-bold" class="w-4 h-4" />
        لا توجد أسعار شحن، العملاء في هذه المنطقة لن يستطيعوا إتمام الطلب
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShippingStore, type ShippingZone } from '~/stores/shipping'
import { formatRatePrice, formatExtraWeight, formatDeliveryTime } from '~/composables/useShippingFormat'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const props = defineProps<{
  zone: ShippingZone
}>()

const store = useShippingStore()

const MAX_VISIBLE_REGIONS = 6
const showAllRegions = ref(false)

const visibleRegions = computed(() =>
  showAllRegions.value ? props.zone.regions : props.zone.regions.slice(0, MAX_VISIBLE_REGIONS)
)
const hiddenCount = computed(() => props.zone.regions.length - visibleRegions.value.length)

const confirmDelete = () => {
  if (confirm(`هل تريد حذف منطقة "${props.zone.name}"؟ المحافظات التابعة لها لن يكون لها شحن.`)) {
    store.deleteZone(props.zone.id)
  }
}
</script>
