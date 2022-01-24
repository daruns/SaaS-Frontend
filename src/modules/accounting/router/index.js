const routes = [
    {
      path: '/accounting',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '/finance/accounting', component: () => import('../pages/Index.vue') }
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes