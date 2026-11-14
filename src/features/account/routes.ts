import type { RouteRecordRaw } from 'vue-router'
export const accountRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/features/account/pages/LoginPage.vue'),
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/features/account/pages/RegisterPage.vue'),
  },
]
