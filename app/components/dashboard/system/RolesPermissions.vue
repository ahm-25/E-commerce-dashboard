<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    <!-- Role list -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <h2 class="font-bold text-primary-navy dark:text-white font-ibm">الأدوار</h2>
        <button v-if="canManage" @click="startNewRole" class="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          <Icon name="ph:plus-bold" class="w-3.5 h-3.5" />
          دور جديد
        </button>
      </div>
      <div class="divide-y divide-border-light dark:divide-border-dark">
        <button
          v-for="role in store.roles"
          :key="role.id"
          @click="selectRole(role.id)"
          class="w-full text-right px-5 py-3 transition-colors"
          :class="selectedId === role.id ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold" :class="selectedId === role.id ? 'text-primary' : 'text-primary-navy dark:text-white'">
              {{ role.name }}
              <Icon v-if="role.isSystem" name="ph:lock-simple-bold" class="w-3.5 h-3.5 text-muted inline" />
            </span>
            <span class="text-xs text-muted shrink-0">{{ store.membersCountByRole(role.id) }} موظف</span>
          </div>
          <p class="text-xs text-muted mt-0.5">{{ role.description }}</p>
        </button>
        <div v-if="draft && isNew" class="px-5 py-3 bg-primary/5">
          <span class="font-bold text-primary">{{ draft.name || 'دور جديد' }}</span>
          <p class="text-xs text-muted mt-0.5">غير محفوظ</p>
        </div>
      </div>
    </div>

    <!-- Permission editor -->
    <div v-if="draft" class="lg:col-span-2 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-border-light dark:border-border-dark grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">اسم الدور <span class="text-danger">*</span></label>
          <input v-model="draft.name" type="text" :disabled="readOnly" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">الوصف</label>
          <input v-model="draft.description" type="text" :disabled="readOnly" :class="inputClass" />
        </div>
      </div>

      <div v-if="draft.isSystem" class="mx-5 mt-5 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-muted font-bold">
        <Icon name="ph:lock-simple-bold" class="w-4 h-4 shrink-0" />
        دور المالك ثابت وله كل الصلاحيات، ولا يمكن تعديله.
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-right">
          <thead class="text-muted">
            <tr>
              <th class="px-5 py-3 font-bold">القسم</th>
              <th v-for="level in levels" :key="level.value" class="px-3 py-3 font-bold text-center w-24">
                {{ level.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light dark:divide-border-dark">
            <tr v-for="module in PERMISSION_MODULES" :key="module.key">
              <td class="px-5 py-3 font-bold text-primary-navy dark:text-white">{{ module.label }}</td>
              <td v-for="level in levels" :key="level.value" class="px-3 py-3 text-center">
                <input
                  type="radio"
                  :name="`perm-${module.key}`"
                  :value="level.value"
                  v-model="draft.permissions[module.key]"
                  :disabled="readOnly"
                  :aria-label="`${module.label}: ${level.label}`"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-3 bg-gray-50 dark:bg-gray-800/40 text-xs text-muted">
        <span class="font-bold">عرض:</span> يشوف البيانات بس ·
        <span class="font-bold">إدارة:</span> يضيف ويعدّل ويحذف
      </div>

      <div v-if="!readOnly" class="p-5 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-3">
        <button
          v-if="!isNew"
          @click="removeRole"
          class="text-sm font-bold text-danger hover:bg-danger/10 px-3 py-2 rounded-lg transition-colors"
        >
          حذف الدور
        </button>
        <span v-else></span>
        <div class="flex items-center gap-3">
          <span v-if="justSaved" class="text-sm font-bold text-success flex items-center gap-1.5">
            <Icon name="ph:check-circle-bold" class="w-5 h-5" />
            تم الحفظ
          </span>
          <button v-if="isDirty" @click="discard" :disabled="saving" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
            تجاهل
          </button>
          <button @click="save" :disabled="saving || !isDirty" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50 min-w-[110px]">
            {{ saving ? 'جاري الحفظ...' : 'حفظ الدور' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSystemStore, PERMISSION_MODULES, type Role, type PermissionModule, type PermissionLevel } from '~/stores/system'

const store = useSystemStore()
const auth = useAuthStore()

const canManage = computed(() => auth.can('team', 'manage'))
const readOnly = computed(() => !draft.value || draft.value.isSystem || !canManage.value)

const levels: { value: PermissionLevel, label: string }[] = [
  { value: 'none', label: 'بدون' },
  { value: 'view', label: 'عرض' },
  { value: 'manage', label: 'إدارة' }
]

const selectedId = ref<string | null>(store.roles.find(r => !r.isSystem)?.id || store.roles[0]?.id || null)
const draft = ref<Role | null>(null)
const isNew = ref(false)
const saving = ref(false)
const justSaved = ref(false)

const loadDraft = () => {
  const role = selectedId.value ? store.roleById(selectedId.value) : null
  draft.value = role ? structuredClone(toRaw(role)) : null
  isNew.value = false
}
loadDraft()

const isDirty = computed(() => {
  if (!draft.value) return false
  if (isNew.value) return true
  return JSON.stringify(draft.value) !== JSON.stringify(store.roleById(draft.value.id))
})

const confirmDiscard = () => !isDirty.value || confirm('لديك تغييرات غير محفوظة على هذا الدور. تجاهلها؟')

const selectRole = (id: string) => {
  if (id === selectedId.value && !isNew.value) return
  if (!confirmDiscard()) return
  selectedId.value = id
  loadDraft()
}

const startNewRole = () => {
  if (!confirmDiscard()) return
  selectedId.value = null
  isNew.value = true
  draft.value = {
    id: `role-${Date.now()}`,
    name: '',
    description: '',
    isSystem: false,
    permissions: Object.fromEntries(PERMISSION_MODULES.map(m => [m.key, 'none'])) as Record<PermissionModule, PermissionLevel>
  }
}

const discard = () => {
  if (isNew.value) {
    selectedId.value = store.roles.find(r => !r.isSystem)?.id || null
  }
  loadDraft()
}

const save = async () => {
  if (!draft.value) return
  if (!draft.value.name.trim()) return alert('يرجى إدخال اسم الدور')
  if (store.roles.some(r => r.name === draft.value!.name.trim() && r.id !== draft.value!.id)) {
    return alert('يوجد دور بنفس الاسم')
  }

  saving.value = true
  try {
    await store.saveRole({ ...draft.value, name: draft.value.name.trim() })
    selectedId.value = draft.value.id
    loadDraft()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 2500)
  } finally {
    saving.value = false
  }
}

const removeRole = async () => {
  if (!draft.value || !confirm(`حذف دور "${draft.value.name}"؟`)) return
  try {
    await store.deleteRole(draft.value.id)
    selectedId.value = store.roles.find(r => !r.isSystem)?.id || null
    loadDraft()
  } catch (err: any) {
    alert(err.message)
  }
}

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors disabled:opacity-60'
</script>
