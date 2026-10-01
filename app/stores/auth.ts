import { defineStore } from 'pinia'
import { useSystemStore, type PermissionLevel, type PermissionModule, type TeamMember } from '~/stores/system'

// TODO: Mock-only. The real API issues a token and checks the password server-side.
export const DEMO_PASSWORD = 'demo1234'
const SESSION_COOKIE = 'edix_session'
const LEVEL_RANK: Record<PermissionLevel, number> = { none: 0, view: 1, manage: 2 }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null as string | null
  }),

  getters: {
    user(): TeamMember | null {
      if (!this.userId) return null
      return useSystemStore().team.find(m => m.id === this.userId) || null
    },

    isLoggedIn(): boolean {
      return !!this.user && this.user.status === 'active'
    },

    can(): (module: PermissionModule, level?: PermissionLevel) => boolean {
      return (module, level = 'view') => {
        if (!this.user) return false
        const role = useSystemStore().roleById(this.user.roleId)
        return !!role && LEVEL_RANK[role.permissions[module]] >= LEVEL_RANK[level]
      }
    }
  },

  actions: {
    // Restores the session from the cookie; runs on the server and the client
    restoreSession() {
      const system = useSystemStore()
      system.seed()

      const cookie = useCookie<string | null>(SESSION_COOKIE)
      if (!cookie.value || cookie.value === this.userId) return

      const member = system.team.find(m => m.id === cookie.value)
      if (member && member.status === 'active') {
        this.userId = member.id
        system.setCurrentMember(member)
      } else {
        cookie.value = null
      }
    },

    async login(email: string, password: string, remember: boolean) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 700))

      const system = useSystemStore()
      system.seed()
      const member = system.team.find(m => m.email.toLowerCase() === email.trim().toLowerCase())

      // Same message for unknown email and wrong password, so emails can't be probed
      if (!member || password !== DEMO_PASSWORD) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      }
      if (member.status === 'invited') throw new Error('لم يتم قبول الدعوة بعد. افتح رابط الدعوة في بريدك لإنشاء كلمة المرور.')
      if (member.status === 'suspended') throw new Error('هذا الحساب موقوف. تواصل مع مالك المتجر.')

      const cookie = useCookie<string | null>(SESSION_COOKIE, {
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // session cookie unless "remember me"
        sameSite: 'lax'
      })
      cookie.value = member.id

      this.userId = member.id
      member.lastActiveAt = new Date().toISOString()
      system.setCurrentMember(member)
    },

    logout() {
      useCookie(SESSION_COOKIE).value = null
      this.userId = null
    }
  }
})
