<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <NuxtLink to="/dashboard/discounts" class="hover:text-primary transition-colors">العروض والخصومات</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">إنشاء خصم</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">إنشاء خصم جديد</h1>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <NuxtLink 
            to="/dashboard/discounts"
            class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm"
          >
            إلغاء
          </NuxtLink>
          <button 
            @click="saveDiscount"
            :disabled="saving"
            class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
          >
            {{ saving ? 'جاري الحفظ...' : 'حفظ الخصم' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="xl:col-span-2">
          <DiscountForm v-model="form" />
        </div>

        <!-- Sidebar Preview -->
        <div class="xl:col-span-1">
          <DiscountPreviewCard :form="form" />
        </div>
      </div>
      
      <!-- Mobile Sticky Actions -->
      <div class="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NuxtLink 
          to="/dashboard/discounts"
          class="flex-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          إلغاء
        </NuxtLink>
        <button 
          @click="saveDiscount"
          :disabled="saving"
          class="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
        >
          {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDiscountsStore } from '~/stores/discounts'
import DiscountForm from '~/components/dashboard/discounts/DiscountForm.vue'
import DiscountPreviewCard from '~/components/dashboard/discounts/DiscountPreviewCard.vue'

const store = useDiscountsStore()
const router = useRouter()
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  method: 'coupon',
  code: '',
  type: 'percentage',
  value: null,
  maxValue: null,
  scope: 'all',
  selectedProducts: [],
  selectedCategories: [],
  customerEligibility: 'all',
  selectedCustomers: [],
  minOrderValue: null,
  minQuantity: null,
  firstOrderOnly: false,
  usageLimit: null,
  onePerCustomer: false,
  startDate: new Date().toISOString().slice(0, 16),
  endDate: '',
  noEndDate: false
})

const saveDiscount = async () => {
  // Validation
  if (!form.value.name) {
    alert('يرجى إدخال اسم الخصم')
    return
  }
  
  if (form.value.method === 'coupon' && !form.value.code) {
    alert('يرجى إدخال كود الخصم')
    return
  }

  if (form.value.type !== 'free_shipping' && (!form.value.value || form.value.value <= 0)) {
    alert('يرجى إدخال قيمة خصم صحيحة')
    return
  }

  saving.value = true
  try {
    await store.createDiscount(form.value)
    router.push('/dashboard/discounts')
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ الخصم')
  } finally {
    saving.value = false
  }
}
</script>
