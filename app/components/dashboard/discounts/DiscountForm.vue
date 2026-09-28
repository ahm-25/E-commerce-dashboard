<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">المعلومات الأساسية</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">اسم الخصم <span class="text-danger">*</span></label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="مثال: خصم الصيف" 
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الوصف</label>
          <textarea 
            v-model="form.description" 
            placeholder="وصف مختصر للخصم يظهر للعملاء (اختياري)" 
            rows="3" 
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Discount Method & Type -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">نوع وطريقة الخصم</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">طريقة الخصم</label>
          <div class="flex gap-6 mt-3">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" v-model="form.method" value="coupon" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
              <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">كود خصم</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" v-model="form.method" value="automatic" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
              <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">خصم تلقائي</span>
            </label>
          </div>
          <div v-if="form.method === 'automatic'" class="mt-4 text-sm text-primary-navy dark:text-white bg-primary/10 border border-primary/20 p-3 rounded-lg flex gap-2 items-start">
            <Icon name="ph:info-bold" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>سيتم تطبيق الخصم تلقائيًا عند تحقق شروطه.</span>
          </div>
        </div>

        <div v-if="form.method === 'coupon'">
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">كود الخصم <span class="text-danger">*</span></label>
          <div class="flex gap-2">
            <input 
              v-model="form.code" 
              type="text" 
              placeholder="SUMMER25" 
              class="flex-1 uppercase bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
            />
            <button 
              @click="generateCode"
              class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
            >
              توليد كود
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">النوع</label>
          <select 
            v-model="form.type" 
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          >
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div v-if="form.type !== 'free_shipping'">
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">{{ form.type === 'percentage' ? 'النسبة المئوية' : 'قيمة الخصم' }} <span class="text-danger">*</span></label>
          <div class="relative">
            <input 
              v-model.number="form.value" 
              type="number" 
              :placeholder="form.type === 'percentage' ? '25' : '350'" 
              min="0"
              class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors pr-12"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-muted text-sm font-bold">{{ form.type === 'percentage' ? '%' : 'ج.م' }}</span>
            </div>
          </div>
        </div>

        <div v-if="form.type === 'percentage'">
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الحد الأقصى لقيمة الخصم (اختياري)</label>
          <div class="relative">
            <input 
              v-model.number="form.maxValue" 
              type="number" 
              placeholder="مثال: 500" 
              min="0"
              class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors pr-12"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-muted text-sm font-bold">ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Applies To -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">ينطبق على</h3>
      <div>
        <div class="flex flex-col gap-4 mt-3">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.scope" value="all" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">جميع المنتجات</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.scope" value="products" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">منتجات محددة</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.scope" value="categories" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">أقسام محددة</span>
          </label>
        </div>
      </div>
      
      <div v-if="form.scope === 'products'" class="mt-6 border-t border-border-light dark:border-border-dark pt-4">
        <ProductSelector v-model="form.selectedProducts" />
      </div>
      
      <div v-if="form.scope === 'categories'" class="mt-6 border-t border-border-light dark:border-border-dark pt-4">
        <CategorySelector v-model="form.selectedCategories" />
      </div>
    </div>

    <!-- Minimum Requirements & Eligibility -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">شروط الاستخدام والأهلية</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الحد الأدنى لقيمة الطلب (اختياري)</label>
          <div class="relative">
            <input 
              v-model.number="form.minOrderValue" 
              type="number" 
              placeholder="1000" 
              min="0"
              class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors pr-12"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-muted text-sm font-bold">ج.م</span>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الحد الأدنى لعدد المنتجات (اختياري)</label>
          <input 
            v-model.number="form.minQuantity" 
            type="number" 
            placeholder="2" 
            min="1"
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          />
        </div>
      </div>

      <div class="mb-6 pt-6 border-t border-border-light dark:border-border-dark">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">أهلية العملاء</label>
        <div class="flex flex-col gap-4 mt-3">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.customerEligibility" value="all" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">جميع العملاء</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.customerEligibility" value="specific" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">عملاء محددون</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.customerEligibility" value="new" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">عملاء جدد فقط</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="form.customerEligibility" value="returning" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
            <span class="text-sm font-medium text-primary-navy dark:text-white group-hover:text-primary transition-colors">العملاء العائدون</span>
          </label>
        </div>
      </div>
      
      <div v-if="form.customerEligibility === 'specific'" class="mb-6 border-t border-border-light dark:border-border-dark pt-4">
        <CustomerSelector v-model="form.selectedCustomers" />
      </div>

      <div class="pt-4 border-t border-border-light dark:border-border-dark">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.firstOrderOnly" class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary">
          <span class="text-sm font-bold text-primary-navy dark:text-white">للطلب الأول فقط</span>
        </label>
      </div>
    </div>

    <!-- Usage Limits -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">حدود الاستخدام</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">إجمالي مرات الاستخدام (اختياري)</label>
          <input 
            v-model.number="form.usageLimit" 
            type="number" 
            placeholder="500" 
            min="1"
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          />
        </div>
      </div>
      
      <div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.onePerCustomer" class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary">
          <span class="text-sm font-bold text-primary-navy dark:text-white">استخدام واحد لكل عميل</span>
        </label>
      </div>
    </div>

    <!-- Schedule -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">فترة الخصم</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">يبدأ في <span class="text-danger">*</span></label>
          <input 
            v-model="form.startDate" 
            type="datetime-local" 
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
          />
        </div>
        
        <div>
          <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">ينتهي في</label>
          <input 
            v-model="form.endDate" 
            type="datetime-local" 
            :disabled="form.noEndDate"
            class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      </div>
      
      <div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.noEndDate" class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary">
          <span class="text-sm font-bold text-primary-navy dark:text-white">بدون تاريخ انتهاء</span>
        </label>
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
