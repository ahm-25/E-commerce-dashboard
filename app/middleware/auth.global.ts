import { useAuthStore } from '~/stores/auth'
import { getRoutePermission } from '~/utils/routePermissions'

export default defineNuxtRouteMiddleware((to) => {
  const isLoginPage = to.path === '/login'
  const isDashboard = to.path === '/dashboard' || to.path.startsWith('/dashboard/')
  if (!isLoginPage && !isDashboard) return

  const auth = useAuthStore()
  auth.restoreSession()

  if (isLoginPage) {
    if (auth.isLoggedIn) {
      const redirect = to.query.redirect as string | undefined
      // Only follow internal redirects
      return navigateTo(redirect?.startsWith('/dashboard') ? redirect : '/dashboard', { replace: true })
    }
    return
  }

  if (!auth.isLoggedIn) {
    return navigateTo({ path: '/login', query: to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : {} }, { replace: true })
  }

  const required = getRoutePermission(to.path)
  if (required && !auth.can(required.module, required.level)) {
    return navigateTo({ path: '/dashboard/no-access', query: { from: to.fullPath } }, { replace: true })
  }
})
