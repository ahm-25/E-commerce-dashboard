<template>
  <aside class="flex flex-col gap-6 xl:sticky xl:top-0">
    <!-- Payment & status -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm">الدفع والحالة</h2>
      <div>
        <label :class="labelClass">طريقة الدفع</label>
        <select v-model="form.paymentMethod" :class="inputClass">
          <option v-for="m in PAYMENT_METHODS" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
      <div>
        <label :class="labelClass">حالة الدفع</label>
        <select v-model="form.paymentStatus" :disabled="form.paymentMethod === 'cod'" :class="inputClass">
          <option value="pending">لم يُدفع بعد</option>
          <option value="paid">مدفوع</option>
        </select>
        <p v-if="form.paymentMethod === 'cod'" class="text-xs text-muted mt-1">الدفع عند الاستلام بيتسجل مدفوع لما الطلب يتسلم</p>
      </div>
      <div>
        <label :class="labelClass">حالة الطلب</label>
        <select v-model="form.status" :class="inputClass">
          <option value="new">جديد</option>
          <option value="processing">قيد التجهيز</option>
        </select>
      </div>
      <div>
        <label :class="labelClass">ملاحظة داخلية</label>
        <textarea v-model="form.internalNote" rows="2" placeholder="مش بتظهر للعميل" :class="inputClass"></textarea>
      </div>
    </section>

    <!-- Totals -->
    <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm">ملخص الطلب</h2>

      <div>
        <label :class="labelClass">خصم</label>
        <div class="flex gap-2">
          <input v-model.number="form.discountValue" type="number" min="0" :max="form.discountType === 'percentage' ? 100 : undefined" aria-label="قيمة الخصم" :class="[inputClass, 'flex-1 min-w-0']" />
          <select v-model="form.discountType" aria-label="نوع الخصم" :class="[fieldClass, 'w-24 shrink-0']">
            <option value="fixed">{{ currency }}</option>
            <option value="percentage">%</option>
          </select>
        </div>
      </div>

      <dl class="flex flex-col gap-2 text-sm border-t border-border-light dark:border-border-dark pt-4">
        <div class="flex justify-between"><dt class="text-muted">المجموع الفرعي</dt><dd class="font-bold text-primary-navy dark:text-white tabular-nums">{{ money(subtotal) }}</dd></div>
        <div v-if="discount" class="flex justify-between"><dt class="text-muted">الخصم</dt><dd class="font-bold text-success tabular-nums">- {{ money(discount) }}</dd></div>
        <div class="flex justify-between">
          <dt class="text-muted">الشحن</dt>
          <dd class="font-bold text-primary-navy dark:text-white tabular-nums">{{ form.pickup ? 'استلام' : selectedRate ? (shippingCost ? money(shippingCost) : 'مجاني') : '—' }}</dd>
        </div>
        <div v-if="tax.amount" class="flex justify-between">
          <dt class="text-muted">{{ tax.included ? `منها ضريبة ${tax.rate}%` : `ضريبة ${tax.rate}%` }}</dt>
          <dd class="font-bold text-primary-navy dark:text-white tabular-nums">{{ money(tax.amount) }}</dd>
        </div>
        <div class="flex justify-between border-t border-border-light dark:border-border-dark pt-3 mt-1 text-base">
          <dt class="font-black text-primary-navy dark:text-white">الإجمالي</dt>
          <dd class="font-black text-primary-navy dark:text-white tabular-nums">{{ money(total) }}</dd>
        </div>
      </dl>

      <ul v-if="showProblems && problems.length" class="text-xs text-danger font-bold flex flex-col gap-1 bg-danger/5 rounded-lg p-3" role="alert">
        <li v-for="p in problems" :key="p" class="flex items-center gap-1.5">
          <Icon name="ph:warning-circle" class="w-4 h-4 shrink-0" />
          {{ p }}
        </li>
      </ul>

      <button
        type="button"
        @click="create"
        :disabled="saving"
        class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
      >
        {{ saving ? 'جاري إنشاء الطلب...' : `إنشاء الطلب · ${money(total)}` }}
      </button>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useManualOrder, PAYMENT_METHODS } from '~/composables/useManualOrder'

const emit = defineEmits<{ created: [id: string] }>()

const { form, subtotal, discount, selectedRate, shippingCost, tax, total, problems, submit, currency } = useManualOrder()

// Show missing fields only after the first save attempt
const showProblems = ref(false)
const saving = ref(false)

const money = (v: number) => `${v.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currency}`

const create = async () => {
  showProblems.value = true
  if (problems.value.length) return
  saving.value = true
  try {
    const order = await submit()
    emit('created', order.id)
  } catch (err: any) {
    alert(err.message || 'تعذر إنشاء الطلب')
  } finally {
    saving.value = false
  }
}

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
// Without a width, so it can be sized per field
const fieldClass = 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors disabled:opacity-60'
const inputClass = `w-full ${fieldClass}`
</script>
