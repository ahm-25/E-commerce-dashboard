import type { PermissionLevel, PermissionModule } from '~/stores/system'

export interface RoutePermission {
  module: PermissionModule
  level: PermissionLevel
}

// First match wins; paths are prefixes under /dashboard
const ROUTE_MODULES: [string, PermissionModule][] = [
  ['/dashboard/products', 'products'],
  ['/dashboard/inventory', 'products'],
  ['/dashboard/categories', 'products'],
  ['/dashboard/orders', 'orders'],
  ['/dashboard/abandoned-carts', 'orders'],
  ['/dashboard/customers', 'customers'],
  ['/dashboard/discounts', 'discounts'],
  ['/dashboard/reviews', 'reviews'],
  ['/dashboard/store/appearance', 'storefront'],
  ['/dashboard/store/pages', 'storefront'],
  ['/dashboard/store/settings', 'storeSettings'],
  ['/dashboard/store/shipping', 'storeSettings'],
  ['/dashboard/store/payments', 'storeSettings'],
  ['/dashboard/store/marketing', 'storeSettings'],
  ['/dashboard/analytics', 'analytics'],
  ['/dashboard/reports', 'analytics']
]

// Pages that only create or edit need "manage", listing pages need "view"
const MANAGE_SEGMENTS = /\/(create|edit|import)(\/|$)/

export const getRoutePermission = (path: string): RoutePermission | null => {
  const match = ROUTE_MODULES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))
  if (!match) return null
  return { module: match[1], level: MANAGE_SEGMENTS.test(path) ? 'manage' : 'view' }
}
