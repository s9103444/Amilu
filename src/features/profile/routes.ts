export const profileRoutes = [
  {
    path: 'me/profile',
    name: 'profile-settings',
    component: () => import('@/features/profile/pages/ProfileSettingsPage.vue'),
  },
  {
    path: 'me/settings',
    name: 'creator-settings',
    component: () => import('@/features/profile/pages/CreatorSettingsPage.vue'),
  },
]
