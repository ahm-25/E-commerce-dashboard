<template>
  <div>
    <!-- Bulk Actions -->
    <DashboardStorePagesStorePagesBulkActions />

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-right">
        <thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-4 py-3 font-medium w-12">
              <input type="checkbox" :checked="allSelected" @change="e => toggleSelectAll((e.target as HTMLInputElement).checked)" class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-primary focus:ring-primary/40 focus:border-primary cursor-pointer" />
            </th>
            <th class="px-4 py-3 font-medium">الصفحة</th>
            <th class="px-4 py-3 font-medium">الرابط</th>
            <th class="px-4 py-3 font-medium">النوع</th>
            <th class="px-4 py-3 font-medium">الحالة</th>
            <th class="px-4 py-3 font-medium">SEO</th>
            <th class="px-4 py-3 font-medium">تاريخ التحديث</th>
            <th class="px-4 py-3 font-medium w-16">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          
          <tr v-if="store.loading" v-for="i in 5" :key="i" class="animate-pulse">
            <td class="px-4 py-4"><div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
                <div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1.5"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
            <td class="px-4 py-4"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
            <td class="px-4 py-4"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
            <td class="px-4 py-4"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
            <td class="px-4 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
            <td class="px-4 py-4"><div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
          </tr>
          
          <tr v-else-if="filteredPages.length === 0">
            <td colspan="8" class="px-4 py-16 text-center text-gray-500">
              <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                  <Icon name="heroicons:document-magnifying-glass" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p class="text-base font-semibold text-gray-900 dark:text-white">لم يتم العثور على صفحات</p>
                <p class="text-sm mt-1 mb-5 text-gray-500">جرّب تغيير البحث أو إزالة بعض الفلاتر للعثور على ما تبحث عنه.</p>
                <button v-if="hasActiveFilters || searchQuery" @click="clearSearchAndFilters" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-surface-dark dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors">
                  مسح الفلاتر والبحث
                </button>
                <NuxtLink v-else to="/dashboard/store/pages/create" class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                  + إضافة صفحة
                </NuxtLink>
              </div>
            </td>
          </tr>

          <tr v-for="page in filteredPages" :key="page.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
            <td class="px-4 py-3">
              <input type="checkbox" :checked="isSelected(page.id)" @change="toggleSelect(page.id)" class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-primary focus:ring-primary/40 focus:border-primary cursor-pointer" />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex flex-shrink-0 items-center justify-center text-gray-500">
                  <Icon :name="getPageIcon(page.slug)" class="w-4 h-4" />
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ page.title }}</div>
                  <div class="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{{ stripTags(page.content) || 'بدون محتوى' }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded text-xs block font-mono" dir="ltr">/{{ page.slug }}</span>
                <button @click="copySlug(page.slug)" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" title="نسخ الرابط">
                  <Icon name="heroicons:clipboard-document" class="w-4 h-4" />
                </button>
              </div>
            </td>
            <td class="px-4 py-3">
              <span v-if="page.type === 'system'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                أساسية
              </span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                مخصصة
              </span>
            </td>
            <td class="px-4 py-3">
              <span v-if="page.status === 'published'" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> منشورة
              </span>
              <span v-else-if="page.status === 'draft'" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span> مسودة
              </span>
              <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> مخفية
              </span>
            </td>
            <td class="px-4 py-3">
              <span v-if="page.seo?.title && page.seo?.description" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
                مكتمل
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" />
                غير مكتمل
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">
              {{ new Date(page.updatedAt).toLocaleDateString('ar-EG') }}
            </td>
            <td class="px-4 py-3">
              <DashboardStorePagesActions :page="page" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorePages } from '~/composables/useStorePages'

const { 
  store, 
  filteredPages,
  searchQuery,
  hasActiveFilters,
  clearFilters,
  isSelected,
  toggleSelect,
  toggleSelectAll,
  allSelected
} = useStorePages()

const clearSearchAndFilters = () => {
  searchQuery.value = ''
  clearFilters()
}

const stripTags = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

const getPageIcon = (slug: string) => {
  switch (slug) {
    case 'about':
    case 'about-us': return 'heroicons:information-circle'
    case 'contact':
    case 'contact-us': return 'heroicons:envelope'
    case 'privacy':
    case 'privacy-policy': return 'heroicons:shield-check'
    case 'terms':
    case 'terms-and-conditions': return 'heroicons:document-text'
    case 'faq': return 'heroicons:question-mark-circle'
    case 'shipping':
    case 'shipping-policy': return 'heroicons:truck'
    case 'refund':
    case 'refund-policy': return 'heroicons:arrow-path'
    default: return 'heroicons:document'
  }
}

const copySlug = (slug: string) => {
  navigator.clipboard.writeText(`/${slug}`)
  alert('تم نسخ الرابط: /' + slug)
}
</script>
