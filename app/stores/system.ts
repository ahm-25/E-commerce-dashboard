import { defineStore } from 'pinia'

export interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  jobTitle: string
}

export type PermissionLevel = 'none' | 'view' | 'manage'

export const PERMISSION_MODULES = [
  { key: 'products', label: 'المنتجات والمخزون والأقسام' },
  { key: 'orders', label: 'الطلبات' },
  { key: 'customers', label: 'العملاء' },
  { key: 'discounts', label: 'العروض والخصومات' },
  { key: 'reviews', label: 'التقييمات' },
  { key: 'storefront', label: 'المظهر والصفحات' },
  { key: 'storeSettings', label: 'إعدادات المتجر والشحن والدفع' },
  { key: 'analytics', label: 'التحليلات والتقارير' },
  { key: 'team', label: 'الموظفين والصلاحيات' }
] as const

export type PermissionModule = typeof PERMISSION_MODULES[number]['key']

export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean // owner role can't be edited or deleted
  permissions: Record<PermissionModule, PermissionLevel>
}

export interface TeamMember {
  id: string
  name: string
  email: string
  roleId: string
  status: 'active' | 'invited' | 'suspended'
  lastActiveAt: string | null
  isOwner: boolean
}

export interface Session {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  lastActiveAt: string
  isCurrent: boolean
}

const allPermissions = (level: PermissionLevel) =>
  Object.fromEntries(PERMISSION_MODULES.map(m => [m.key, level])) as Record<PermissionModule, PermissionLevel>

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

const OWNER_PROFILE: UserProfile = {
  name: 'أحمد محمد',
  email: 'ahmed@ahmed-store.com',
  phone: '01012345678',
  avatar: 'https://i.pravatar.cc/150?img=11',
  jobTitle: 'مدير المتجر'
}

