<template>
  <Teleport to="body">
    <div
      v-if="store.isZoneDialogOpen && form"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      @click="close"
    >
      <div
        class="bg-white dark:bg-surface-dark w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        dir="rtl"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
          <h2 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">
            {{ isEditing ? 'تعديل منطقة الشحن' : 'إضافة منطقة شحن' }}
          </h2>
          <button
            @click="close"
            class="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-danger transition-colors shadow-sm"
          >
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex flex-col gap-6">
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">اسم المنطقة <span class="text-danger">*</span></label>
            <input v-model="form.name" type="text" placeholder="مثال: القاهرة الكبرى" :class="inputClass" />
            <p class="text-xs text-muted mt-1.5">للاستخدام الداخلي فقط، لا يظهر للعملاء</p>
          </div>

          <!-- Regions -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-bold text-primary-navy dark:text-white">
                المحافظات <span class="text-danger">*</span>
                <span class="text-muted font-semibold">({{ form.regions.length }} محددة)</span>
              </label>
              <button
                v-if="availableRegions.length > 0"
                type="button"
                @click="toggleAllAvailable"
                class="text-xs font-bold text-primary hover:underline"
              >
                {{ allAvailableSelected ? 'إلغاء تحديد الكل' : 'تحديد كل المتاح' }}
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto border border-border-light dark:border-border-dark rounded-lg p-3">
              <label
                v-for="region in EGYPT_GOVERNORATES"
                :key="region"
                class="flex items-center gap-2 text-sm rounded-md px-2 py-1.5 transition-colors"
                :class="regionOwner(region) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'"
                :title="regionOwner(region) ? `تابعة لمنطقة: ${regionOwner(region)}` : undefined"
              >
                <input
                  v-model="form.regions"
                  type="checkbox"
                  :value="region"
                  :disabled="!!regionOwner(region)"
                  class="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                />
                <span class="text-primary-navy dark:text-white font-medium truncate">{{ region }}</span>
              </label>
            </div>
            <p class="text-xs text-muted mt-1.5">المحافظات الباهتة تابعة لمنطقة شحن أخرى</p>
          </div>

          <!-- Rates -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-bold text-primary-navy dark:text-white">أسعار الشحن</label>
              <button type="button" @click="addRate" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <Icon name="ph:plus-bold" class="w-3.5 h-3.5" />
                إضافة سعر
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <div
                v-for="(rate, index) in form.rates"
                :key="rate.id"
                class="border border-border-light dark:border-border-dark rounded-lg p-4 flex flex-col gap-3"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label :class="labelClass">اسم الخيار</label>
                      <input v-model="rate.name" type="text" placeholder="توصيل عادي" :class="inputClass" />
                    </div>
                    <div>
                      <label :class="labelClass">طريقة الحساب</label>
                      <select v-model="rate.type" :class="inputClass">
                        <option value="flat">سعر ثابت</option>
                        <option value="weight">حسب الوزن</option>
                        <option value="free">مجاني</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="form.rates.splice(index, 1)"
                    class="w-8 h-8 mt-6 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
                    title="حذف السعر"
                  >
                    <Icon name="ph:trash-bold" class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <template v-if="rate.type !== 'free'">
                    <div>
                      <label :class="labelClass">{{ rate.type === 'weight' ? 'السعر الأساسي (ج.م)' : 'السعر (ج.م)' }}</label>
                      <input v-model.number="rate.price" type="number" min="0" :class="inputClass" />
                    </div>
                    <template v-if="rate.type === 'weight'">
                      <div>
                        <label :class="labelClass">يشمل حتى (كجم)</label>
                        <input v-model.number="rate.includedKg" type="number" min="0" step="0.5" :class="inputClass" />
                      </div>
                      <div>
                        <label :class="labelClass">كل كجم إضافي (ج.م)</label>
                        <input v-model.number="rate.pricePerKg" type="number" min="0" :class="inputClass" />
                      </div>
                    </template>
                    <div>
                      <label :class="labelClass">مجاني فوق (ج.م)</label>
                      <input v-model.number="rate.freeAbove" type="number" min="0" placeholder="اختياري" :class="inputClass" />
                    </div>
                  </template>
                  <div>
                    <label :class="labelClass">من (يوم)</label>
                    <input v-model.number="rate.minDays" type="number" min="0" :class="inputClass" />
                  </div>
                  <div>
                    <label :class="labelClass">إلى (يوم)</label>
                    <input v-model.number="rate.maxDays" type="number" min="0" :class="inputClass" />
                  </div>
                </div>
              </div>

              <div v-if="form.rates.length === 0" class="border border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center text-sm text-muted">
                أضف سعر شحن واحد على الأقل
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
          <button
            @click="close"
            :disabled="saving"
            class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
          >
            {{ saving ? 'جاري الحفظ...' : 'حفظ المنطقة' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, toRaw } from 'vue'
import { useShippingStore, EGYPT_GOVERNORATES, type ShippingZone, type ShippingRate } from '~/stores/shipping'

const store = useShippingStore()

const form = ref<ShippingZone | null>(null)
const saving = ref(false)

const isEditing = computed(() => !!store.zoneToEdit)

const newRate = (): ShippingRate => ({
  id: `r-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  name: 'توصيل عادي',
  type: 'flat',
  price: 50,
  freeAbove: null,
  minDays: 2,
  maxDays: 4
})

// Fresh copy each time the dialog opens, so cancelling discards edits
watch(() => store.isZoneDialogOpen, (open) => {
  if (!open) return
  form.value = store.zoneToEdit
    ? structuredClone(toRaw(store.zoneToEdit))
    : { id: `z-${Date.now()}`, name: '', regions: [], rates: [newRate()], isActive: true }
}, { immediate: true })

// Each governorate belongs to at most one zone
const regionOwners = computed(() => {
  const owners = new Map<string, string>()
  for (const zone of store.zones) {
    if (zone.id === form.value?.id) continue
    zone.regions.forEach(r => owners.set(r, zone.name))
  }
  return owners
})

const regionOwner = (region: string) => regionOwners.value.get(region)

const availableRegions = computed(() => EGYPT_GOVERNORATES.filter(r => !regionOwners.value.has(r)))

const allAvailableSelected = computed(() =>
  !!form.value && availableRegions.value.every(r => form.value!.regions.includes(r))
)

const toggleAllAvailable = () => {
  if (!form.value) return
  form.value.regions = allAvailableSelected.value ? [] : [...availableRegions.value]
}

const addRate = () => {
  form.value?.rates.push(newRate())
}

const normalizeRate = (rate: ShippingRate): ShippingRate => {
  const toNumber = (v: unknown) => (v === '' || v == null ? null : Number(v))
  const base = { ...rate, minDays: Number(rate.minDays) || 0, maxDays: Number(rate.maxDays) || 0 }
  if (rate.type === 'free') {
    return { ...base, price: 0, freeAbove: null, includedKg: undefined, pricePerKg: undefined }
  }
  if (rate.type === 'flat') {
    return { ...base, price: Number(rate.price) || 0, freeAbove: toNumber(rate.freeAbove), includedKg: undefined, pricePerKg: undefined }
  }
  return {
    ...base,
    price: Number(rate.price) || 0,
    freeAbove: toNumber(rate.freeAbove),
    includedKg: Number(rate.includedKg) || 0,
    pricePerKg: Number(rate.pricePerKg) || 0
  }
}

const validate = (zone: ShippingZone) => {
  if (!zone.name.trim()) return 'يرجى إدخال اسم المنطقة'
  if (zone.regions.length === 0) return 'يرجى اختيار محافظة واحدة على الأقل'
  if (zone.rates.length === 0) return 'يرجى إضافة سعر شحن واحد على الأقل'
  for (const rate of zone.rates) {
    if (!rate.name.trim()) return 'يرجى إدخال اسم لكل سعر شحن'
    if (rate.price < 0) return `سعر "${rate.name}" لا يمكن أن يكون سالباً`
    if (rate.minDays > rate.maxDays) return `مدة التوصيل في "${rate.name}": "من" يجب أن تكون أقل من أو تساوي "إلى"`
  }
  return null
}

const save = async () => {
  if (!form.value) return
  const zone: ShippingZone = { ...form.value, rates: form.value.rates.map(normalizeRate) }

  const error = validate(zone)
  if (error) {
    alert(error)
    return
  }

  saving.value = true
  try {
    await store.saveZone(zone)
    store.closeZoneDialog()
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ المنطقة')
  } finally {
    saving.value = false
  }
}

const close = () => {
  if (!saving.value) store.closeZoneDialog()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && store.isZoneDialogOpen) close()
}

onMounted(() => document.addEventListener('keydown', handleKeyDown))
onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))

const labelClass = 'block text-xs font-bold text-muted mb-1.5'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
