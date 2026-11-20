import type { RouteRecordRaw } from 'vue-router'
export const exploreRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: () => import('@/features/explore/pages/HomePage.vue') },
  {
    path: 'users/:userId',
    name: 'profile',
    component: () => import('@/features/explore/pages/UserProfilePage.vue'),
  },
]
