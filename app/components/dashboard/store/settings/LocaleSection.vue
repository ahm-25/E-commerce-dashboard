<template>
  <SettingsCard id="locale" title="العملة والمنطقة" description="تُستخدم في عرض الأسعار والتواريخ وحساب الشحن" icon="ph:globe-hemisphere-east-bold">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">عملة المتجر</label>
        <select v-model="form.currency" :class="inputClass">
          <option v-for="option in currencyOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <p v-if="form.currency !== initialCurrency" class="text-xs text-warning font-bold mt-1.5">
          تغيير العملة لا يحوّل أسعار المنتجات الحالية تلقائياً.
        </p>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">المنطقة الزمنية</label>
        <select v-model="form.timezone" :class="inputClass">
          <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">وحدة الوزن</label>
        <select v-model="form.weightUnit" :class="inputClass">
          <option value="kg">كيلوجرام (kg)</option>
          <option value="g">جرام (g)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">صيغة التاريخ</label>
        <select v-model="form.dateFormat" :class="inputClass">
          <option value="DD/MM/YYYY">31/12/2026</option>
          <option value="YYYY-MM-DD">2026-12-31</option>
        </select>
      </div>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { currencyOptions, timezoneOptions, type StoreSettings } from '~/stores/storeSettings'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'

defineProps<{
  initialCurrency?: string
}>()

const form = defineModel<StoreSettings>({ required: true })

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
