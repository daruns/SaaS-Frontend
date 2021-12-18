const routes = [
    {
      path: '/chat',
      component: () => import('layouts/ChatLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/Conversation.vue') }
      ],
      meta: {needsAuth: true}
    }
  ]

export default routes