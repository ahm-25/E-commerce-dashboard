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
        <button @click="saveDraft" class="px-5 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-bg dark:hover:bg-bg-dark transition-colors">
          حفظ كمسودة
        </button>
        <button @click="publishProduct" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm" :disabled="loading">
          <Icon v-if="loading" name="ph:spinner-gap" class="w-4 h-4 animate-spin" />
          <Icon v-else name="ph:paper-plane-tilt-bold" class="w-4 h-4" />
          {{ loading ? 'جاري الحفظ...' : 'نشر المنتج' }}
        </button>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="flex flex-col xl:flex-row gap-6 pb-24 md:pb-6">
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
      <button @click="saveDraft" class="flex-1 px-4 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark">حفظ كمسودة</button>
      <button @click="publishProduct" class="flex-1 px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg flex justify-center items-center gap-2" :disabled="loading">
        <Icon v-if="loading" name="ph:spinner-gap" class="w-4 h-4 animate-spin" />
        نشر
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
import { useProductForm } from '~/composables/useProductForm'

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
const { form, isDirty, loading, validate, resetForm } = useProductForm()

const showUnsavedDialog = ref(false)
let pendingRoute: any = null

onMounted(() => {
  resetForm()
  if (props.isEditing && props.productId) {
    // load data mock
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
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

const saveDraft = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  isDirty.value = false
  alert('تم حفظ المنتج كمسودة.')
}

const publishProduct = async () => {
  if (!validate()) {
    alert('يرجى مراجعة الحقول المطلوبة')
    return
  }
  
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
  isDirty.value = false
  alert(props.isEditing ? 'تم تحديث المنتج بنجاح.' : 'تم نشر المنتج بنجاح.')
  router.push('/dashboard/products')
}
</script>
