<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <span>/</span>
            <NuxtLink to="/dashboard/discounts" class="hover:text-primary transition-colors">العروض والخصومات</NuxtLink>
            <span>/</span>
            <span class="text-text dark:text-text-dark font-medium">إنشاء خصم</span>
          </div>
          <h1 class="text-2xl font-bold text-text dark:text-text-dark">إنشاء خصم جديد</h1>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <UButton color="gray" variant="ghost" to="/dashboard/discounts">إلغاء</UButton>
          <UButton color="primary" variant="solid" :loading="saving" @click="saveDiscount">حفظ الخصم</UButton>
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
        <UButton color="gray" variant="ghost" block class="flex-1" to="/dashboard/discounts">إلغاء</UButton>
        <UButton color="primary" variant="solid" block class="flex-1" :loading="saving" @click="saveDiscount">حفظ</UButton>
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
