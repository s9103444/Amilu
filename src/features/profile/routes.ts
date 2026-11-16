export const profileRoutes = [
  {
    path: 'me/profile',
    name: 'profile-settings',
    component: () => import('@/features/profile/pages/ProfileSettingsPage.vue'),
  },
]
