import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { PermissionModule } from '~/stores/system'

// UI-only gate for create/edit/delete controls. The API must enforce the same rule.
export const useCanManage = (module: PermissionModule) => {
  const auth = useAuthStore()
  return computed(() => auth.can(module, 'manage'))
}
