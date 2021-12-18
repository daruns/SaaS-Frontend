const routes = [
    {
      path: '/accounting',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Index.vue') }
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes