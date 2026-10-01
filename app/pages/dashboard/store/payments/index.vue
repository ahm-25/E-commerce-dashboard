<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-sm text-gray-500 mb-1">لوحة التحكم / المتجر / الدفع</div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">إدارة الدفع</h1>
          <p class="text-sm text-gray-500 mt-1">إدارة طرق وبوابات الدفع المتاحة لعملاء متجرك.</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- CTA based on current tab -->
          <button v-if="canManage && currentTab === 'methods'" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm">
            <Icon name="heroicons:plus" class="w-4 h-4" />
            إضافة طريقة دفع
          </button>
          <button v-if="canManage && currentTab === 'gateways'" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm">
            <Icon name="heroicons:plus" class="w-4 h-4" />
            إضافة بوابة دفع
          </button>
        </div>
      </div>

      <!-- Stats -->
      <DashboardStorePaymentsStats v-if="!store.error" />

      <!-- Error State -->
      <div v-if="store.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center">
        <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">تعذر تحميل إعدادات الدفع</h3>
        <p class="text-red-600 dark:text-red-300 mb-4">{{ store.error }}</p>
        <button @click="store.fetchPaymentData()" class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60 rounded-lg transition-colors">
          إعادة المحاولة
        </button>
      </div>

      <!-- Main Content (Tabs + Content) -->
      <div v-else class="flex flex-col gap-6">
        
        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-800 flex gap-6 overflow-x-auto">
          <button @click="currentTab = 'methods'" :class="['pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap', currentTab === 'methods' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
            طرق الدفع
          </button>
          <button @click="currentTab = 'gateways'" :class="['pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap', currentTab === 'gateways' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
            بوابات الدفع
          </button>
          <button @click="currentTab = 'settings'" :class="['pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap', currentTab === 'settings' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
            إعدادات عامة
          </button>
        </div>

        <ReadOnlyNotice v-if="!canManage" />

        <!-- Tab Content (a disabled fieldset disables every control inside it) -->
        <fieldset :disabled="!canManage" class="min-w-0">
          <!-- Methods Tab -->
          <div v-if="currentTab === 'methods'" class="animate-fade-in">
            <DashboardStorePaymentsPaymentMethodsTable />
          </div>

          <!-- Gateways Tab -->
          <div v-if="currentTab === 'gateways'" class="animate-fade-in">
            <DashboardStorePaymentsPaymentGatewayList />
          </div>

          <!-- Settings Tab -->
          <div v-if="currentTab === 'settings'" class="animate-fade-in">
            <DashboardStorePaymentsPaymentGeneralSettings />
          </div>
        </fieldset>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref } from 'vue'
import { usePayments } from '~/composables/usePayments'
import DashboardStorePaymentsStats from '~/components/dashboard/store/payments/PaymentsStats.vue'
import DashboardStorePaymentsPaymentMethodsTable from '~/components/dashboard/store/payments/PaymentMethodsTable.vue'
import DashboardStorePaymentsPaymentGatewayList from '~/components/dashboard/store/payments/PaymentGatewayList.vue'
import DashboardStorePaymentsPaymentGeneralSettings from '~/components/dashboard/store/payments/PaymentGeneralSettings.vue'
import ReadOnlyNotice from '~/components/dashboard/ReadOnlyNotice.vue'

const { store } = usePayments()
const currentTab = ref('methods')

const canManage = useCanManage('storeSettings')
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
