<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="store.isAdjustmentDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="store.isAdjustmentDialogOpen = false"></div>
      <div class="relative bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-surface dark:bg-surface-dark shrink-0">
          <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">تعديل المخزون</h2>
          <button 
            @click="store.isAdjustmentDialogOpen = false"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-muted transition-colors"
          >
            <Icon name="ph:x-bold" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto" v-if="store.actionTarget">
          <div class="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border-light dark:border-border-dark">
            <div class="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="store.actionTarget.productImage" :src="store.actionTarget.productImage" class="w-full h-full object-cover">
              <Icon v-else name="ph:package" class="w-6 h-6 text-muted" />
            </div>
            <div>
              <div class="font-bold text-primary-navy dark:text-white">{{ store.actionTarget.productName }}</div>
              <div class="text-sm text-muted mt-0.5">SKU: <span class="font-mono text-primary-navy dark:text-white">{{ store.actionTarget.sku }}</span></div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-surface dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark text-center">
              <div class="text-xs text-muted font-bold mb-1">المخزون الحالي</div>
              <div class="text-xl font-black text-primary-navy dark:text-white">{{ store.actionTarget.currentStock }}</div>
            </div>
            <div class="bg-surface dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark text-center">
              <div class="text-xs text-muted font-bold mb-1">محجوز</div>
              <div class="text-xl font-black text-muted">{{ store.actionTarget.reservedStock }}</div>
            </div>
            <div class="bg-surface dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark text-center">
              <div class="text-xs text-muted font-bold mb-1">متاح</div>
              <div class="text-xl font-black text-success">{{ store.actionTarget.availableStock }}</div>
            </div>
          </div>

          <form @submit.prevent="submitAdjustment" class="flex flex-col gap-5">
            <div>
              <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">نوع العملية</label>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  type="button" 
                  @click="form.type = 'add'"
                  class="p-3 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  :class="form.type === 'add' ? 'border-success bg-success/10 text-success' : 'border-border-light dark:border-border-dark text-muted hover:border-success'"
                >
                  <Icon name="ph:plus" class="w-4 h-4" />
                  إضافة
                </button>
                <button 
                  type="button" 
                  @click="form.type = 'subtract'"
                  class="p-3 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  :class="form.type === 'subtract' ? 'border-danger bg-danger/10 text-danger' : 'border-border-light dark:border-border-dark text-muted hover:border-danger'"
                >
                  <Icon name="ph:minus" class="w-4 h-4" />
                  خصم
                </button>
                <button 
                  type="button" 
                  @click="form.type = 'set'"
                  class="p-3 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  :class="form.type === 'set' ? 'border-primary bg-primary/10 text-primary' : 'border-border-light dark:border-border-dark text-muted hover:border-primary'"
                >
                  <Icon name="ph:equals" class="w-4 h-4" />
                  تعيين
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الكمية</label>
              <input 
                v-model.number="form.quantity"
                type="number" 
                min="0"
                class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">سبب التعديل</label>
              <select 
                v-model="form.reason"
                class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
                required
              >
                <option value="received">استلام شحنة جديدة</option>
                <option value="sale">بيع يدوي</option>
                <option value="damage">تلف</option>
                <option value="loss">فقدان</option>
                <option value="inventory">جرد</option>
                <option value="correction">تصحيح مخزون</option>
                <option value="return">مرتجع</option>
                <option value="other">سبب آخر</option>
              </select>
            </div>
            
            <div v-if="form.reason === 'other'">
              <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">ملاحظات</label>
              <textarea 
                v-model="form.note"
                rows="3" 
                class="w-full bg-surface-50 dark:bg-surface-dark-hover border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
                placeholder="أدخل الملاحظات أو التفاصيل..."
              ></textarea>
            </div>

            <!-- Preview -->
            <div class="mt-4 p-4 rounded-xl flex items-center justify-between" :class="preview.color">
              <span class="text-sm font-bold">المخزون بعد التعديل:</span>
              <div class="flex items-center gap-2">
                <span class="text-muted line-through">{{ store.actionTarget.currentStock }}</span>
                <Icon name="ph:arrow-left-bold" class="w-4 h-4 text-muted" />
                <span class="text-xl font-black">{{ preview.newStock }}</span>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 shrink-0">
          <button 
            @click="store.isAdjustmentDialogOpen = false" 
            class="flex-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            إلغاء
          </button>
          <button 
            @click="submitAdjustment"
            :disabled="saving || !form.quantity" 
            class="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {{ saving ? 'جاري الحفظ...' : 'تأكيد التعديل' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '~/stores/inventory'

const store = useInventoryStore()
const saving = ref(false)

const form = ref({
  type: 'add' as 'add' | 'subtract' | 'set',
  quantity: 0,
  reason: 'received',
  note: ''
})

const preview = computed(() => {
  if (!store.actionTarget) return { newStock: 0, color: '' }
  let newStock = store.actionTarget.currentStock
  if (form.value.type === 'add') {
    newStock += form.value.quantity || 0
    return { newStock, color: 'bg-success/10 text-success border border-success/20' }
  }
  if (form.value.type === 'subtract') {
    newStock = Math.max(0, newStock - (form.value.quantity || 0))
    return { newStock, color: 'bg-danger/10 text-danger border border-danger/20' }
  }
  newStock = form.value.quantity || 0
  return { newStock, color: 'bg-primary/10 text-primary border border-primary/20' }
})

const submitAdjustment = async () => {
  if (!store.actionTarget || !form.value.quantity) return
  saving.value = true
  await store.adjustStock(
    store.actionTarget.id,
    form.value.quantity,
    form.value.type,
    form.value.reason,
    form.value.note
  )
  saving.value = false
  store.isAdjustmentDialogOpen = false
  store.actionTarget = null
  
  // Reset form
  form.value = {
    type: 'add',
    quantity: 0,
    reason: 'received',
    note: ''
  }
  alert('تم تحديث المخزون بنجاح')
}
</script>
