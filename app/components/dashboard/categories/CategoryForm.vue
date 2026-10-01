<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Main Column -->
    <div class="xl:col-span-2 flex flex-col gap-6">
      <!-- Basic Information -->
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">المعلومات الأساسية</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">اسم القسم <span class="text-danger">*</span></label>
            <input
              v-model="form.name"
              type="text"
              placeholder="مثال: الإلكترونيات"
              class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
              @input="onNameInput"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الرابط المختصر (Slug) <span class="text-danger">*</span></label>
            <input
              v-model="form.slug"
              type="text"
              dir="ltr"
              placeholder="electronics"
              class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm font-mono rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
              @input="slugTouched = true"
            />
            <p class="text-xs text-muted mt-1.5" dir="ltr">/category/{{ form.slug || '...' }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الوصف</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="وصف مختصر يظهر في صفحة القسم (اختياري)"
              class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">صورة القسم</h3>
        <div class="flex items-center gap-4">
          <div class="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="form.image" :src="form.image" alt="" class="w-full h-full object-cover" />
            <Icon v-else name="ph:image-fill" class="w-8 h-8 text-gray-400" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <label class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors">
                <Icon name="ph:upload-simple-bold" class="w-4 h-4" />
                {{ form.image ? 'تغيير الصورة' : 'رفع صورة' }}
                <input type="file" accept="image/*" class="hidden" @change="onImageChange" />
              </label>
              <button
                v-if="form.image"
                type="button"
                class="px-4 py-2 rounded-lg font-bold text-sm text-danger hover:bg-danger/10 transition-colors"
                @click="form.image = ''"
              >
                إزالة
              </button>
            </div>
            <p class="text-xs text-muted">PNG أو JPG، بحد أقصى 2 ميجابايت</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Side Column -->
    <div class="flex flex-col gap-6">
      <!-- Visibility -->
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">الظهور</h3>
        <label class="flex items-center justify-between gap-4 cursor-pointer">
          <div class="flex flex-col">
            <span class="text-sm font-bold text-primary-navy dark:text-white">{{ form.status === 'visible' ? 'ظاهر في المتجر' : 'مخفي من المتجر' }}</span>
            <span class="text-xs text-muted">الأقسام المخفية لا تظهر للعملاء</span>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.status === 'visible'"
            class="relative w-11 h-6 rounded-full transition-colors shrink-0"
            :class="form.status === 'visible' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
            @click="form.status = form.status === 'visible' ? 'hidden' : 'visible'"
          >
            <span
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              :class="form.status === 'visible' ? 'left-0.5' : 'left-[22px]'"
            ></span>
          </button>
        </label>
      </div>

      <!-- Organization -->
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-4">التنظيم</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">القسم الأب</label>
            <select
              v-model="form.parentId"
              class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
            >
              <option :value="null">بدون (قسم رئيسي)</option>
              <option v-for="option in parentOptions" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">ترتيب العرض</label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCategoriesStore, type Category, type CategoryInput } from '~/stores/categories'

const props = defineProps<{
  // Category being edited; it and its descendants can't be picked as its parent
  excludeId?: string
}>()

const form = defineModel<CategoryInput>({ required: true })

const store = useCategoriesStore()

// Keep auto-generating the slug from the name until the user edits it by hand
const slugTouched = ref(!!form.value.slug)

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')

const onNameInput = () => {
  if (!slugTouched.value) {
    form.value.slug = slugify(form.value.name)
  }
}

const collectIds = (category: Category): string[] => [
  category.id,
  ...(category.children || []).flatMap(collectIds)
]

const parentOptions = computed(() => {
  const excluded = new Set<string>()
  if (props.excludeId) {
    const self = store.categoryById(props.excludeId)
    if (self) collectIds(self).forEach(id => excluded.add(id))
  }
  return store.mainCategories.filter(c => !excluded.has(c.id))
})

const onImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('حجم الصورة يجب ألا يتجاوز 2 ميجابايت')
    return
  }
  // TODO: Upload to storage; a data URL is enough for the mock store
  const reader = new FileReader()
  reader.onload = () => {
    form.value.image = reader.result as string
  }
  reader.readAsDataURL(file)
}
</script>
