<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      
      <!-- Header -->
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="min-w-0">
          <nav class="text-sm text-muted mb-2" aria-label="Breadcrumb">
            <ol class="flex flex-wrap items-center gap-2">
              <li><NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink></li>
              <li>/</li>
              <li>المتجر</li>
              <li>/</li>
              <li><NuxtLink to="/dashboard/store/pages" class="hover:text-primary transition-colors">الصفحات</NuxtLink></li>
              <li>/</li>
              <li class="text-primary-navy dark:text-gray-100 font-medium">{{ isEditing ? 'تعديل صفحة' : 'إضافة صفحة' }}</li>
            </ol>
          </nav>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold text-primary-navy dark:text-white tracking-tight">{{ isEditing ? 'تعديل صفحة' : 'إضافة صفحة' }}</h1>
            <span v-if="isDirty" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50">
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              تغييرات غير محفوظة
            </span>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <NuxtLink to="/dashboard/store/pages" class="px-4 py-2 text-sm font-medium text-gray-700 bg-surface border border-border-light rounded-lg hover:bg-bg dark:bg-surface-dark dark:border-border-dark dark:text-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm">
            إلغاء
          </NuxtLink>
          <button @click="previewPage" class="px-4 py-2 text-sm font-medium text-gray-700 bg-surface border border-border-light rounded-lg hover:bg-bg dark:bg-surface-dark dark:border-border-dark dark:text-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
            <Icon name="heroicons:eye" class="w-4 h-4" />
            معاينة
          </button>
          <button @click="saveDraft" class="px-4 py-2 text-sm font-medium text-gray-700 bg-surface border border-border-light rounded-lg hover:bg-bg dark:bg-surface-dark dark:border-border-dark dark:text-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm">
            حفظ كمسودة
          </button>
          <button @click="publish" class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
            <Icon name="heroicons:globe-alt" class="w-4 h-4" />
            نشر الصفحة
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <div class="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div class="min-h-[500px] bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div class="lg:col-span-4 space-y-6">
          <div class="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      <!-- Editor Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Main Content (Right in RTL) -->
        <div class="lg:col-span-8 min-w-0 space-y-6">
          
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">عنوان الصفحة <span class="text-red-500">*</span></label>
              <input v-model="form.title" @input="handleTitleInput" type="text" placeholder="مثال: من نحن" class="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">الرابط (Slug) <span class="text-red-500">*</span></label>
              <div class="flex items-stretch relative" dir="ltr">
                <span class="flex items-center px-3 bg-bg dark:bg-bg-dark border border-r-0 border-border-light dark:border-border-dark rounded-l-lg text-muted text-sm font-mono shrink-0">/store/</span>
                <input v-model="form.slug" @input="isDirty = true" :disabled="pageType === 'system'" type="text" placeholder="about-us" class="w-full px-4 py-2.5 border border-border-light dark:border-border-dark min-w-0 rounded-r-lg bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-left font-mono disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900 transition-shadow" dir="ltr" />
              </div>
              <p v-if="pageType === 'system'" class="text-xs text-amber-600 mt-1.5">هذه صفحة أساسية، لا يمكن تغيير الرابط الخاص بها.</p>
            </div>
          </div>

          <!-- Rich Text Editor Mockup -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div class="border-b border-gray-200 dark:border-gray-800 p-2 flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 flex-wrap">
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:h1" class="w-4 h-4" /></button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:h2" class="w-4 h-4" /></button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:h3" class="w-4 h-4" /></button>
              <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold transition-colors">B</button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded italic transition-colors">I</button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded underline transition-colors">U</button>
              <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:list-bullet" class="w-4 h-4" /></button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:numbered-list" class="w-4 h-4" /></button>
              <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:link" class="w-4 h-4" /></button>
              <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Icon name="heroicons:photo" class="w-4 h-4" /></button>
            </div>
            <textarea v-model="form.content" @input="isDirty = true" class="w-full flex-1 min-h-[420px] p-5 bg-white dark:bg-surface-dark focus:outline-none resize-none leading-relaxed text-gray-800 dark:text-gray-200" placeholder="اكتب محتوى الصفحة هنا..."></textarea>
          </div>

        </div>

        <!-- Sidebar (Left in RTL) -->
        <div class="lg:col-span-4 min-w-0 space-y-6 lg:sticky lg:top-0">
          
          <!-- Publishing Settings -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm space-y-5">
            <h3 class="font-semibold text-primary-navy dark:text-white flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
              <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5 text-primary" />
              إعدادات النشر
            </h3>
            
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-200 mb-1.5">حالة الصفحة</label>
              <select v-model="form.status" @change="isDirty = true" class="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary">
                <option value="draft">مسودة</option>
                <option value="published">منشورة</option>
                <option value="hidden">مخفية</option>
              </select>
            </div>

            <div v-if="form.status === 'published' && form.publishedAt" class="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start gap-2">
              <Icon name="heroicons:calendar" class="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
              <div>
                <span class="block text-xs text-gray-500 mb-0.5">تاريخ النشر:</span>
                <span dir="ltr">{{ new Date(form.publishedAt).toLocaleString('ar-EG') }}</span>
              </div>
            </div>
            
            <div v-if="pageType === 'system'" class="text-sm text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg flex items-start gap-2 border border-blue-100 dark:border-blue-900/50">
              <Icon name="heroicons:information-circle" class="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
              <span>هذه صفحة أساسية في النظام. لا يمكن حذفها أو تغيير الرابط الخاص بها.</span>
            </div>
          </div>

          <!-- SEO Section -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm space-y-5">
            <h3 class="font-semibold text-primary-navy dark:text-white flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
              <Icon name="heroicons:magnifying-glass-circle" class="w-5 h-5 text-primary" />
              تحسين محركات البحث SEO
            </h3>
            
            <div>
              <div class="flex justify-between mb-1.5">
                <label class="text-sm text-gray-700 dark:text-gray-200">عنوان الصفحة لمحركات البحث</label>
                <span class="text-xs" :class="form.seo.title.length > 60 ? 'text-red-500' : 'text-gray-400'">{{ form.seo.title.length }} / 60</span>
              </div>
              <input v-model="form.seo.title" @input="isDirty = true" type="text" class="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow" />
            </div>

            <div>
              <div class="flex justify-between mb-1.5">
                <label class="text-sm text-gray-700 dark:text-gray-200">وصف الصفحة لمحركات البحث</label>
                <span class="text-xs" :class="form.seo.description.length > 160 ? 'text-red-500' : 'text-gray-400'">{{ form.seo.description.length }} / 160</span>
              </div>
              <textarea v-model="form.seo.description" @input="isDirty = true" rows="4" class="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none transition-shadow"></textarea>
            </div>

            <!-- SEO Preview -->
            <div class="mt-2 pt-4 border-t border-border-light dark:border-border-dark">
              <p class="text-xs font-medium text-gray-500 mb-3">معاينة محرك البحث (Preview)</p>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="text-sm text-gray-700 dark:text-gray-400 mb-1 truncate text-left" dir="ltr">
                  <span class="text-gray-500">www.store.com/store/</span>{{ form.slug || 'slug' }}
                </div>
                <div class="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] font-normal hover:underline cursor-pointer truncate leading-tight">{{ form.seo.title || form.title || 'عنوان الصفحة' }}</div>
                <div class="text-sm text-[#4d5156] dark:text-[#bdc1c6] mt-1 line-clamp-2 leading-snug">{{ form.seo.description || 'وصف الصفحة سيظهر هنا في نتائج محركات البحث لمساعدة الزوار في فهم محتوى الصفحة...' }}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useStorePagesStore } from '~/stores/storePages'

const route = useRoute()
const router = useRouter()
const store = useStorePagesStore()

const isEditing = computed(() => !!route.query.id)
const loading = ref(false)
const pageType = ref('custom')
const isDirty = ref(false)
const isSaving = ref(false)

const form = reactive({
  title: '',
  slug: '',
  content: '',
  status: 'draft' as 'draft' | 'published' | 'hidden',
  publishedAt: '',
  seo: {
    title: '',
    description: ''
  }
})

let autoSlug = true

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true
    const page = await store.fetchPage(route.query.id as string)
    if (page) {
      form.title = page.title
      form.slug = page.slug
      form.content = page.content
      form.status = page.status
      form.publishedAt = page.publishedAt || ''
      if (page.seo) {
        form.seo.title = page.seo.title || ''
        form.seo.description = page.seo.description || ''
      }
      pageType.value = page.type
      autoSlug = false
    }
    loading.value = false
    // Reset dirty after load
    setTimeout(() => { isDirty.value = false }, 100)
  }
})

const handleTitleInput = () => {
  isDirty.value = true
  if (autoSlug && !isEditing.value && pageType.value !== 'system') {
    form.slug = form.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
  }
}

const validate = () => {
  if (!form.title) {
    alert('عنوان الصفحة مطلوب')
    return false
  }
  if (!form.slug) {
    alert('رابط الصفحة مطلوب')
    return false
  }
  return true
}

const previewPage = () => {
  alert('سيتم فتح المعاينة في Drawer أو Tab جديد لاحقاً...')
}

const saveDraft = async () => {
  if (!validate()) return
  form.status = 'draft'
  await save()
  isDirty.value = false
  alert('تم حفظ الصفحة كمسودة')
  router.push('/dashboard/store/pages')
}

const publish = async () => {
  if (!validate()) return
  if (confirm('نشر الصفحة؟ سيتم إتاحة هذه الصفحة للعملاء على المتجر.')) {
    form.status = 'published'
    await save()
    isDirty.value = false
    alert('تم نشر الصفحة بنجاح')
    router.push('/dashboard/store/pages')
  }
}

const save = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await store.updatePage(route.query.id as string, form)
    } else {
      await store.createPage(form)
    }
  } finally {
    isSaving.value = false
  }
}

// Unsaved changes guard
onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value && !isSaving.value) {
    const answer = window.confirm('لديك تغييرات غير محفوظة. هل تريد مغادرة هذه الصفحة حقاً؟\nقد يتم فقدان التغييرات إذا غادرت بدون حفظ.')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>
