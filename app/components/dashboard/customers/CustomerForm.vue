<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity flex items-center justify-center p-4 sm:p-6"
      @click="handleClose"
    >
      <!-- Dialog -->
      <div 
        class="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
          <h2 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">
            {{ isEditing ? 'تعديل بيانات العميل' : 'إضافة عميل جديد' }}
          </h2>
          <button 
            @click="handleClose"
            class="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-red-500 transition-colors shadow-sm"
          >
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
            <!-- Name -->
            <div class="flex flex-col gap-1.5">
              <label for="name" class="text-sm font-bold text-primary-navy dark:text-white">
                الاسم بالكامل <span class="text-red-500">*</span>
              </label>
              <input 
                id="name" 
                v-model="form.name" 
                type="text" 
                required
                class="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-colors" 
                placeholder="أدخل اسم العميل"
              >
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm font-bold text-primary-navy dark:text-white">
                البريد الإلكتروني
              </label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                class="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-colors text-right" 
                placeholder="example@domain.com"
                dir="ltr"
              >
            </div>

            <!-- Phone -->
            <div class="flex flex-col gap-1.5">
              <label for="phone" class="text-sm font-bold text-primary-navy dark:text-white">
                رقم الهاتف
              </label>
              <input 
                id="phone" 
                v-model="form.phone" 
                type="tel" 
                class="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-colors text-right" 
                placeholder="01xxxxxxxxx"
                dir="ltr"
              >
            </div>

            <!-- Status -->
            <div class="flex flex-col gap-1.5">
              <label for="status" class="text-sm font-bold text-primary-navy dark:text-white">
                حالة العميل
              </label>
              <select 
                id="status" 
                v-model="form.status" 
                class="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-colors appearance-none"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
              </select>
            </div>
            
            <div v-if="error" class="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-500/10 p-3 rounded-lg flex items-center gap-2">
              <Icon name="ph:warning-circle-bold" class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/20 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
          <button 
            type="button"
            @click="handleClose"
            class="px-6 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
          >
            <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="w-4 h-4 animate-spin" />
            <Icon v-else name="ph:check-bold" class="w-4 h-4" />
            {{ isEditing ? 'حفظ التعديلات' : 'إضافة العميل' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCustomersStore, type Customer } from '~/stores/customers'

const store = useCustomersStore()

const isOpen = computed(() => store.isAddCustomerOpen || store.isEditCustomerOpen)
const isEditing = computed(() => store.isEditCustomerOpen)

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  status: 'active' as 'active' | 'inactive' | 'blocked'
})

// Initialize form when dialog opens
watch(() => isOpen.value, (newVal) => {
  if (newVal) {
    if (isEditing.value && store.customerToEdit) {
      form.value = {
        name: store.customerToEdit.name,
        email: store.customerToEdit.email || '',
        phone: store.customerToEdit.phone || '',
        status: store.customerToEdit.status
      }
    } else {
      form.value = {
        name: '',
        email: '',
        phone: '',
        status: 'active'
      }
    }
    error.value = null
  }
})

const handleClose = () => {
  if (isSubmitting.value) return
  if (isEditing.value) {
    store.closeEditCustomer()
  } else {
    store.closeAddCustomer()
  }
}

const validateForm = () => {
  if (!form.value.name.trim()) {
    error.value = 'الاسم بالكامل مطلوب'
    return false
  }
  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    error.value = 'البريد الإلكتروني غير صالح'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  error.value = null
  isSubmitting.value = true
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, we would update the store with response from API
    
    handleClose()
    
    // Would normally show toast here
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء حفظ البيانات'
  } finally {
    isSubmitting.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
