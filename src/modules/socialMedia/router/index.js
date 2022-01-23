const routes = [
    {
      path: '/social-media-management',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Index.vue') },
        { path: '/social-media-management/drafts/', component: () => import('../pages/drafts.vue')},
        { path: '/social-media-management/calendar/', component: () => import('../pages/calendar.vue')},
        { path: '/social-media-management/posts/', component: () => import('../pages/Posts.vue')},
        { path: '/social-media-management/productions/', component: () => import('../pages/productions.vue')},
        { path: '/social-media-management/reviews/', component: () => import('../pages/reviews.vue')},
        { path: '/social-media-management/rejecteds/', component: () => import('../pages/rejecteds.vue')},
        { path: '/social-media-management/completeds/', component: () => import('../pages/completeds.vue')},
        { path: '/social-media-management/post/:id', component: () => import('../pages/PostProfile.vue') },
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes