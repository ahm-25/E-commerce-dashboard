<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden sticky top-6">
    <div class="p-4 border-b border-border-light dark:border-border-dark bg-surface-50 dark:bg-surface-dark-hover">
      <h3 class="font-bold text-primary-navy dark:text-white font-ibm">معاينة الخصم</h3>
    </div>
    
    <div class="p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon name="ph:ticket-bold" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-bold text-lg text-primary-navy dark:text-white">{{ form.name || 'اسم الخصم' }}</h4>
          <div class="text-sm text-muted">
            <template v-if="form.method === 'automatic'">خصم تلقائي</template>
            <template v-else-if="form.code">{{ form.code }}</template>
            <template v-else>كود الخصم</template>
          </div>
        </div>
      </div>
      
      <div class="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg mb-6 text-center">
        <div class="text-3xl font-black text-primary font-ibm mb-1">
          <template v-if="form.type === 'percentage'">{{ form.value || 0 }}%</template>
          <template v-else-if="form.type === 'fixed'">{{ form.value || 0 }} ج.م</template>
          <template v-else>شحن مجاني</template>
        </div>
        <div class="text-sm text-primary/80 font-bold">قيمة الخصم</div>
      </div>
      
      <div class="space-y-4 text-sm font-bold">
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-muted">النطاق</span>
          <span class="text-primary-navy dark:text-white text-left">
            <template v-if="form.scope === 'all'">جميع المنتجات</template>
            <template v-else-if="form.scope === 'products'">منتجات محددة</template>
            <template v-else-if="form.scope === 'categories'">أقسام محددة</template>
          </span>
        </div>
        
        <div v-if="form.minOrderValue" class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-muted">الحد الأدنى للطلب</span>
          <span class="text-primary-navy dark:text-white text-left">{{ form.minOrderValue }} ج.م</span>
        </div>
        
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-muted">صالح من</span>
          <span class="text-primary-navy dark:text-white text-left">{{ formatDate(form.startDate) || 'اليوم' }}</span>
        </div>
        
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-muted">حتى</span>
          <span class="text-primary-navy dark:text-white text-left">{{ formatDate(form.endDate) || 'بدون تاريخ انتهاء' }}</span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="text-muted">الحالة المتوقعة</span>
          <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', expectedStatusColor]">
            {{ expectedStatusLabel }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  form: any
}>()

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const expectedStatusLabel = computed(() => {
  if (!props.form.startDate) return 'نشط'
  const start = new Date(props.form.startDate)
  const end = props.form.endDate ? new Date(props.form.endDate) : null
  const now = new Date()
  
  if (start > now) return 'مجدول'
  if (end && end < now) return 'منتهي'
  return 'نشط'
})

const expectedStatusColor = computed(() => {
  const label = expectedStatusLabel.value
  if (label === 'مجدول') return 'bg-info/10 text-info'
  if (label === 'منتهي') return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return 'bg-success/10 text-success'
})
</script>
