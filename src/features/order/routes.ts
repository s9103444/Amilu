export const orderRoutes = [
  {
    path: 'me/orders',
    name: 'orders',
    component: () => import('@/features/order/pages/OrderManagementPage.vue'),
  },
]
