<template>
  <SettingsCard id="checkout" title="الطلبات وإتمام الشراء" description="قواعد إنشاء الطلبات وبيانات العميل المطلوبة" icon="ph:shopping-cart-bold">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">بادئة رقم الطلب</label>
        <input v-model="form.orderPrefix" type="text" dir="ltr" maxlength="6" :class="inputClass" />
        <p class="text-xs text-muted mt-1.5" dir="ltr">#{{ form.orderPrefix || '' }}-10482</p>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الحد الأدنى للطلب</label>
        <input v-model.number="form.minOrderValue" type="number" min="0" placeholder="بدون حد أدنى" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">إلغاء الطلب غير المدفوع بعد (ساعة)</label>
        <input v-model.number="form.autoCancelUnpaidHours" type="number" min="1" placeholder="لا يُلغى تلقائياً" :class="inputClass" />
      </div>
    </div>

    <div class="flex flex-col gap-5 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-primary-navy dark:text-white">الشراء كزائر</h3>
          <p class="text-xs text-muted mt-0.5">السماح بإتمام الطلب بدون إنشاء حساب</p>
        </div>
        <ToggleSwitch v-model="form.allowGuestCheckout" label="الشراء كزائر" />
      </div>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-primary-navy dark:text-white">رقم الهاتف إجباري</h3>
          <p class="text-xs text-muted mt-0.5">مطلوب لشركات الشحن والدفع عند الاستلام</p>
        </div>
        <ToggleSwitch v-model="form.requirePhone" label="رقم الهاتف إجباري" />
      </div>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/stores/storeSettings'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const form = defineModel<StoreSettings>({ required: true })

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
