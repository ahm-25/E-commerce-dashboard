<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div v-if="!store.loading && store.paymentGateways.length === 0" class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center shadow-sm">
      <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700">
        <Icon name="heroicons:server-stack" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">لم تتم إضافة أي بوابة دفع</h3>
      <p class="text-gray-500 max-w-md mx-auto mb-6">اربط بوابة دفع إلكترونية لتمكين العملاء من الدفع عبر الإنترنت بشكل آمن وسريع.</p>
      <button class="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
        + إضافة بوابة دفع
      </button>
    </div>

    <!-- Gateways Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="store.loading" v-for="i in 2" :key="i" class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div class="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div class="space-y-3 mb-5">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      <div v-for="gateway in store.paymentGateways" :key="gateway.id" class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
        <!-- Status Strip at top -->
        <div class="absolute top-0 left-0 right-0 h-1" :class="gateway.status === 'connected' ? 'bg-green-500' : gateway.status === 'setup_required' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
        
        <div class="flex items-start justify-between mb-4 mt-1">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center p-2">
              <Icon v-if="gateway.providerName === 'Stripe'" name="logos:stripe" class="w-full h-full object-contain" />
              <div v-else class="text-xl font-bold text-gray-400">P</div>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white" dir="ltr">{{ gateway.providerName }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', getGatewayStatusColor(gateway.status)]">
                  {{ getGatewayStatusLabel(gateway.status) }}
                </span>
                <span v-if="gateway.environment === 'test'" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 uppercase">Test Mode</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
          {{ gateway.description }}
        </p>

        <div class="flex flex-wrap gap-2 mb-5">
          <span v-for="method in gateway.supportedMethods" :key="method" class="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
            {{ method === 'card' ? 'بطاقات ائتمانية' : method === 'wallet' ? 'محافظ إلكترونية' : method }}
          </span>
        </div>

        <div class="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto justify-between">
          <div class="flex gap-2">
            <button @click="testConnection(gateway.id)" class="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 disabled:opacity-50">
              <Icon :name="testingId === gateway.id ? 'heroicons:arrow-path' : 'heroicons:signal'" :class="testingId === gateway.id ? 'animate-spin w-3.5 h-3.5' : 'w-3.5 h-3.5'" />
              {{ testingId === gateway.id ? 'جارٍ الاختبار...' : 'اختبار الاتصال' }}
            </button>
            <button class="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1.5">
              <Icon name="heroicons:cog-8-tooth" class="w-3.5 h-3.5" />
              الإعدادات
            </button>
          </div>
          <div class="text-[10px] text-gray-400" v-if="gateway.lastConnectionCheck">
            آخر فحص: {{ new Date(gateway.lastConnectionCheck).toLocaleDateString('ar-EG') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePayments } from '~/composables/usePayments'

const { store, getGatewayStatusColor, getGatewayStatusLabel } = usePayments()
const testingId = ref<string | null>(null)

const testConnection = async (id: string) => {
  if (testingId.value) return
  testingId.value = id
  const result = await store.testGatewayConnection(id)
  testingId.value = null
  
  if (result.success) {
    alert(result.message) // In real app, use a success toast
  } else {
    alert(result.message) // In real app, use an error toast
  }
}
</script>
