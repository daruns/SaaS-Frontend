const routes = [
    {
      path: '/hrm',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '/hrm/employees', component: () => import('../pages/Index.vue') },
        { path: '/hrm/employee/:id', component: () => import('../pages/EmployeeProfile.vue')},
        { path: '/hrm/departments', component: () => import('../pages/Departments.vue')},
        { path: '/hrm/designations', component: () => import('../pages/Designations.vue')},
        { path: '/hrm/leaves', component: () => import('../pages/Leaves.vue')},
        { path: '/hrm/leaveTypes', component: () => import('../pages/LeaveTypes.vue')},
        { path: '/hrm/attendances', component: () => import('../pages/Attendances.vue')},
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes