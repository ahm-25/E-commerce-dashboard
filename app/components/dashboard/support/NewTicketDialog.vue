<template>
  <Teleport to="body">
    <div
      v-if="store.isNewTicketOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="close"
    >
      <form
        class="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        dir="rtl"
        @click.stop
        @submit.prevent="submit"
      >
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <h2 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">تذكرة دعم جديدة</h2>
          <button type="button" @click="close" class="w-8 h-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-danger transition-colors">
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex flex-col gap-4">
          <div>
            <label :class="labelClass">الموضوع <span class="text-danger">*</span></label>
            <input v-model="form.subject" type="text" maxlength="120" placeholder="وصف قصير للمشكلة" :class="inputClass" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label :class="labelClass">القسم</label>
              <select v-model="form.category" :class="inputClass">
                <option v-for="(label, key) in TICKET_CATEGORIES" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div>
              <label :class="labelClass">الأولوية</label>
              <select v-model="form.priority" :class="inputClass">
                <option v-for="(label, key) in TICKET_PRIORITIES" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
          </div>
          <div>
            <label :class="labelClass">التفاصيل <span class="text-danger">*</span></label>
            <textarea
              v-model="form.body"
              rows="6"
              placeholder="اكتب الخطوات اللي عملتها، والرسالة اللي ظهرتلك، ورقم الطلب لو موجود"
              :class="inputClass"
            ></textarea>
            <p class="text-xs mt-1" :class="form.body.trim().length < 20 ? 'text-muted' : 'text-success'">
              {{ form.body.trim().length < 20 ? `اكتب ${20 - form.body.trim().length} حرف كمان على الأقل` : 'تمام' }}
            </p>
          </div>

          <p v-if="form.priority === 'urgent'" class="text-xs font-bold text-warning bg-warning/10 rounded-lg p-3 flex items-start gap-2">
            <Icon name="ph:warning-bold" class="w-4 h-4 shrink-0" />
            لو المتجر متوقف تماماً، كلمنا على واتساب كمان عشان نوصلك أسرع.
          </p>

          <p v-if="error" class="text-sm font-bold text-danger">{{ error }}</p>
        </div>

        <div class="px-6 py-4 border-t border-border-light dark:border-border-dark flex gap-3 justify-end">
          <button type="button" @click="close" :disabled="sending" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
            إلغاء
          </button>
          <button type="submit" :disabled="sending" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[120px]">
            {{ sending ? 'جاري الإرسال...' : 'إرسال التذكرة' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useSupportStore, TICKET_CATEGORIES, TICKET_PRIORITIES, type TicketCategory, type TicketPriority } from '~/stores/support'

const props = defineProps<{
  initialSubject?: string
}>()

const store = useSupportStore()

const form = reactive({ subject: '', category: 'other' as TicketCategory, priority: 'normal' as TicketPriority, body: '' })
const sending = ref(false)
const error = ref('')

watch(() => store.isNewTicketOpen, (open) => {
  if (!open) return
  Object.assign(form, { subject: props.initialSubject || '', category: 'other', priority: 'normal', body: '' })
  error.value = ''
})

const close = () => {
  if (sending.value) return
  if ((form.subject || form.body) && !confirm('تجاهل التذكرة اللي بتكتبها؟')) return
  store.isNewTicketOpen = false
}

const submit = async () => {
  error.value = ''
  if (!form.subject.trim()) {
    error.value = 'يرجى كتابة موضوع التذكرة'
    return
  }
  if (form.body.trim().length < 20) {
    error.value = 'يرجى كتابة تفاصيل أكتر عشان نقدر نساعدك'
    return
  }
  sending.value = true
  try {
    const ticket = await store.createTicket({ ...form, subject: form.subject.trim(), body: form.body.trim() })
    store.isNewTicketOpen = false
    await navigateTo(`/dashboard/support/${ticket.id}`)
  } catch (err: any) {
    error.value = err.message || 'تعذر إرسال التذكرة'
  } finally {
    sending.value = false
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && store.isNewTicketOpen) close()
}
onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
