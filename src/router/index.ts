import { createRouter, createWebHistory } from 'vue-router'
import { exploreRoutes } from '@/features/explore/routes'
import { accountRoutes } from '@/features/account/routes'
// 開發用頁面：只在 npm run dev 時登記，正式版是空清單（規則見 spec/structure.md）
const devRoutes = import.meta.env.DEV
  ? [{ path: '/dev/components', component: () => import('@/dev/ComponentPlaygroundPage.vue') }]
  : []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [...exploreRoutes],
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [...accountRoutes],
    },
    ...devRoutes,
  ],
})

export default router
