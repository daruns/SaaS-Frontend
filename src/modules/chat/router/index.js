const routes = [
    {
      path: '/chat',
      component: () => import('layouts/ChatLayout.vue'),
      meta: {needsAuth: true}
    }
  ]

export default routes