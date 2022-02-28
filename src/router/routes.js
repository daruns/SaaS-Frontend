import crmRoutes from '../modules/crm/router';
import financeRoutes from '../modules/finance/router';
import accountingRoutes from '../modules/accounting/router';
import projectRoutes from '../modules/projectsAndTasks/routes';
import usersRoutes from '../modules/Users/routes';
import chatRoutes from '../modules/chat/router';
import socialMedias from '../modules/socialMedia/router'
import hrmRoutes from '../modules/hrm/router'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/crm', component: () => import('pages/Index.vue') },
      {
        path: '/profile',
        component: () => import('pages/Profile.vue'),
        meta: {needsAuth: true}
      },
    ],
    meta: {needsAuth: true}
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    meta: {needsAuth: false}
  },
  // {
  //   path: '/signup',
  //   component: () => import('pages/Signup.vue'),
  //   meta: {needsAuth: false}
  // },
  ...crmRoutes,
  ...financeRoutes,
  ...accountingRoutes,
  ...projectRoutes,
  ...usersRoutes,
  ...chatRoutes,
  ...socialMedias,
  ...hrmRoutes,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
