<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-6 flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">ملاحظات الطلب</h2>
    </div>

    <div class="flex-1 overflow-y-auto max-h-[300px] space-y-4 mb-4 pr-2">
      <div v-if="!order.notes || order.notes.length === 0" class="text-center py-6 text-muted text-sm border border-dashed border-border-light dark:border-border-dark rounded-xl">
        لا توجد ملاحظات على هذا الطلب
      </div>
      
      <div v-for="note in order.notes" :key="note.id" class="p-4 rounded-xl border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/20">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-navy flex items-center justify-center text-primary font-bold text-xs">
              {{ note.authorAvatar ? '' : note.authorName.substring(0, 2).toUpperCase() }}
              <img v-if="note.authorAvatar" :src="note.authorAvatar" alt="" class="w-full h-full rounded-full object-cover">
            </div>
            <div>
              <div class="font-bold text-sm text-primary-navy dark:text-white">{{ note.authorName }}</div>
              <div class="text-xs text-muted">{{ formatDate(note.createdAt) }}</div>
            </div>
          </div>
          <span 
            class="text-[10px] px-2 py-0.5 rounded-full font-bold"
            :class="note.type === 'internal' ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'"
          >
            {{ note.type === 'internal' ? 'داخلية' : 'للعميل' }}
          </span>
        </div>
        <p class="text-sm text-text leading-relaxed">{{ note.content }}</p>
      </div>
    </div>

    <button v-if="canManage" @click="$emit('add-note')" class="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm mt-auto shrink-0">
      <Icon name="ph:plus" class="w-5 h-5" />
      إضافة ملاحظة
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
const props = defineProps<{
  order: any
}>()

const emit = defineEmits(['add-note'])

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}

const canManage = useCanManage('orders')
</script>
