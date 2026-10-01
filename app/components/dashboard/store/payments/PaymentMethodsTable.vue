<template>
  <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-right">
        <thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-4 py-3 font-medium w-12">الترتيب</th>
            <th class="px-4 py-3 font-medium">طريقة الدفع</th>
            <th class="px-4 py-3 font-medium">النوع</th>
            <th class="px-4 py-3 font-medium">الرسوم</th>
            <th class="px-4 py-3 font-medium">الحالة</th>
            <th class="px-4 py-3 font-medium w-16">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-if="store.loading" v-for="i in 4" :key="i" class="animate-pulse">
            <td class="px-4 py-4"><div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </td>
            <td class="px-4 py-4"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
            <td class="px-4 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
            <td class="px-4 py-4"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
            <td class="px-4 py-4"><div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
          </tr>
          
          <tr v-else-if="store.paymentMethods.length === 0">
            <td colspan="6" class="px-4 py-16 text-center text-gray-500">
              <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                  <Icon name="heroicons:credit-card" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p class="text-base font-semibold text-gray-900 dark:text-white">لا توجد طرق دفع</p>
                <p class="text-sm mt-1 mb-5 text-gray-500">أضف طريقة دفع ليتمكن عملاؤك من إتمام طلباتهم.</p>
                <button class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                  + إضافة طريقة دفع
                </button>
              </div>
            </td>
          </tr>

          <tr v-for="method in store.paymentMethods" :key="method.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
            <td class="px-4 py-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
              <Icon name="heroicons:bars-2" class="w-5 h-5" />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex flex-shrink-0 items-center justify-center text-gray-500">
                  <Icon :name="getIconForType(method.type)" class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {{ method.name }}
                    <span v-if="method.isDefault" class="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-900/50 dark:text-blue-400 px-1.5 py-0.5 rounded">افتراضية</span>
                  </div>
                  <div v-if="method.provider" class="text-xs text-gray-500 mt-0.5" dir="ltr">{{ method.provider }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {{ getMethodTypeLabel(method.type) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
              {{ formatFees(method.fees) }}
            </td>
            <td class="px-4 py-3">
              <span :class="['inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border', getMethodStatusColor(method.status)]">
                <span v-if="method.status === 'active'" class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span v-else-if="method.status === 'inactive'" class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span v-else-if="method.status === 'setup_required'" class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {{ getMethodStatusLabel(method.status) }}
              </span>
            </td>
            <td class="px-4 py-3 relative">
              <button @click="toggleMenu(method.id)" class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors">
                <Icon name="heroicons:ellipsis-horizontal" class="w-5 h-5" />
              </button>
              
              <div v-if="activeMenuId === method.id" class="absolute left-4 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1">
                <button @click="handleAction('edit', method.id)" class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Icon name="heroicons:cog-8-tooth" class="w-4 h-4 text-gray-400" />
                  إعداد
                </button>
                <button v-if="method.status !== 'active'" @click="handleAction('enable', method.id)" class="w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Icon name="heroicons:check-circle" class="w-4 h-4" />
                  تفعيل
                </button>
                <button v-if="method.status === 'active'" @click="handleAction('disable', method.id)" class="w-full text-right px-4 py-2 text-sm text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Icon name="heroicons:pause-circle" class="w-4 h-4" />
                  تعطيل
                </button>
                <button v-if="!method.isDefault" @click="handleAction('default', method.id)" class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Icon name="heroicons:star" class="w-4 h-4 text-gray-400" />
                  تعيين كافتراضي
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePayments } from '~/composables/usePayments'

const { store, formatFees, getMethodTypeLabel, getMethodStatusColor, getMethodStatusLabel } = usePayments()

const getIconForType = (type: string) => {
  switch (type) {
    case 'cod': return 'heroicons:truck'
    case 'card': return 'heroicons:credit-card'
    case 'wallet': return 'heroicons:device-phone-mobile'
    case 'bank_transfer': return 'heroicons:building-library'
    default: return 'heroicons:banknotes'
  }
}

const activeMenuId = ref<string | null>(null)

const toggleMenu = (id: string) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null
  } else {
    activeMenuId.value = id
  }
}

const closeMenu = () => {
  activeMenuId.value = null
}

const handleClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleAction = async (action: string, id: string) => {
  closeMenu()
  
  if (action === 'enable') {
    if (confirm('هل تريد تفعيل طريقة الدفع هذه للعملاء؟')) {
      await store.togglePaymentMethod(id, true)
      alert('تم تفعيل طريقة الدفع بنجاح.')
    }
  } else if (action === 'disable') {
    if (confirm('تعطيل طريقة الدفع؟\nلن تظهر طريقة الدفع هذه للعملاء أثناء إتمام الطلب.')) {
      await store.togglePaymentMethod(id, false)
      alert('تم تعطيل طريقة الدفع.')
    }
  } else if (action === 'default') {
    if (confirm('تغيير طريقة الدفع الافتراضية؟\nسيتم استخدام هذه الطريقة كخيار افتراضي للعملاء.')) {
      await store.setDefaultMethod(id)
    }
  } else if (action === 'edit') {
    alert('سينتقل إلى صفحة الإعدادات الخاصة بالطريقة المختارة.')
  }
}
</script>
