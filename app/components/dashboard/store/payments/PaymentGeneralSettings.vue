<template>
  <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 max-w-4xl transition-all">
    <div class="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-1">الإعدادات العامة للدفع</h2>
      <p class="text-sm text-gray-500">تحكم في كيفية ظهور وعمل طرق الدفع في متجرك.</p>
    </div>

    <div class="space-y-6">
      <!-- Toggle Settings -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">تفعيل الدفع الإلكتروني</h3>
          <p class="text-xs text-gray-500">السماح للعملاء بالدفع عبر بوابات الدفع الإلكترونية.</p>
        </div>
        <button @click="toggleSetting('enableElectronicPayments')" :class="['relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', store.generalSettings.enableElectronicPayments ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700']">
          <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', store.generalSettings.enableElectronicPayments ? '-translate-x-5' : 'translate-x-0']"></span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">السماح بأكثر من طريقة دفع</h3>
          <p class="text-xs text-gray-500">إظهار جميع طرق الدفع المتاحة للعميل ليختار منها.</p>
        </div>
        <button @click="toggleSetting('allowMultipleMethods')" :class="['relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', store.generalSettings.allowMultipleMethods ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700']">
          <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', store.generalSettings.allowMultipleMethods ? '-translate-x-5' : 'translate-x-0']"></span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">حفظ طريقة الدفع للطلبات المستقبلية</h3>
          <p class="text-xs text-gray-500">حفظ بطاقات العملاء لتسهيل الدفع لاحقاً (يتطلب دعم بوابة الدفع).</p>
        </div>
        <button @click="toggleSetting('saveMethodsForFuture')" :class="['relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', store.generalSettings.saveMethodsForFuture ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700']">
          <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', store.generalSettings.saveMethodsForFuture ? '-translate-x-5' : 'translate-x-0']"></span>
        </button>
      </div>

      <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">ماذا يحدث عند فشل الدفع؟</label>
        <select :value="store.generalSettings.failedPaymentBehavior" @change="e => updateSetting('failedPaymentBehavior', (e.target as HTMLSelectElement).value)" class="w-full sm:w-80 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-sm">
          <option value="retry">طلب إعادة المحاولة بنفس الطريقة</option>
          <option value="show_others">إظهار طرق دفع أخرى</option>
          <option value="keep_pending">إبقاء الطلب معلقاً (Pending)</option>
        </select>
        <p class="text-xs text-gray-500 mt-2">يحدد هذا الخيار تصرف النظام عندما تفشل عملية الدفع للعميل.</p>
      </div>
      
      <div class="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <button @click="saveSettings" :disabled="isSaving" class="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
          <Icon v-if="isSaving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          {{ isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePayments } from '~/composables/usePayments'

const { store } = usePayments()
const isSaving = ref(false)
const pendingChanges = ref<Record<string, any>>({})

const toggleSetting = (key: keyof typeof store.generalSettings) => {
  const newValue = !store.generalSettings[key]
  pendingChanges.value[key] = newValue
  store.generalSettings[key] = newValue as never // Optimistic UI update
}

const updateSetting = (key: keyof typeof store.generalSettings, value: any) => {
  pendingChanges.value[key] = value
  store.generalSettings[key] = value as never
}

const saveSettings = async () => {
  isSaving.value = true
  await store.updateSettings(pendingChanges.value)
  pendingChanges.value = {}
  isSaving.value = false
  alert('تم حفظ إعدادات الدفع بنجاح.') // In real app, use toast
}
</script>
