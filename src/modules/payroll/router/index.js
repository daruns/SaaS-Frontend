const routes = [
    {
      path: '/payroll',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '/payroll/payslips', component: () => import('../pages/Payslips.vue') },
        { path: '/payroll/payslip/:id', component: () => import('../pages/PayslipShow.vue')},
        { path: '/payroll/earnings', component: () => import('../pages/Earnings.vue')},
        { path: '/payroll/earningTypes', component: () => import('../pages/EarningTypes.vue')},
        { path: '/payroll/deductions', component: () => import('../pages/Deductions.vue')},
        { path: '/payroll/deductionTypes', component: () => import('../pages/DeductionTypes.vue')},
      ],
      meta: {needsAuth: true}
    },
  ]

export default routes