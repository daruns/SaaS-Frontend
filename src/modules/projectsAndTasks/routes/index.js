const routes = [
    {
      path: '/projects',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '/projects/dashboard', component: () => import('../pages/Index.vue') },
        { path: '/projects/tasks', component: () => import('../pages/Task.vue') },
        { path: '/projects/:id', component: () => import('../pages/Project.vue') }
      ],
      meta: {needsAuth: true}
    }
  ]

export default routes