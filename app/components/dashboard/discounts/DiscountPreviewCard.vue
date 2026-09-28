<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden sticky top-6">
    <div class="p-4 border-b border-border-light dark:border-border-dark bg-surface-50 dark:bg-surface-dark-hover">
      <h3 class="font-bold text-text dark:text-text-dark">معاينة الخصم</h3>
    </div>
    
    <div class="p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-ticket" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-bold text-lg text-text dark:text-text-dark">{{ form.name || 'اسم الخصم' }}</h4>
          <div class="text-sm text-text-muted dark:text-text-muted-dark">
            <template v-if="form.method === 'automatic'">خصم تلقائي</template>
            <template v-else-if="form.code">{{ form.code }}</template>
            <template v-else>كود الخصم</template>
          </div>
        </div>
      </div>
      
      <div class="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg mb-6 text-center">
        <div class="text-3xl font-bold text-primary mb-1">
          <template v-if="form.type === 'percentage'">{{ form.value || 0 }}%</template>
          <template v-else-if="form.type === 'fixed'">{{ form.value || 0 }} ج.م</template>
          <template v-else>شحن مجاني</template>
        </div>
        <div class="text-sm text-primary/80 font-medium">قيمة الخصم</div>
      </div>
      
      <div class="space-y-4 text-sm">
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-text-muted dark:text-text-muted-dark">النطاق</span>
          <span class="font-medium text-text dark:text-text-dark text-left">
            <template v-if="form.scope === 'all'">جميع المنتجات</template>
            <template v-else-if="form.scope === 'products'">منتجات محددة</template>
            <template v-else-if="form.scope === 'categories'">أقسام محددة</template>
          </span>
        </div>
        
        <div v-if="form.minOrderValue" class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-text-muted dark:text-text-muted-dark">الحد الأدنى للطلب</span>
          <span class="font-medium text-text dark:text-text-dark text-left">{{ form.minOrderValue }} ج.م</span>
        </div>
        
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-text-muted dark:text-text-muted-dark">صالح من</span>
          <span class="font-medium text-text dark:text-text-dark text-left">{{ formatDate(form.startDate) || 'اليوم' }}</span>
        </div>
        
        <div class="flex justify-between items-start pb-4 border-b border-border-light dark:border-border-dark">
          <span class="text-text-muted dark:text-text-muted-dark">حتى</span>
          <span class="font-medium text-text dark:text-text-dark text-left">{{ formatDate(form.endDate) || 'بدون تاريخ انتهاء' }}</span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="text-text-muted dark:text-text-muted-dark">الحالة المتوقعة</span>
          <UBadge :color="expectedStatusColor" variant="subtle" class="font-medium">
            {{ expectedStatusLabel }}
          </UBadge>
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
  if (label === 'مجدول') return 'blue'
  if (label === 'منتهي') return 'gray'
  return 'green'
})
</script>
