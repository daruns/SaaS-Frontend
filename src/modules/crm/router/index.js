const routes = [
    {
      path: '/crm',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Index.vue') },
        { path: '/client/:id', component: () => import('../pages/ClientProfile.vue')},
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes