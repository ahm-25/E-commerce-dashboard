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
            <span class="text-text dark:text-text-dark font-medium">تعديل الخصم</span>
          </div>
          <h1 class="text-2xl font-bold text-text dark:text-text-dark">تعديل: {{ form.name || 'جاري التحميل...' }}</h1>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
                    <NuxtLink to="/dashboard/discounts" class="inline-flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">إلغاء</NuxtLink>
          <button :disabled="loading || saving" @click="saveDiscount" class="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]">
            {{ saving ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="ph:spinner-gap" class="w-8 h-8 animate-spin text-primary" />
      </div>
      
      <div v-else-if="error" class="p-12 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
      <div v-if="!loading && !error" class="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <NuxtLink to="/dashboard/discounts" class="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">إلغاء</NuxtLink>
        <button :disabled="saving" @click="saveDiscount" class="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50">
          {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDiscountsStore } from '~/stores/discounts'
import DiscountForm from '~/components/dashboard/discounts/DiscountForm.vue'
import DiscountPreviewCard from '~/components/dashboard/discounts/DiscountPreviewCard.vue'

const store = useDiscountsStore()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

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
  startDate: '',
  endDate: '',
  noEndDate: false
})

onMounted(async () => {
  loading.value = true
  const id = route.params.id as string
  try {
    const discount = await store.fetchDiscount(id)
    if (!discount) throw new Error('الخصم غير موجود')
    
    // Map API model to Form model
    form.value = {
      ...form.value,
      ...discount,
      startDate: discount.startDate ? discount.startDate.slice(0, 16) : '',
      endDate: discount.endDate ? discount.endDate.slice(0, 16) : '',
      noEndDate: !discount.endDate
    }
  } catch (err: any) {
    error.value = err.message || 'تعذر تحميل بيانات الخصم'
  } finally {
    loading.value = false
  }
})

const saveDiscount = async () => {
  // Validation (same as create)
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
    await store.updateDiscount(route.params.id as string, form.value)
    router.push('/dashboard/discounts')
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء تحديث الخصم')
  } finally {
    saving.value = false
  }
}
</script>
