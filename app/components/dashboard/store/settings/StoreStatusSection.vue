<template>
  <SettingsCard id="status" title="حالة المتجر" description="إغلاق المتجر مؤقتاً أمام العملاء" icon="ph:power-bold">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-bold text-primary-navy dark:text-white">وضع الصيانة</h3>
        <p class="text-xs text-muted mt-0.5">العملاء يشوفوا رسالة الصيانة بدل المتجر، ولوحة التحكم تفضل شغالة</p>
      </div>
      <ToggleSwitch v-model="form.maintenanceMode" label="وضع الصيانة" />
    </div>

    <div v-if="form.maintenanceMode" class="mt-6 pt-6 border-t border-border-light dark:border-border-dark flex flex-col gap-4">
      <div class="flex items-start gap-3 bg-warning/10 text-warning rounded-lg p-3 text-sm font-bold">
        <Icon name="ph:warning-bold" class="w-5 h-5 shrink-0" />
        المتجر سيكون مغلقاً أمام العملاء بعد الحفظ.
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">رسالة الصيانة</label>
        <textarea
          v-model="form.maintenanceMessage"
          rows="2"
          class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
        ></textarea>
      </div>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/stores/storeSettings'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const form = defineModel<StoreSettings>({ required: true })
</script>
