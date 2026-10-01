<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="mb-6">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">المتغيرات</h2>
      <p class="text-muted text-sm mt-1">أضف خيارات المنتج زي اللون أو المقاس، وهتتعمل كل التركيبات لوحدها.</p>
    </div>

    <p v-if="errors.variants" data-field-error class="text-sm font-bold text-danger bg-danger/5 rounded-lg p-3 mb-4 flex items-center gap-2">
      <Icon name="ph:warning-circle" class="w-4 h-4 shrink-0" />
      {{ errors.variants }}
    </p>

    <!-- Options -->
    <div class="flex flex-col gap-3">
      <div
        v-for="option in form.options"
        :key="option.id"
        class="border border-border-light dark:border-border-dark rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/30"
      >
        <div class="flex items-center gap-3 mb-3">
          <input
            v-model="option.name"
            placeholder="اسم الخيار (مثال: اللون)"
            :aria-label="'اسم الخيار'"
            class="flex-1 max-w-xs px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-bold text-primary-navy dark:text-white focus:ring-primary focus:border-primary"
          >
          <button
            type="button"
            @click="removeOption(option.id)"
            class="text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
            :title="`حذف خيار ${option.name || ''}`"
          >
            <Icon name="ph:trash-bold" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="value in option.values"
            :key="value"
            class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark pr-3 pl-1.5 py-1 rounded-full text-sm flex items-center gap-1.5 text-primary-navy dark:text-white"
          >
            {{ value }}
            <button type="button" @click="removeOptionValue(option.id, value)" class="w-5 h-5 rounded-full flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10" :aria-label="`حذف ${value}`">
              <Icon name="ph:x-bold" class="w-3 h-3" />
            </button>
          </span>
          <input
            v-model="drafts[option.id]"
            type="text"
            placeholder="أضف قيمة واضغط Enter"
            :aria-label="`قيمة جديدة لـ ${option.name || 'الخيار'}`"
            @keydown.enter.prevent="commitValue(option.id)"
            @blur="commitValue(option.id)"
            class="px-3 py-1 rounded-full border border-dashed border-border-light dark:border-border-dark bg-transparent text-sm w-44 focus:outline-none focus:border-primary text-primary-navy dark:text-white"
          >
        </div>
        <p v-if="valueErrors[option.id]" class="text-xs font-bold text-danger mt-2">{{ valueErrors[option.id] }}</p>
        <p v-else-if="option.values.length && !option.name.trim()" class="text-xs font-bold text-warning mt-2">اكتب اسم الخيار عشان قيمه تدخل في المتغيرات</p>
      </div>

      <button
        v-if="form.options.length < 3"
        type="button"
        @click="addOption"
        class="text-primary font-bold text-sm flex items-center justify-center gap-2 py-3 border border-dashed border-border-light dark:border-border-dark rounded-lg hover:bg-primary/5 transition-colors"
      >
        <Icon name="ph:plus-bold" />
        {{ form.options.length ? 'إضافة خيار آخر' : 'إضافة خيار (مثلاً: اللون)' }}
      </button>
    </div>

    <!-- Variants table -->
    <div v-if="form.variants.length" class="mt-8">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 class="font-bold text-primary-navy dark:text-white">
          المتغيرات ({{ form.variants.length }} من {{ MAX_VARIANTS }})
        </h3>
        <!-- Fill one column for all rows -->
        <div class="flex items-center gap-2 text-sm">
          <input v-model="bulk.value" type="number" min="0" placeholder="قيمة" aria-label="قيمة للتطبيق على الكل" class="w-24 px-2 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm" dir="ltr">
          <button type="button" @click="applyBulk('price')" :disabled="bulk.value === ''" class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark font-bold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">سعر للكل</button>
          <button v-if="form.trackInventory" type="button" @click="applyBulk('stock')" :disabled="bulk.value === ''" class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark font-bold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">مخزون للكل</button>
        </div>
      </div>

      <div class="overflow-x-auto border border-border-light dark:border-border-dark rounded-xl max-h-[480px]">
        <table class="w-full text-right text-sm">
          <thead class="bg-gray-50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark sticky top-0">
            <tr>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white">المتغير</th>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white w-44">SKU</th>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white w-36">السعر (ج.م)</th>
              <th v-if="form.trackInventory" class="px-4 py-3 font-bold text-primary-navy dark:text-white w-28">المخزون</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light dark:divide-border-dark">
            <tr v-for="(variant, i) in form.variants" :key="variant.key">
              <td class="px-4 py-2.5 font-bold text-primary-navy dark:text-white whitespace-nowrap">{{ variantLabel(variant) }}</td>
              <td class="px-4 py-2">
                <input
                  v-model="variant.sku"
                  type="text"
                  :placeholder="resolvedVariants[i]?.sku"
                  :aria-label="`SKU ${variantLabel(variant)}`"
                  class="w-full px-2 py-1.5 rounded border border-border-light dark:border-border-dark text-sm bg-white dark:bg-surface-dark font-mono"
                  dir="ltr"
                >
              </td>
              <td class="px-4 py-2">
                <input
                  v-model.number="variant.price"
                  type="number"
                  min="0"
                  :placeholder="basePrice != null ? String(basePrice) : 'مطلوب'"
                  :aria-label="`سعر ${variantLabel(variant)}`"
                  class="w-full px-2 py-1.5 rounded border text-sm bg-white dark:bg-surface-dark"
                  :class="resolvedVariants[i]?.price == null ? 'border-danger' : 'border-border-light dark:border-border-dark'"
                  dir="ltr"
                >
              </td>
              <td v-if="form.trackInventory" class="px-4 py-2">
                <input
                  v-model.number="variant.stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  :aria-label="`مخزون ${variantLabel(variant)}`"
                  class="w-full px-2 py-1.5 rounded border border-border-light dark:border-border-dark text-sm bg-white dark:bg-surface-dark"
                  dir="ltr"
                >
              </td>
            </tr>
          </tbody>
          <tfoot v-if="form.trackInventory" class="bg-gray-50 dark:bg-gray-800/50 border-t border-border-light dark:border-border-dark sticky bottom-0">
            <tr>
              <td colspan="3" class="px-4 py-2.5 font-bold text-muted">إجمالي المخزون</td>
              <td class="px-4 py-2.5 font-black text-primary-navy dark:text-white" dir="ltr">{{ totalStock }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p class="text-xs text-muted mt-2">
        السعر الفاضي = السعر الأساسي{{ basePrice != null ? ` (${basePrice} ج.م)` : '' }}، والـ SKU الفاضي بيتعمل من SKU المنتج.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useProductForm, toNumber, MAX_VARIANTS } from '~/composables/useProductForm'

const {
  form, errors, addOption, removeOption, addOptionValue, removeOptionValue,
  variantLabel, resolvedVariants, totalStock
} = useProductForm()

// Text being typed in each option's value input
const drafts = reactive<Record<string, string>>({})
const valueErrors = reactive<Record<string, string>>({})

const basePrice = computed(() => toNumber(form.price))

const commitValue = (optionId: string) => {
  // Allow pasting "أحمر, أزرق, أخضر"
  const parts = (drafts[optionId] || '').split(/[,،]/).map(v => v.trim()).filter(Boolean)
  delete valueErrors[optionId]
  for (const part of parts) {
    const error = addOptionValue(optionId, part)
    if (error) {
      valueErrors[optionId] = error
      break
    }
  }
  drafts[optionId] = ''
}

// Switching to "variable" starts with one empty option to fill in
onMounted(() => {
  if (!form.options.length) addOption()
})

const bulk = reactive({ value: '' as string | number })

const applyBulk = (field: 'price' | 'stock') => {
  const value = toNumber(bulk.value)
  if (value == null || value < 0) return
  form.variants.forEach(v => { v[field] = field === 'stock' ? Math.floor(value) : value })
  bulk.value = ''
}
</script>
