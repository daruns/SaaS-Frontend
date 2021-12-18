const routes = [
    {
      path: '/users',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Index.vue') }
      ],
      meta: {needsAuth: true}
    }
  ]

export default routes