<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6 max-w-5xl" dir="rtl">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <NuxtLink to="/dashboard/products" class="hover:text-primary transition-colors">المنتجات</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">استيراد منتجات</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">استيراد منتجات من ملف CSV</h1>
        <p class="text-sm text-muted mt-1">أضف أو حدّث مئات المنتجات مرة واحدة من ملف Excel محفوظ بصيغة CSV.</p>
      </div>

      <!-- Done -->
      <div v-if="result" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 rounded-full bg-success/10 text-success flex items-center justify-center">
            <Icon name="ph:check-circle-bold" class="w-8 h-8" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-primary-navy dark:text-white">تم الاستيراد</h2>
            <p class="text-sm text-muted">
              {{ result.created }} منتج جديد · {{ result.updated }} منتج تم تحديثه
              <template v-if="result.skipped.length"> · {{ result.skipped.length }} تم تخطيه</template>
            </p>
          </div>
        </div>
        <p v-if="result.categoriesCreated.length" class="text-sm text-primary-navy dark:text-white mb-4">
          <Icon name="ph:folder-plus" class="w-4 h-4 inline" /> أقسام جديدة: {{ result.categoriesCreated.join('، ') }}
        </p>
        <ul v-if="result.skipped.length" class="mb-6 text-sm border border-border-light dark:border-border-dark rounded-lg divide-y divide-border-light dark:divide-border-dark max-h-60 overflow-y-auto">
          <li v-for="(s, i) in result.skipped" :key="i" class="px-4 py-2 flex justify-between gap-4">
            <span class="font-semibold text-primary-navy dark:text-white">{{ s.name }}</span>
            <span class="text-muted">{{ s.reason }}</span>
          </li>
        </ul>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/products" class="px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm">عرض المنتجات</NuxtLink>
          <button @click="reset" class="px-5 py-2.5 border border-border-light dark:border-border-dark rounded-lg font-bold text-sm text-primary-navy dark:text-white">استيراد ملف آخر</button>
        </div>
      </div>

      <template v-else>
        <!-- Step 1: file -->
        <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
            <div>
              <h2 class="font-bold text-primary-navy dark:text-white">1. اختر الملف</h2>
              <p class="text-xs text-muted mt-1 leading-relaxed max-w-xl">
                كل صف منتج. للمنتجات بألوان أو مقاسات: كرر نفس "الرابط" في صف لكل اختيار، واكتب اسم الخيار وقيمته (مثل: اللون / أسود).
                يقبل العناوين بالعربي أو بالإنجليزي، وملفات Shopify.
              </p>
            </div>
            <button @click="downloadTemplate" class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm font-bold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
              <Icon name="ph:download-simple-bold" class="w-4 h-4" />
              تحميل ملف نموذجي
            </button>
          </div>

          <label
            class="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors"
            :class="dragging ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/50'"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <Icon name="ph:file-csv" class="w-12 h-12 text-primary" />
            <span v-if="fileName" class="font-bold text-primary-navy dark:text-white">{{ fileName }}</span>
            <span v-else class="font-bold text-primary-navy dark:text-white">اسحب الملف هنا أو اضغط للاختيار</span>
            <span class="text-xs text-muted">CSV بترميز UTF-8 · حتى 5 ميجابايت</span>
            <input type="file" accept=".csv,text/csv" class="sr-only" @change="onPick" />
          </label>
          <p v-if="fileError" class="text-sm text-danger mt-3" role="alert">{{ fileError }}</p>
        </section>

        <!-- Step 2: review -->
        <section v-if="parsed" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
          <h2 class="font-bold text-primary-navy dark:text-white mb-4">2. راجع البيانات</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="text-xs text-muted">صفوف الملف</div>
              <div class="text-xl font-black text-primary-navy dark:text-white">{{ parsed.rowCount }}</div>
            </div>
            <div class="rounded-lg bg-success/10 p-3">
              <div class="text-xs text-success">منتجات جاهزة</div>
              <div class="text-xl font-black text-success">{{ parsed.products.length }}</div>
            </div>
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
              <div class="text-xs text-muted">منها بألوان/مقاسات</div>
              <div class="text-xl font-black text-primary-navy dark:text-white">{{ variableCount }}</div>
            </div>
            <div class="rounded-lg p-3" :class="parsed.errors.length ? 'bg-danger/10' : 'bg-gray-50 dark:bg-gray-800/50'">
              <div class="text-xs" :class="parsed.errors.length ? 'text-danger' : 'text-muted'">أخطاء</div>
              <div class="text-xl font-black" :class="parsed.errors.length ? 'text-danger' : 'text-primary-navy dark:text-white'">{{ parsed.errors.length }}</div>
            </div>
          </div>

          <!-- Issues -->
          <div v-if="parsed.errors.length || parsed.warnings.length" class="mb-5 border border-border-light dark:border-border-dark rounded-lg max-h-56 overflow-y-auto text-sm divide-y divide-border-light dark:divide-border-dark">
            <div v-for="(e, i) in parsed.errors" :key="`e${i}`" class="px-4 py-2 flex gap-3">
              <Icon name="ph:x-circle-fill" class="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <span class="text-muted shrink-0 w-14">صف {{ e.row }}</span>
              <span class="text-primary-navy dark:text-white">{{ e.message }}</span>
            </div>
            <div v-for="(w, i) in parsed.warnings" :key="`w${i}`" class="px-4 py-2 flex gap-3">
              <Icon name="ph:warning-fill" class="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span class="text-muted shrink-0 w-14">صف {{ w.row }}</span>
              <span class="text-primary-navy dark:text-white">{{ w.message }}</span>
            </div>
          </div>
          <p v-if="parsed.errors.length && parsed.products.length" class="text-xs text-muted mb-5">المنتجات التي بها أخطاء لن يتم استيرادها. صحّح الملف وارفعه مرة أخرى، أو استورد المنتجات السليمة الآن.</p>

          <!-- Preview -->
          <div v-if="parsed.products.length" class="overflow-x-auto border border-border-light dark:border-border-dark rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800/50 text-xs text-muted">
                <tr>
                  <th class="p-3 text-right font-bold">المنتج</th>
                  <th class="p-3 text-right font-bold">القسم</th>
                  <th class="p-3 text-right font-bold">السعر</th>
                  <th class="p-3 text-right font-bold">المخزون</th>
                  <th class="p-3 text-right font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-light dark:divide-border-dark">
                <tr v-for="(p, i) in preview" :key="i">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <img v-if="p.images?.[0]" :src="p.images[0]" alt="" class="w-9 h-9 rounded object-cover bg-gray-100" loading="lazy" @error="($event.target as HTMLImageElement).style.visibility = 'hidden'" />
                      <div v-else class="w-9 h-9 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><Icon name="ph:image" class="w-4 h-4 text-muted" /></div>
                      <div class="min-w-0">
                        <div class="font-semibold text-primary-navy dark:text-white truncate max-w-xs">{{ p.name }}</div>
                        <div v-if="p.variants?.length" class="text-xs text-muted">{{ p.variants.length }} اختيار · {{ p.options!.map(o => o.name).join(' و ') }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-muted">{{ p.category || '—' }}</td>
                  <td class="p-3 whitespace-nowrap text-primary-navy dark:text-white">{{ priceLabel(p) }}</td>
                  <td class="p-3 text-primary-navy dark:text-white">{{ p.variants ? p.variants.reduce((s, v) => s + (v.stock ?? 0), 0) : p.stock }}</td>
                  <td class="p-3"><span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="p.status === 'draft' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800' : 'bg-success/10 text-success'">{{ p.status === 'draft' ? 'مسودة' : 'منشور' }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-if="parsed.products.length > preview.length" class="p-3 text-center text-xs text-muted border-t border-border-light dark:border-border-dark">
              و{{ parsed.products.length - preview.length }} منتج آخر
            </div>
          </div>
        </section>

        <!-- Step 3: import -->
        <section v-if="parsed?.products.length" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label class="flex items-start gap-3 cursor-pointer">
            <input v-model="updateExisting" type="checkbox" class="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
            <span>
              <span class="block text-sm font-bold text-primary-navy dark:text-white">تحديث المنتجات الموجودة</span>
              <span class="block text-xs text-muted">المنتج الذي له نفس الرابط أو كود المنتج (SKU) يتم تحديث سعره ومخزونه وبياناته بدلاً من تخطيه.</span>
            </span>
          </label>
          <button
            @click="runImport"
            :disabled="importing"
            class="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm disabled:opacity-50"
          >
            <Icon :name="importing ? 'ph:spinner-gap' : 'ph:upload-simple-bold'" class="w-4 h-4" :class="{ 'animate-spin': importing }" />
            {{ importing ? 'جاري الاستيراد...' : `استيراد ${parsed.products.length} منتج` }}
          </button>
        </section>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseProductCsv, TEMPLATE_HEADERS, TEMPLATE_ROWS, type ParsedImport, type ImportProduct } from '~/utils/productCsv'
import { useProductsStore } from '~/stores/products'

interface ImportResult {
  created: number
  updated: number
  skipped: { name: string, reason: string }[]
  categoriesCreated: string[]
}

const MAX_SIZE = 5 * 1024 * 1024

const productsStore = useProductsStore()

const fileName = ref('')
const fileError = ref<string | null>(null)
const dragging = ref(false)
const parsed = ref<ParsedImport | null>(null)
const updateExisting = ref(false)
const importing = ref(false)
const result = ref<ImportResult | null>(null)

const preview = computed(() => parsed.value?.products.slice(0, 50) ?? [])
const variableCount = computed(() => parsed.value?.products.filter(p => p.variants?.length).length ?? 0)

const priceLabel = (p: ImportProduct) => {
  const prices = p.variants?.length ? p.variants.map(v => v.price ?? 0) : [p.price ?? 0]
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? `${min.toLocaleString('en-US')} ج.م` : `${min.toLocaleString('en-US')} - ${max.toLocaleString('en-US')} ج.م`
}

const readFile = async (file: File) => {
  fileError.value = null
  parsed.value = null
  fileName.value = file.name
  if (!/\.csv$/i.test(file.name)) {
    fileError.value = 'الملف يجب أن يكون بصيغة CSV. من Excel: ملف ← حفظ باسم ← CSV UTF-8.'
    return
  }
  if (file.size > MAX_SIZE) {
    fileError.value = 'حجم الملف أكبر من 5 ميجابايت. قسّمه إلى أكثر من ملف.'
    return
  }
  const text = await file.text()
  // Excel's legacy "CSV" saves Arabic in Windows-1256, which reads as replacement characters
  if (text.includes('�')) {
    fileError.value = 'ترميز الملف غير مدعوم والنص العربي سيظهر مشوهاً. احفظه من Excel بصيغة "CSV UTF-8".'
    return
  }
  parsed.value = parseProductCsv(text)
}

const onPick = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) readFile(file)
  input.value = '' // picking the same file again re-reads it
}

const onDrop = (e: DragEvent) => {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) readFile(file)
}

const downloadTemplate = () => {
  const esc = (c: string) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)
  const csv = [TEMPLATE_HEADERS, ...TEMPLATE_ROWS].map(r => r.map(esc).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'products-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const runImport = async () => {
  if (!parsed.value?.products.length) return
  importing.value = true
  try {
    result.value = await $fetch<ImportResult>('/api/admin/products/import', {
      method: 'POST',
      body: { products: parsed.value.products, updateExisting: updateExisting.value }
    })
    productsStore.fetchProducts() // refresh the list for when the merchant goes back
  } catch (err) {
    alert(apiError(err, 'حدث خطأ أثناء الاستيراد'))
  } finally {
    importing.value = false
  }
}

const reset = () => {
  result.value = null
  parsed.value = null
  fileName.value = ''
  updateExisting.value = false
}

useHead({ title: 'استيراد منتجات | لوحة التحكم' })
</script>
