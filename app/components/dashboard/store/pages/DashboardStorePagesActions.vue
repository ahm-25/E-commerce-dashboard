<template>
  <div class="relative" ref="dropdownRef">
    <button @click.stop="toggleMenu" class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors">
      <Icon name="heroicons:ellipsis-horizontal" class="w-5 h-5" />
    </button>
    
    <div v-if="isOpen" 
      class="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1"
    >
      <NuxtLink :to="`/dashboard/store/pages/create?id=${page.id}`" class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:pencil" class="w-4 h-4 text-gray-400" />
        تعديل
      </NuxtLink>
      
      <button class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:eye" class="w-4 h-4 text-gray-400" />
        معاينة
      </button>

      <button @click="copySlug" class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:link" class="w-4 h-4 text-gray-400" />
        نسخ الرابط
      </button>
      
      <div class="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

      <button v-if="page.status !== 'published'" @click="publishPage" class="w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:globe-alt" class="w-4 h-4" />
        نشر
      </button>

      <button v-if="page.status === 'published'" @click="hidePage" class="w-full text-right px-4 py-2 text-sm text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:eye-slash" class="w-4 h-4" />
        إخفاء
      </button>

      <button @click="duplicatePage" class="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
        <Icon name="heroicons:document-duplicate" class="w-4 h-4 text-gray-400" />
        نسخ الصفحة
      </button>

      <button v-if="page.type !== 'system'" @click="deletePage" class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
        <Icon name="heroicons:trash" class="w-4 h-4" />
        حذف
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStorePagesStore } from '~/stores/storePages'

const props = defineProps<{
  page: any
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const store = useStorePagesStore()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const copySlug = () => {
  navigator.clipboard.writeText(`/${props.page.slug}`)
  alert('تم نسخ الرابط')
  closeMenu()
}

const publishPage = async () => {
  if (confirm('نشر الصفحة؟ سيتم إتاحة هذه الصفحة للعملاء على المتجر.')) {
    await store.publishPage(props.page.id)
    closeMenu()
  }
}

const hidePage = async () => {
  if (confirm('إخفاء الصفحة؟ لن تظهر الصفحة للعملاء، ولكن ستظل محفوظة.')) {
    await store.hidePage(props.page.id)
    closeMenu()
  }
}

const duplicatePage = async () => {
  await store.duplicatePage(props.page.id)
  closeMenu()
}

const deletePage = async () => {
  if (confirm('حذف الصفحة؟ سيتم حذف الصفحة نهائيًا.')) {
    await store.deletePage(props.page.id)
    closeMenu()
  }
}
</script>
