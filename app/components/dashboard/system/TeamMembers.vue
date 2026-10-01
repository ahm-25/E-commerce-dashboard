<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-bold text-primary-navy dark:text-white font-ibm">فريق العمل</h2>
        <p class="text-xs text-muted mt-0.5">{{ activeCount }} نشط · {{ invitedCount }} دعوة معلّقة</p>
      </div>
      <button
        v-if="canManage"
        @click="openInvite"
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Icon name="ph:user-plus-bold" class="w-4 h-4" />
        دعوة موظف
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-right">
        <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted">
          <tr>
            <th class="px-5 py-2.5 font-bold">الموظف</th>
            <th class="px-5 py-2.5 font-bold">الدور</th>
            <th class="px-5 py-2.5 font-bold">الحالة</th>
            <th class="px-5 py-2.5 font-bold">آخر نشاط</th>
            <th class="px-5 py-2.5 font-bold w-28"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="member in store.team" :key="member.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <Icon v-if="!member.name" name="ph:envelope-simple" class="w-4 h-4" />
                  <template v-else>{{ member.name.charAt(0) }}</template>
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-primary-navy dark:text-white flex items-center gap-1.5">
                    {{ member.name || 'بانتظار قبول الدعوة' }}
                    <span v-if="member.id === currentUserId" class="text-[10px] font-bold text-muted">(أنت)</span>
                  </div>
                  <div class="text-xs text-muted truncate" dir="ltr">{{ member.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-5 py-3">
              <span v-if="member.isOwner || !canManage" class="font-bold text-primary-navy dark:text-white">{{ store.roleById(member.roleId)?.name }}</span>
              <select
                v-else
                :value="member.roleId"
                @change="store.updateMemberRole(member.id, ($event.target as HTMLSelectElement).value)"
                :aria-label="`دور ${member.name || member.email}`"
                class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary py-1.5 pr-3 pl-8"
              >
                <option v-for="role in assignableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </td>
            <td class="px-5 py-3">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold" :class="statusConfig[member.status].class">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[member.status].dot"></span>
                {{ statusConfig[member.status].label }}
              </span>
            </td>
            <td class="px-5 py-3 text-muted whitespace-nowrap">{{ formatRelativeTime(member.lastActiveAt) }}</td>
            <td class="px-5 py-3">
              <div v-if="!member.isOwner && canManage && member.id !== auth.userId" class="flex items-center justify-end gap-1">
                <button
                  v-if="member.status === 'invited'"
                  @click="resend(member)"
                  :disabled="resendingId === member.id"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  title="إعادة إرسال الدعوة"
                >
                  <Icon :name="resendingId === member.id ? 'ph:spinner-gap' : 'ph:paper-plane-tilt-bold'" class="w-4 h-4" :class="{ 'animate-spin': resendingId === member.id }" />
                </button>
                <button
                  v-else
                  @click="store.setMemberSuspended(member.id, member.status === 'active')"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-warning hover:bg-warning/10 transition-colors"
                  :title="member.status === 'active' ? 'إيقاف الحساب' : 'إعادة التفعيل'"
                >
                  <Icon :name="member.status === 'active' ? 'ph:prohibit-bold' : 'ph:arrow-counter-clockwise-bold'" class="w-4 h-4" />
                </button>
                <button
                  @click="remove(member)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  :title="member.status === 'invited' ? 'إلغاء الدعوة' : 'حذف الموظف'"
                >
                  <Icon name="ph:trash-bold" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invite Dialog -->
    <Teleport to="body">
      <div
        v-if="store.isInviteDialogOpen"
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeInvite"
      >
        <form class="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4" dir="rtl" @click.stop @submit.prevent="sendInvite">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">دعوة موظف</h3>
            <button type="button" @click="closeInvite" class="w-8 h-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-muted hover:text-danger transition-colors">
              <Icon name="ph:x-bold" class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm text-muted -mt-2">هيوصله إيميل فيه رابط لإنشاء كلمة مرور والدخول للوحة التحكم.</p>

          <div>
            <label :class="labelClass">البريد الإلكتروني <span class="text-danger">*</span></label>
            <input v-model="invite.email" type="email" dir="ltr" required :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">الاسم</label>
            <input v-model="invite.name" type="text" placeholder="اختياري" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">الدور</label>
            <select v-model="invite.roleId" :class="inputClass">
              <option v-for="role in assignableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <p class="text-xs text-muted mt-1.5">{{ store.roleById(invite.roleId)?.description }}</p>
          </div>

          <p v-if="inviteError" class="text-sm font-bold text-danger">{{ inviteError }}</p>

          <div class="flex gap-3 mt-2">
            <button type="button" @click="closeInvite" :disabled="sending" class="flex-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
              إلغاء
            </button>
            <button type="submit" :disabled="sending" class="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50">
              {{ sending ? 'جاري الإرسال...' : 'إرسال الدعوة' }}
            </button>
          </div>
        </form>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useSystemStore, type TeamMember } from '~/stores/system'
import { formatRelativeTime } from '~/composables/useRelativeTime'
import { useAuthStore } from '~/stores/auth'

const store = useSystemStore()

const auth = useAuthStore()
const currentUserId = computed(() => auth.userId)
const canManage = computed(() => auth.can('team', 'manage'))

const assignableRoles = computed(() => store.roles.filter(r => !r.isSystem))
const activeCount = computed(() => store.team.filter(m => m.status === 'active').length)
const invitedCount = computed(() => store.team.filter(m => m.status === 'invited').length)

const statusConfig = {
  active: { label: 'نشط', class: 'bg-success/10 text-success', dot: 'bg-success' },
  invited: { label: 'دعوة مرسلة', class: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  suspended: { label: 'موقوف', class: 'bg-gray-100 dark:bg-gray-800 text-muted', dot: 'bg-muted' }
}

const resendingId = ref<string | null>(null)

const resend = async (member: TeamMember) => {
  resendingId.value = member.id
  try {
    await store.resendInvite(member.id)
  } finally {
    resendingId.value = null
  }
}

const remove = (member: TeamMember) => {
  const message = member.status === 'invited'
    ? `إلغاء الدعوة المرسلة إلى ${member.email}؟`
    : `حذف ${member.name} من فريق العمل؟ لن يستطيع الدخول للوحة التحكم.`
  if (confirm(message)) store.removeMember(member.id)
}

// Invite
const invite = reactive({ email: '', name: '', roleId: '' })
const sending = ref(false)
const inviteError = ref('')

const openInvite = () => {
  Object.assign(invite, { email: '', name: '', roleId: assignableRoles.value[0]?.id || '' })
  inviteError.value = ''
  store.isInviteDialogOpen = true
}

const closeInvite = () => {
  if (!sending.value) store.isInviteDialogOpen = false
}

const sendInvite = async () => {
  inviteError.value = ''
  if (!/^\S+@\S+\.\S+$/.test(invite.email)) {
    inviteError.value = 'يرجى إدخال بريد إلكتروني صحيح'
    return
  }
  sending.value = true
  try {
    await store.inviteMember(invite.email.trim(), invite.name.trim(), invite.roleId)
    store.isInviteDialogOpen = false
  } catch (err: any) {
    inviteError.value = err.message || 'تعذر إرسال الدعوة'
  } finally {
    sending.value = false
  }
}

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
