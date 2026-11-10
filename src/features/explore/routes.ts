import type { RouteRecordRaw } from 'vue-router'
export const exploreRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: () => import('@/features/explore/pages/HomePage.vue') },
]
