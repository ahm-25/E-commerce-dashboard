<template>
  <div class="flex flex-col gap-6" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <NuxtLink to="/dashboard/products" class="hover:text-primary transition-colors">المنتجات</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">{{ isEditing ? 'تعديل المنتج' : 'إضافة منتج' }}</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">
          {{ isEditing ? 'تعديل المنتج' : 'إضافة منتج' }}
        </h1>
        <p class="text-muted text-sm mt-1.5 font-bold">
          {{ isEditing ? 'تعديل معلومات المنتج وإعداداته.' : 'أضف منتجًا جديدًا إلى متجرك.' }}
        </p>
      </div>
      
      <div class="hidden md:flex items-center gap-3">
        <NuxtLink to="/dashboard/products" class="px-5 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-bg dark:hover:bg-bg-dark transition-colors">
          إلغاء
        </NuxtLink>
        <button v-if="!isEditing" @click="saveDraft" :disabled="loading" class="px-5 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-bg dark:hover:bg-bg-dark transition-colors disabled:opacity-50">
          حفظ كمسودة
        </button>
        <button @click="publishProduct" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm" :disabled="loading">
          <Icon v-if="loading" name="ph:spinner-gap" class="w-4 h-4 animate-spin" />
          <Icon v-else name="ph:paper-plane-tilt-bold" class="w-4 h-4" />
          {{ loading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'نشر المنتج' }}
        </button>
      </div>
    </div>

    <div v-if="loadingProduct" class="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>

    <div v-else-if="notFound" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
      <Icon name="ph:package" class="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
      <h2 class="text-2xl font-bold text-primary-navy dark:text-white mb-2">المنتج غير موجود</h2>
      <NuxtLink to="/dashboard/products" class="inline-flex mt-4 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm">العودة للمنتجات</NuxtLink>
    </div>

    <!-- Main Content Layout -->
    <div v-else class="flex flex-col xl:flex-row gap-6 pb-24 md:pb-6">
      <!-- Left Column (70%) -->
      <div class="flex-1 flex flex-col gap-6 w-full xl:w-[70%]">
        <ProductBasicInfo />
        <ProductImageUploader />
        <ProductTypeSelector />
        <ProductPricing />
        <ProductInventory />
        <ProductVariants v-if="form.type === 'variable'" />
        <ProductShipping />
        <ProductSEO />
      </div>

      <!-- Right Sidebar (30%) -->
      <div class="w-full xl:w-[30%] flex-shrink-0 flex flex-col gap-6 xl:sticky xl:top-24 xl:h-fit">
        <ProductStatusCard />
        <ProductVisibilityCard />
        <ProductCategory />
        <ProductTags />
        <ProductPreview />
      </div>
    </div>

    <!-- Mobile Action Bar -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark p-4 flex items-center justify-between z-40 gap-3 shadow-lg">
      <button v-if="!isEditing" @click="saveDraft" :disabled="loading" class="flex-1 px-4 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark">حفظ كمسودة</button>
      <button @click="publishProduct" class="flex-1 px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg flex justify-center items-center gap-2" :disabled="loading">
        <Icon v-if="loading" name="ph:spinner-gap" class="w-4 h-4 animate-spin" />
        {{ isEditing ? 'حفظ' : 'نشر' }}
      </button>
    </div>
    
    <ProductUnsavedDialog 
      :is-open="showUnsavedDialog" 
      @stay="handleStay" 
      @leave="handleLeave" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { provideProductForm } from '~/composables/useProductForm'
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'

import ProductBasicInfo from './ProductBasicInfo.vue'
import ProductImageUploader from './ProductImageUploader.vue'
import ProductTypeSelector from './ProductTypeSelector.vue'
import ProductPricing from './ProductPricing.vue'
import ProductInventory from './ProductInventory.vue'
import ProductVariants from './ProductVariants.vue'
import ProductShipping from './ProductShipping.vue'
import ProductSEO from './ProductSEO.vue'
import ProductStatusCard from './ProductStatusCard.vue'
import ProductVisibilityCard from './ProductVisibilityCard.vue'
import ProductCategory from './ProductCategory.vue'
import ProductTags from './ProductTags.vue'
import ProductPreview from './ProductPreview.vue'
import ProductUnsavedDialog from './ProductUnsavedDialog.vue'

const props = defineProps({
  isEditing: { type: Boolean, default: false },
  productId: { type: String, default: null }
})

const router = useRouter()
const products = useProductsStore()
const categories = useCategoriesStore()

// This component owns the form; every section below reads the same instance
const { form, isDirty, loading, validate, focusFirstError, setProduct, resolvedVariants } = provideProductForm()

const showUnsavedDialog = ref(false)
const notFound = ref(false)
const loadingProduct = ref(props.isEditing)
let pendingRoute: any = null

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  if (!categories.categories.length) categories.fetchCategories()

  if (props.isEditing && props.productId) {
    const data = await products.getProductForm(props.productId)
    if (data) await setProduct(data)
    else notFound.value = true
    loadingProduct.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    showUnsavedDialog.value = true
    pendingRoute = to
    next(false)
  } else {
    next()
  }
})

const handleStay = () => {
  showUnsavedDialog.value = false
  pendingRoute = null
}

const handleLeave = () => {
  isDirty.value = false // Skip check on retry
  showUnsavedDialog.value = false
  if (pendingRoute) {
    router.push(pendingRoute)
  }
}

const save = async (status: 'draft' | 'published' | null) => {
  const targetStatus = status ?? form.status
  // Drafts only need a name; anything visible to customers needs the full rules
  if (!validate(targetStatus === 'published')) {
    focusFirstError()
    return
  }
  form.status = targetStatus

  loading.value = true
  try {
    await products.saveProduct(props.productId, {
      form,
      variants: form.type === 'variable'
        ? resolvedVariants.value.map(v => ({ key: v.key, label: v.label, sku: v.sku, price: v.price, stock: v.stock }))
        : [],
      categoryName: form.categoryId ? categories.categoryById(form.categoryId)?.name ?? null : null
    })
    isDirty.value = false
    router.push('/dashboard/products')
  } catch (err: any) {
    alert(err.message || 'تعذر حفظ المنتج')
  } finally {
    loading.value = false
  }
}

const saveDraft = () => save('draft')
const publishProduct = () => save(props.isEditing ? null : 'published')
</script>
