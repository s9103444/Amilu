import { createRouter, createWebHistory } from 'vue-router'

// 開發用頁面：只在 npm run dev 時登記，正式版是空清單（規則見 spec/structure.md）
const devRoutes = import.meta.env.DEV
  ? [{ path: '/dev/components', component: () => import('@/dev/ComponentPlaygroundPage.vue') }]
  : []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 正式頁面之後加在這裡（匯入各功能的 routes.ts）
    ...devRoutes,
  ],
})

export default router
