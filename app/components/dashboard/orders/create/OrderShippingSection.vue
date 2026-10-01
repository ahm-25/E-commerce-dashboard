<template>
  <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <div class="flex items-center justify-between gap-4 mb-4">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm">التوصيل</h2>
      <label v-if="shipping.settings.localPickupEnabled" class="flex items-center gap-2 text-sm font-bold text-primary-navy dark:text-white cursor-pointer">
        <input v-model="form.pickup" type="checkbox" class="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
        استلام من المتجر
      </label>
    </div>

    <p v-if="form.pickup" class="text-sm text-muted bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-start gap-2">
      <Icon name="ph:storefront" class="w-5 h-5 shrink-0" />
      العميل هيستلم من: {{ shipping.settings.localPickupAddress || 'عنوان المتجر' }}
    </p>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">المحافظة <span class="text-danger">*</span></label>
          <select v-model="form.address.governorate" :class="inputClass">
            <option value="" disabled>اختار المحافظة</option>
            <option v-for="g in EGYPT_GOVERNORATES" :key="g" :value="g" :disabled="!coveredRegions.has(g)">
              {{ g }}{{ coveredRegions.has(g) ? '' : ' (لا يوجد شحن)' }}
            </option>
          </select>
        </div>
        <div>
          <label :class="labelClass">المدينة / المنطقة</label>
          <input v-model="form.address.city" type="text" :class="inputClass" />
        </div>
        <div class="sm:col-span-2">
          <label :class="labelClass">العنوان بالتفصيل <span class="text-danger">*</span></label>
          <input v-model="form.address.street" type="text" placeholder="الشارع، رقم العمارة، الدور، علامة مميزة" :class="inputClass" />
        </div>
      </div>

      <div v-if="availableRates.length" class="mt-5">
        <div :class="labelClass">طريقة الشحن</div>
        <div class="flex flex-col gap-2">
          <label
            v-for="rate in availableRates"
            :key="rate.id"
            class="flex items-center justify-between gap-4 p-3 rounded-lg border cursor-pointer transition-colors"
            :class="form.rateId === rate.id ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/40'"
          >
            <span class="flex items-center gap-3">
              <input v-model="form.rateId" type="radio" name="shipping-rate" :value="rate.id" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary" />
              <span>
                <span class="block text-sm font-bold text-primary-navy dark:text-white">{{ rate.name }}</span>
                <span class="block text-xs text-muted">{{ formatDeliveryTime(rate) }}</span>
              </span>
            </span>
            <span class="text-sm font-bold text-primary-navy dark:text-white shrink-0">
              {{ costOf(rate) === 0 ? 'مجاني' : `${costOf(rate).toLocaleString('en-US')} ${currency}` }}
            </span>
          </label>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useShippingStore, EGYPT_GOVERNORATES, type ShippingRate } from '~/stores/shipping'
import { useManualOrder } from '~/composables/useManualOrder'
import { calculateRateCost, formatDeliveryTime } from '~/composables/useShippingFormat'

const { form, availableRates, subtotal, discount, weightKg, currency } = useManualOrder()
const shipping = useShippingStore()

// Only active zones count as covered here
const coveredRegions = computed(() => new Set(shipping.zones.filter(z => z.isActive).flatMap(z => z.regions)))

const costOf = (rate: ShippingRate) => calculateRateCost(rate, subtotal.value - discount.value, weightKg.value)

onMounted(() => {
  if (!shipping.loaded) shipping.fetchShipping()
})

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
