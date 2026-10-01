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
            <span class="text-primary-navy dark:text-white font-medium">إضافة قسم</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">إضافة قسم جديد</h1>
        </div>
        <div class="hidden sm:flex items-center gap-3">
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
            {{ saving ? 'جاري الحفظ...' : 'حفظ القسم' }}
          </button>
        </div>
      </div>

      <CategoryForm v-model="form" />

      <!-- Mobile Sticky Actions -->
      <div class="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
import { ref, onMounted } from 'vue'
import { useCategoriesStore, type CategoryInput } from '~/stores/categories'
import CategoryForm from '~/components/dashboard/categories/CategoryForm.vue'

const store = useCategoriesStore()
const route = useRoute()
const router = useRouter()
const saving = ref(false)

const form = ref<CategoryInput>({
  name: '',
  slug: '',
  description: '',
  image: '',
  // ?parent=<id> pre-selects the parent when coming from "إضافة قسم فرعي"
  parentId: (route.query.parent as string) || null,
  status: 'visible',
  sortOrder: 0
})

const saveCategory = async () => {
  if (!form.value.name.trim()) {
    alert('يرجى إدخال اسم القسم')
    return
  }
  if (!form.value.slug.trim()) {
    alert('يرجى إدخال الرابط المختصر')
    return
  }
  if (store.flatCategories.some(c => c.slug === form.value.slug)) {
    alert('الرابط المختصر مستخدم في قسم آخر')
    return
  }

  saving.value = true
  try {
    await store.createCategory(form.value)
    router.push('/dashboard/categories')
  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء حفظ القسم')
  } finally {
    saving.value = false
  }
}

useHead({
  title: 'إضافة قسم | لوحة التحكم'
})

onMounted(() => {
  if (store.categories.length === 0) store.fetchCategories()
})
</script>
