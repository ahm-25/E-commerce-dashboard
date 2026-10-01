<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6 pb-20 sm:pb-0" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <NuxtLink to="/dashboard/categories" class="hover:text-primary transition-colors">الأقسام</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">تعديل قسم</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">
            {{ category ? `تعديل: ${category.name}` : 'تعديل القسم' }}
          </h1>
        </div>
        <div v-if="form" class="hidden sm:flex items-center gap-3">
          <NuxtLink
            to="/dashboard/categories"
            class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm"
          >
            إلغاء
          </NuxtLink>
          <button
            @click="saveCategory"
            :disabled="saving"
            class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
          >
            {{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-pulse">
        <div class="xl:col-span-2 h-80 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 shadow-sm">
        <CategoriesErrorState :error="store.error" @retry="store.fetchCategories" />
      </div>

      <!-- Not Found State -->
      <div v-else-if="!category || !form" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:folder-dashed" class="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
        <h2 class="text-2xl font-bold text-primary-navy dark:text-white mb-2">القسم غير موجود</h2>
        <p class="text-muted max-w-md mx-auto mb-6">لم نتمكن من العثور على هذا القسم. قد يكون تم حذفه.</p>
        <NuxtLink to="/dashboard/categories" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          العودة إلى الأقسام
        </NuxtLink>
      </div>

      <CategoryForm v-else v-model="form" :exclude-id="categoryId" />

      <!-- Mobile Sticky Actions -->
      <div v-if="form" class="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NuxtLink
          to="/dashboard/categories"
          class="flex-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          إلغاء
        </NuxtLink>
        <button
          @click="saveCategory"
          :disabled="saving"
          class="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
        >
          {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoriesStore, type CategoryInput } from '~/stores/categories'
import CategoryForm from '~/components/dashboard/categories/CategoryForm.vue'
import CategoriesErrorState from '~/components/dashboard/categories/CategoriesErrorState.vue'

const store = useCategoriesStore()
const route = useRoute()
const router = useRouter()
const saving = ref(false)

const categoryId = computed(() => route.params.id as string)
const category = computed(() => store.categoryById(categoryId.value))

const form = ref<CategoryInput | null>(null)

// Fill the form once the category is available (it may load after mount)
watch(category, (c) => {
  if (c && !form.value) {
    form.value = {
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '',
      parentId: c.parentId || null,
      status: c.status,
      sortOrder: c.sortOrder
    }
  }
}, { immediate: true })

const saveCategory = async () => {
  if (!form.value) return
  if (!form.value.name.trim()) {
    alert('يرجى إدخال اسم القسم')
    return
  }
  if (!form.value.slug.trim()) {
    alert('يرجى إدخال الرابط المختصر')
    return
  }
  if (store.flatCategories.some(c => c.slug === form.value!.slug && c.id !== categoryId.value)) {
    alert('الرابط المختصر مستخدم في قسم آخر')
    return
  }

  saving.value = true
  try {
    await store.updateCategory(categoryId.value, form.value)
    router.push('/dashboard/categories')
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ القسم')
  } finally {
    saving.value = false
  }
}

useHead({
  title: computed(() => `${category.value ? `تعديل ${category.value.name}` : 'تعديل قسم'} | لوحة التحكم`)
})

onMounted(() => {
  if (store.categories.length === 0) store.fetchCategories()
})
</script>
