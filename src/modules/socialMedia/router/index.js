const routes = [
    {
      path: '/social-media-management',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Index.vue') },
        { path: '/social-media-management/drafts/', component: () => import('../pages/drafts.vue')},
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes