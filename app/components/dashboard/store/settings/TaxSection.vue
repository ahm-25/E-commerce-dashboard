<template>
  <SettingsCard id="tax" title="الضرائب" description="ضريبة القيمة المضافة على الطلبات" icon="ph:receipt-bold">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-bold text-primary-navy dark:text-white">تفعيل الضريبة</h3>
        <p class="text-xs text-muted mt-0.5">إضافة الضريبة على الطلبات وإظهارها في الفاتورة</p>
      </div>
      <ToggleSwitch v-model="form.taxEnabled" label="تفعيل الضريبة" />
    </div>

    <div v-if="form.taxEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">نسبة الضريبة (%)</label>
        <input v-model.number="form.taxRate" type="number" min="0" max="100" step="0.5" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الرقم الضريبي</label>
        <input v-model="form.taxNumber" type="text" dir="ltr" placeholder="اختياري" :class="inputClass" />
      </div>
      <div class="md:col-span-2 flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-primary-navy dark:text-white">الأسعار تشمل الضريبة</h3>
          <p class="text-xs text-muted mt-0.5">
            {{ form.pricesIncludeTax
              ? `منتج سعره 100 يظهر للعميل بـ 100 (منها ${taxPart(100)} ضريبة)`
              : `منتج سعره 100 يظهر للعميل بـ ${100 + (form.taxRate || 0)} بعد الضريبة` }}
          </p>
        </div>
        <ToggleSwitch v-model="form.pricesIncludeTax" label="الأسعار تشمل الضريبة" />
      </div>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/stores/storeSettings'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const form = defineModel<StoreSettings>({ required: true })

const taxPart = (price: number) => {
  const rate = form.value.taxRate || 0
  return Math.round((price - price / (1 + rate / 100)) * 100) / 100
}

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