export const useSystemStore = defineStore('system', {
  state: () => ({
    // Profile of the signed-in user (set by the auth store)
    profile: { ...OWNER_PROFILE } as UserProfile,
    twoFactorEnabled: false,
    team: [] as TeamMember[],
    roles: [] as Role[],
    sessions: [] as Session[],
    loading: false,
    loaded: false,
    error: null as string | null,

    isInviteDialogOpen: false
  }),

  getters: {
    roleById: (state) => (id: string) => state.roles.find(r => r.id === id) || null,
    membersCountByRole: (state) => (roleId: string) => state.team.filter(m => m.roleId === roleId).length
  },

  actions: {
    async fetchSystem() {
      this.loading = true
      this.error = null
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 600))

        this.seed()
        this.loaded = true
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل إعدادات النظام'
      } finally {
        this.loading = false
      }
    },

    // Mock data, set synchronously so the auth middleware can resolve the
    // session on the server without waiting for the simulated API delay
    // TODO: Remove once team and roles come from the API
    seed() {
      if (this.roles.length) return
      this.roles = [
        {
          id: 'owner', name: 'مالك المتجر', description: 'صلاحيات كاملة على كل شيء', isSystem: true,
          permissions: allPermissions('manage')
        },
        {
          id: 'manager', name: 'مدير', description: 'إدارة المتجر بدون الموظفين والصلاحيات', isSystem: false,
          permissions: { ...allPermissions('manage'), team: 'view' }
        },
        {
          id: 'sales', name: 'موظف مبيعات', description: 'متابعة الطلبات والعملاء', isSystem: false,
          permissions: { ...allPermissions('none'), products: 'view', orders: 'manage', customers: 'manage', discounts: 'view', analytics: 'view' }
        },
        {
          id: 'support', name: 'دعم فني', description: 'الرد على العملاء والتقييمات', isSystem: false,
          permissions: { ...allPermissions('none'), orders: 'view', customers: 'view', reviews: 'manage' }
        },
        {
          id: 'content', name: 'محرر محتوى', description: 'المنتجات والمظهر والصفحات', isSystem: false,
          permissions: { ...allPermissions('none'), products: 'manage', storefront: 'manage', reviews: 'view' }
        }
      ]

      this.team = [
        { id: 'u1', name: OWNER_PROFILE.name, email: OWNER_PROFILE.email, roleId: 'owner', status: 'active', lastActiveAt: minutesAgo(0), isOwner: true },
        { id: 'u2', name: 'منى عادل', email: 'mona@ahmed-store.com', roleId: 'manager', status: 'active', lastActiveAt: minutesAgo(45), isOwner: false },
        { id: 'u3', name: 'كريم سامي', email: 'karim@ahmed-store.com', roleId: 'sales', status: 'active', lastActiveAt: minutesAgo(60 * 26), isOwner: false },
        { id: 'u4', name: 'ياسمين فؤاد', email: 'yasmin@ahmed-store.com', roleId: 'support', status: 'suspended', lastActiveAt: minutesAgo(60 * 24 * 12), isOwner: false },
        { id: 'u5', name: '', email: 'omar.designer@gmail.com', roleId: 'content', status: 'invited', lastActiveAt: null, isOwner: false }
      ]

      this.sessions = [
        { id: 's1', device: 'Windows', browser: 'Chrome', location: 'القاهرة، مصر', ip: '197.34.12.8', lastActiveAt: minutesAgo(0), isCurrent: true },
        { id: 's2', device: 'iPhone', browser: 'Safari', location: 'القاهرة، مصر', ip: '41.233.90.17', lastActiveAt: minutesAgo(180), isCurrent: false },
        { id: 's3', device: 'macOS', browser: 'Firefox', location: 'الإسكندرية، مصر', ip: '156.210.4.55', lastActiveAt: minutesAgo(60 * 24 * 5), isCurrent: false }
      ]
    },

    setCurrentMember(member: TeamMember) {
      this.profile = member.isOwner
        ? { ...OWNER_PROFILE, name: member.name, email: member.email }
        : { name: member.name, email: member.email, phone: '', avatar: '', jobTitle: this.roleById(member.roleId)?.name || '' }
    },

    // Account
    async updateProfile(profile: UserProfile) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600))
      const member = this.team.find(m => m.email === this.profile.email)
      if (member) {
        member.name = profile.name
        member.email = profile.email
      }
      this.profile = { ...profile }
    },

    async changePassword(currentPassword: string, _newPassword: string) {
      // TODO: Replace with actual API call; the server verifies the current password
      await new Promise(resolve => setTimeout(resolve, 800))
      if (currentPassword === 'wrong') throw new Error('كلمة المرور الحالية غير صحيحة')
    },

    // Team
    async inviteMember(email: string, name: string, roleId: string) {
      await new Promise(resolve => setTimeout(resolve, 600))
      if (this.team.some(m => m.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('هذا البريد مضاف بالفعل لفريق العمل')
      }
      this.team.push({
        id: `u-${Date.now()}`, name, email, roleId, status: 'invited', lastActiveAt: null, isOwner: false
      })
    },

    async updateMemberRole(id: string, roleId: string) {
      const member = this.team.find(m => m.id === id)
      if (member && !member.isOwner) member.roleId = roleId
    },

    async setMemberSuspended(id: string, suspended: boolean) {
      const member = this.team.find(m => m.id === id)
      if (member && !member.isOwner && member.status !== 'invited') {
        member.status = suspended ? 'suspended' : 'active'
      }
    },

    async removeMember(id: string) {
      this.team = this.team.filter(m => m.id !== id || m.isOwner)
    },

    async resendInvite(_id: string) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600))
    },

    // Roles
    async saveRole(role: Role) {
      await new Promise(resolve => setTimeout(resolve, 600))
      const index = this.roles.findIndex(r => r.id === role.id)
      if (index === -1) this.roles.push(role)
      else if (!this.roles[index].isSystem) this.roles[index] = role
    },

    async deleteRole(id: string) {
      const role = this.roles.find(r => r.id === id)
      if (!role || role.isSystem) return
      if (this.team.some(m => m.roleId === id)) {
        throw new Error('لا يمكن حذف دور مسند لموظفين. غيّر دورهم أولاً.')
      }
      this.roles = this.roles.filter(r => r.id !== id)
    },

    // Security
    async setTwoFactor(enabled: boolean) {
      await new Promise(resolve => setTimeout(resolve, 600))
      this.twoFactorEnabled = enabled
    },

    async revokeSession(id: string) {
      this.sessions = this.sessions.filter(s => s.id !== id || s.isCurrent)
    },

    async revokeOtherSessions() {
      await new Promise(resolve => setTimeout(resolve, 600))
      this.sessions = this.sessions.filter(s => s.isCurrent)
    }
  }
})
