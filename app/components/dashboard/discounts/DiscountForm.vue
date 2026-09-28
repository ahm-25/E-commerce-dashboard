<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">المعلومات الأساسية</h3>
      <div class="space-y-4">
        <UFormGroup label="اسم الخصم" required>
          <UInput v-model="form.name" placeholder="مثال: خصم الصيف" />
        </UFormGroup>
        <UFormGroup label="الوصف">
          <UTextarea v-model="form.description" placeholder="وصف مختصر للخصم يظهر للعملاء (اختياري)" rows="3" />
        </UFormGroup>
      </div>
    </div>

    <!-- Discount Method & Type -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">نوع وطريقة الخصم</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <UFormGroup label="طريقة الخصم">
          <div class="flex gap-4">
            <URadio v-model="form.method" value="coupon" label="كود خصم" />
            <URadio v-model="form.method" value="automatic" label="خصم تلقائي" />
          </div>
          <div v-if="form.method === 'automatic'" class="mt-2 text-sm text-text-muted dark:text-text-muted-dark bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-2 items-start">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <span>سيتم تطبيق الخصم تلقائيًا عند تحقق شروطه.</span>
          </div>
        </UFormGroup>

        <UFormGroup v-if="form.method === 'coupon'" label="كود الخصم" required>
          <div class="flex gap-2">
            <UInput v-model="form.code" placeholder="SUMMER25" class="flex-1" />
            <UButton color="gray" variant="solid" class="bg-white dark:bg-surface-dark" @click="generateCode">توليد كود</UButton>
          </div>
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="النوع">
          <USelectMenu v-model="form.type" :options="typeOptions" value-attribute="value" option-attribute="label" />
        </UFormGroup>

        <UFormGroup v-if="form.type !== 'free_shipping'" :label="form.type === 'percentage' ? 'النسبة المئوية' : 'قيمة الخصم'" required>
          <UInput v-model.number="form.value" type="number" :placeholder="form.type === 'percentage' ? '25' : '350'" min="0">
            <template #trailing>
              <span class="text-text-muted dark:text-text-muted-dark text-sm">{{ form.type === 'percentage' ? '%' : 'ج.م' }}</span>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup v-if="form.type === 'percentage'" label="الحد الأقصى لقيمة الخصم (اختياري)">
          <UInput v-model.number="form.maxValue" type="number" placeholder="مثال: 500" min="0">
            <template #trailing>
              <span class="text-text-muted dark:text-text-muted-dark text-sm">ج.م</span>
            </template>
          </UInput>
        </UFormGroup>
      </div>
    </div>

    <!-- Applies To -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">ينطبق على</h3>
      <UFormGroup>
        <div class="flex flex-col gap-3 mb-4">
          <URadio v-model="form.scope" value="all" label="جميع المنتجات" />
          <URadio v-model="form.scope" value="products" label="منتجات محددة" />
          <URadio v-model="form.scope" value="categories" label="أقسام محددة" />
        </div>
      </UFormGroup>
      
      <div v-if="form.scope === 'products'" class="mt-4">
        <ProductSelector v-model="form.selectedProducts" />
      </div>
      
      <div v-if="form.scope === 'categories'" class="mt-4">
        <CategorySelector v-model="form.selectedCategories" />
      </div>
    </div>

    <!-- Minimum Requirements & Eligibility -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">شروط الاستخدام والأهلية</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <UFormGroup label="الحد الأدنى لقيمة الطلب (اختياري)">
          <UInput v-model.number="form.minOrderValue" type="number" placeholder="1000" min="0">
            <template #trailing>
              <span class="text-text-muted dark:text-text-muted-dark text-sm">ج.م</span>
            </template>
          </UInput>
        </UFormGroup>
        
        <UFormGroup label="الحد الأدنى لعدد المنتجات (اختياري)">
          <UInput v-model.number="form.minQuantity" type="number" placeholder="2" min="1" />
        </UFormGroup>
      </div>

      <div class="mb-6">
        <UFormGroup label="أهلية العملاء">
          <div class="flex flex-col gap-3 mt-2">
            <URadio v-model="form.customerEligibility" value="all" label="جميع العملاء" />
            <URadio v-model="form.customerEligibility" value="specific" label="عملاء محددون" />
            <URadio v-model="form.customerEligibility" value="new" label="عملاء جدد فقط" />
            <URadio v-model="form.customerEligibility" value="returning" label="العملاء العائدون" />
          </div>
        </UFormGroup>
      </div>
      
      <div v-if="form.customerEligibility === 'specific'" class="mb-6">
        <CustomerSelector v-model="form.selectedCustomers" />
      </div>

      <div>
        <UCheckbox v-model="form.firstOrderOnly" label="للطلب الأول فقط" />
      </div>
    </div>

    <!-- Usage Limits -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">حدود الاستخدام</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <UFormGroup label="إجمالي مرات الاستخدام (اختياري)">
          <UInput v-model.number="form.usageLimit" type="number" placeholder="500" min="1" />
        </UFormGroup>
      </div>
      
      <div>
        <UCheckbox v-model="form.onePerCustomer" label="استخدام واحد لكل عميل" />
      </div>
    </div>

    <!-- Schedule -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-text dark:text-text-dark mb-4">فترة الخصم</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <UFormGroup label="يبدأ في" required>
          <UInput v-model="form.startDate" type="datetime-local" />
        </UFormGroup>
        
        <UFormGroup label="ينتهي في">
          <UInput v-model="form.endDate" type="datetime-local" :disabled="form.noEndDate" />
        </UFormGroup>
      </div>
      
      <div>
        <UCheckbox v-model="form.noEndDate" label="بدون تاريخ انتهاء" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ProductSelector from '~/components/dashboard/ProductSelector.vue'
import CategorySelector from '~/components/dashboard/CategorySelector.vue'
import CustomerSelector from '~/components/dashboard/CustomerSelector.vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const form = ref({ ...props.modelValue })

watch(form, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

watch(() => props.modelValue, (newVal) => {
  // Update internal form if prop changes externally
  Object.assign(form.value, newVal)
}, { deep: true })

watch(() => form.value.noEndDate, (newVal) => {
  if (newVal) form.value.endDate = ''
})

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.code = result
}

const typeOptions = [
  { label: 'نسبة مئوية', value: 'percentage' },
  { label: 'مبلغ ثابت', value: 'fixed' },
  { label: 'شحن مجاني', value: 'free_shipping' },
]
</script>
