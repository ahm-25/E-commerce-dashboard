// Admin API requires the dashboard session cookie (set by stores/auth.ts on login)
export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/admin/')) return
  if (!getCookie(event, 'edix_session')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
