<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4 flex flex-col gap-3 relative" :style="{ marginRight: `${level * 16}px` }">
    <div class="flex gap-3 relative">
      <div 
        class="absolute -top-1 -right-1 w-5 h-5 rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center cursor-pointer transition-colors z-10"
        :class="{ 'bg-primary border-primary': isSelected }"
        @click="store.toggleCategorySelection(category.id)"
      >
        <Icon v-if="isSelected" name="ph:check-bold" class="w-3.5 h-3.5 text-white" />
      </div>

      <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
        <img v-if="category.image" :src="category.image" :alt="category.name" class="w-full h-full object-cover" />
        <Icon v-else name="ph:image-fill" class="w-6 h-6 text-gray-400" />
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start gap-2 mb-1">
          <div class="flex flex-col">
            <h3 class="font-bold text-primary-navy dark:text-white text-sm truncate flex items-center gap-1" @click="toggleExpand">
              {{ category.name }}
              <Icon v-if="category.children && category.children.length > 0" :name="isExpanded ? 'ph:caret-down-bold' : 'ph:caret-left-bold'" class="w-3 h-3 text-muted" />
            </h3>
            <span class="text-xs font-mono text-muted">{{ category.slug }}</span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <NuxtLink v-if="canManage" :to="`/dashboard/categories/${category.id}/edit`" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary transition-colors" title="تعديل">
              <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
        
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-semibold text-primary-navy dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {{ category.productCount }} منتج
          </span>
          <span class="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
            {{ category.type === 'main' ? 'قسم رئيسي' : 'قسم فرعي' }}
          </span>
          <div 
            class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold"
            :class="category.status === 'visible' ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-gray-800 text-muted'"
          >
            <div class="w-1.5 h-1.5 rounded-full" :class="category.status === 'visible' ? 'bg-success' : 'bg-muted'"></div>
            {{ category.status === 'visible' ? 'ظاهر' : 'مخفي' }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-if="isExpanded && category.children">
    <CategoryCard 
      v-for="child in category.children" 
      :key="child.id" 
      :category="child" 
      :level="level + 1"
    />
  </template>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { ref, computed } from 'vue'
import { useCategoriesStore, type Category } from '~/stores/categories'

const props = defineProps<{
  category: Category
  level: number
}>()

const store = useCategoriesStore()
const isExpanded = ref(true)

const isSelected = computed(() => store.selectedCategories.includes(props.category.id))

const toggleExpand = () => {
  if (props.category.children && props.category.children.length > 0) {
    isExpanded.value = !isExpanded.value
  }
}

const canManage = useCanManage('products')
</script>
