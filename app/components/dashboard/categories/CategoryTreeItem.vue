<template>
  <tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-border-light dark:border-border-dark last:border-0 relative">
    <td class="py-3 px-4 text-center">
      <div 
        class="bg-white dark:bg-surface-dark w-5 h-5 rounded border border-border-light dark:border-border-dark flex items-center justify-center cursor-pointer transition-colors"
        :class="{ 'bg-primary border-primary': isSelected }"
        @click="store.toggleCategorySelection(category.id)"
      >
        <Icon v-if="isSelected" name="ph:check-bold" class="w-3.5 h-3.5 text-white" />
      </div>
    </td>
    <td class="py-3 px-4">
      <div class="cursor-grab hover:text-primary text-muted transition-colors flex justify-center">
        <Icon name="ph:dots-six-vertical-bold" class="w-5 h-5" />
      </div>
    </td>
    <td class="py-3 px-4">
      <div class="flex items-center gap-3" :style="{ paddingRight: `${level * 24}px` }">
        <div v-if="level > 0" class="w-4 h-px bg-border-light dark:bg-border-dark hidden md:block"></div>
        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
          <img v-if="category.image" :src="category.image" :alt="category.name" class="w-full h-full object-cover" />
          <Icon v-else name="ph:image-fill" class="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white text-sm hover:text-primary transition-colors cursor-pointer flex items-center gap-1" @click="toggleExpand">
            {{ category.name }}
            <Icon v-if="!hideChildren && category.children && category.children.length > 0" :name="isExpanded ? 'ph:caret-down-bold' : 'ph:caret-left-bold'" class="w-3 h-3 text-muted" />
          </div>
        </div>
      </div>
    </td>
    <td class="py-3 px-4">
      <span class="text-xs font-mono text-muted bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{ category.slug }}</span>
    </td>
    <td class="py-3 px-4 text-sm font-semibold text-primary-navy dark:text-white">
      <span class="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{{ category.type === 'main' ? 'قسم رئيسي' : 'قسم فرعي' }}</span>
    </td>
    <td class="py-3 px-4 text-sm font-semibold text-primary-navy dark:text-white">
      {{ category.productCount }} منتج
    </td>
    <td class="py-3 px-4">
      <div 
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
        :class="category.status === 'visible' ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-gray-800 text-muted'"
      >
        <div class="w-1.5 h-1.5 rounded-full" :class="category.status === 'visible' ? 'bg-success' : 'bg-muted'"></div>
        {{ category.status === 'visible' ? 'ظاهر' : 'مخفي' }}
      </div>
    </td>
    <td class="py-3 px-4 text-sm text-muted font-medium">
      {{ category.updatedAt }}
    </td>
    <td class="py-3 px-4 text-center">
      <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
        <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted transition-colors mx-auto">
          <Icon name="ph:dots-three-outline-vertical-fill" class="w-4 h-4" />
        </button>
        <template #panel>
          <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg w-48 p-1 flex flex-col">
            <button class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-right w-full">
              <Icon name="ph:pencil-simple-bold" class="w-4 h-4 text-muted" />
              تعديل
            </button>
            <button class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-right w-full">
              <Icon name="ph:eye-bold" class="w-4 h-4 text-muted" />
              عرض القسم
            </button>
            <button class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-right w-full">
              <Icon name="ph:plus-circle-bold" class="w-4 h-4 text-muted" />
              إضافة قسم فرعي
            </button>
            <button @click="toggleVisibility" class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-right w-full">
              <Icon :name="category.status === 'visible' ? 'ph:eye-slash-bold' : 'ph:eye-bold'" class="w-4 h-4 text-muted" />
              {{ category.status === 'visible' ? 'إخفاء' : 'إظهار' }}
            </button>
            <button class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-right w-full">
              <Icon name="ph:copy-bold" class="w-4 h-4 text-muted" />
              نسخ
            </button>
            <div class="h-px bg-border-light dark:bg-border-dark my-1 w-full"></div>
            <button @click="confirmDelete" class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/10 rounded-lg transition-colors text-right w-full">
              <Icon name="ph:trash-bold" class="w-4 h-4" />
              حذف
            </button>
          </div>
        </template>
      </UPopover>
    </td>
  </tr>
  
  <!-- Render Children -->
  <template v-if="!hideChildren && isExpanded && category.children">
    <CategoryTreeItem 
      v-for="child in category.children" 
      :key="child.id" 
      :category="child" 
      :level="level + 1"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategoriesStore, type Category } from '~/stores/categories'

const props = defineProps<{
  category: Category
  level: number
  hideChildren?: boolean
}>()

const store = useCategoriesStore()
const isExpanded = ref(true)

const isSelected = computed(() => store.selectedCategories.includes(props.category.id))

const toggleExpand = () => {
  if (props.category.children && props.category.children.length > 0) {
    isExpanded.value = !isExpanded.value
  }
}

const toggleVisibility = () => {
  store.updateVisibility(props.category.id, props.category.status === 'visible' ? 'hidden' : 'visible')
}

const confirmDelete = () => {
  if (confirm(`هل أنت متأكد من حذف قسم "${props.category.name}"؟`)) {
    store.deleteCategory(props.category.id)
  }
}
</script>
