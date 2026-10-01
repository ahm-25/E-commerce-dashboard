<template>
  <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm">
    <div class="p-5 pb-4">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm mb-4">المنتجات</h2>

      <!-- Product search -->
      <div ref="searchRef" class="relative">
        <Icon name="ph:magnifying-glass" class="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none" />
        <input
          v-model="query"
          type="search"
          placeholder="ابحث بالاسم أو SKU لإضافة منتج"
          aria-label="ابحث عن منتج"
          :class="[inputClass, 'pr-9']"
          @focus="showResults = true"
        />
        <div
          v-if="showResults"
          class="absolute top-full mt-1 inset-x-0 z-20 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg max-h-72 overflow-y-auto divide-y divide-border-light dark:divide-border-dark"
        >
          <div v-if="products.loading" class="p-4 text-sm text-muted text-center">جاري تحميل المنتجات...</div>
          <button
            v-for="p in results"
            :key="p.id"
            type="button"
            :disabled="p.stock <= 0"
            @click="add(p)"
            class="w-full text-right px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="min-w-0">
              <span class="block text-sm font-bold text-primary-navy dark:text-white truncate">{{ p.name }}</span>
              <span class="block text-xs text-muted" dir="ltr">{{ p.sku }}</span>
            </span>
            <span class="text-left shrink-0">
              <span class="block text-sm font-bold text-primary-navy dark:text-white">{{ p.price.toLocaleString('en-US') }} {{ currency }}</span>
              <span class="block text-xs" :class="p.stock <= 0 ? 'text-danger font-bold' : p.stock <= 5 ? 'text-warning font-bold' : 'text-muted'">
                {{ p.stock <= 0 ? 'نفد المخزون' : `متاح ${p.stock}` }}
              </span>
            </span>
          </button>
          <div v-if="!products.loading && !results.length" class="p-4 text-sm text-muted text-center">مفيش منتج بالاسم ده</div>
        </div>
      </div>
    </div>

    <!-- Line items -->
    <div v-if="form.items.length" class="overflow-x-auto border-t border-border-light dark:border-border-dark">
      <table class="w-full text-sm text-right">
        <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted">
          <tr>
            <th class="px-5 py-2.5 font-bold">المنتج</th>
            <th class="px-3 py-2.5 font-bold w-32">السعر ({{ currency }})</th>
            <th class="px-3 py-2.5 font-bold w-28">الكمية</th>
            <th class="px-3 py-2.5 font-bold w-28">الإجمالي</th>
            <th class="px-3 py-2.5 w-12"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="item in form.items" :key="item.productId">
            <td class="px-5 py-3">
              <div class="font-bold text-primary-navy dark:text-white">{{ item.name }}</div>
              <div class="text-xs text-muted" dir="ltr">{{ item.sku }}</div>
            </td>
            <td class="px-3 py-3">
              <input v-model.number="item.unitPrice" type="number" min="0" :aria-label="`سعر ${item.name}`" :class="[inputClass, 'py-1.5']" />
            </td>
            <td class="px-3 py-3">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                :max="item.stock"
                :aria-label="`كمية ${item.name}`"
                :class="[inputClass, 'py-1.5', item.quantity > item.stock || item.quantity < 1 ? '!border-danger' : '']"
              />
              <div v-if="item.quantity > item.stock" class="text-[11px] text-danger font-bold mt-1">متاح {{ item.stock }} بس</div>
            </td>
            <td class="px-3 py-3 font-bold text-primary-navy dark:text-white tabular-nums whitespace-nowrap">
              {{ ((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString('en-US') }}
            </td>
            <td class="px-3 py-3">
              <button
                type="button"
                @click="removeItem(item.productId)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                :title="`حذف ${item.name}`"
              >
                <Icon name="ph:trash-bold" class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="mx-5 mb-5 border border-dashed border-border-light dark:border-border-dark rounded-lg p-8 text-center text-sm text-muted">
      <Icon name="ph:package" class="w-8 h-8 mx-auto mb-2 opacity-50" />
      ابحث عن منتج من فوق عشان تضيفه للطلب
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductsStore, type Product } from '~/stores/products'
import { useManualOrder } from '~/composables/useManualOrder'

const { form, addProduct, removeItem, currency } = useManualOrder()
const products = useProductsStore()

const query = ref('')
const showResults = ref(false)
const searchRef = ref<HTMLElement | null>(null)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = products.products.filter(p => p.status !== 'archived')
  if (!q) return list.slice(0, 8)
  return list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
})

const add = (product: Product) => {
  addProduct(product)
  query.value = ''
  showResults.value = false
}

const onOutsideClick = (e: MouseEvent) => {
  if (searchRef.value && !searchRef.value.contains(e.target as Node)) showResults.value = false
}

onMounted(() => {
  if (!products.products.length) products.fetchProducts()
  document.addEventListener('click', onOutsideClick)
})
onUnmounted(() => document.removeEventListener('click', onOutsideClick))

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
