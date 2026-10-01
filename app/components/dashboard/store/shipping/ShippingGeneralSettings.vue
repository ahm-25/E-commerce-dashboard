<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6 max-w-3xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">مدة تجهيز الطلب (يوم عمل)</label>
        <input v-model.number="form.processingDays" type="number" min="0" :class="inputClass" />
        <p class="text-xs text-muted mt-1.5">تُضاف إلى مدة التوصيل المعروضة للعميل</p>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الوزن الافتراضي للمنتج (كجم)</label>
        <input v-model.number="form.defaultWeightKg" type="number" min="0" step="0.1" :class="inputClass" />
        <p class="text-xs text-muted mt-1.5">يُستخدم للمنتجات التي ليس لها وزن محدد</p>
      </div>
    </div>

    <div class="flex flex-col gap-5 mt-6 pt-6 border-t border-border-light dark:border-border-dark">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-primary-navy dark:text-white">إظهار مدة التوصيل المتوقعة</h3>
          <p class="text-xs text-muted mt-0.5">في صفحة المنتج وصفحة إتمام الطلب</p>
        </div>
        <ToggleSwitch v-model="form.showDeliveryEstimate" label="إظهار مدة التوصيل المتوقعة" />
      </div>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-primary-navy dark:text-white">الاستلام من المتجر</h3>
          <p class="text-xs text-muted mt-0.5">العميل يستلم الطلب بنفسه بدون رسوم شحن</p>
        </div>
        <ToggleSwitch v-model="form.localPickupEnabled" label="الاستلام من المتجر" />
      </div>
      <div v-if="form.localPickupEnabled">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">عنوان الاستلام</label>
        <input v-model="form.localPickupAddress" type="text" placeholder="العنوان الذي يظهر للعميل" :class="inputClass" />
      </div>
    </div>

    <div class="mt-6 pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
      <span v-if="justSaved" class="text-sm font-bold text-success flex items-center gap-1.5">
        <Icon name="ph:check-circle-bold" class="w-5 h-5" />
        تم الحفظ
      </span>
      <button
        v-if="isDirty"
        @click="reset"
        :disabled="saving"
        class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
      >
        تجاهل
      </button>
      <button
        @click="save"
        :disabled="saving || !isDirty"
        class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
      >
        {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useShippingStore, type ShippingSettings } from '~/stores/shipping'
import ToggleSwitch from '~/components/dashboard/ToggleSwitch.vue'

const store = useShippingStore()

const form = ref<ShippingSettings>(structuredClone(toRaw(store.settings)))
const saving = ref(false)
const justSaved = ref(false)

const isDirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(store.settings))

const reset = () => {
  form.value = structuredClone(toRaw(store.settings))
}

const save = async () => {
  if (form.value.localPickupEnabled && !form.value.localPickupAddress.trim()) {
    alert('يرجى إدخال عنوان الاستلام')
    return
  }
  saving.value = true
  try {
    await store.updateSettings({
      ...form.value,
      processingDays: Number(form.value.processingDays) || 0,
      defaultWeightKg: Number(form.value.defaultWeightKg) || 0
    })
    reset()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 2500)
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ الإعدادات')
  } finally {
    saving.value = false
  }
}

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
