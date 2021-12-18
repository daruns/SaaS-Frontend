const routes = [
    {
      path: '/finance',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '/finance/invoice', component: () => import('../pages/Invoice.vue') },
        { path: '/finance/invoice/:id', component: () => import('../pages/InvoiceShow.vue') },
        { path: '/finance/quotation', component: () => import('../pages/Quotation.vue') },
        { path: '/finance/quote/:id', component: () => import('../pages/QuoteShow.vue') },
        { path: '/finance/taxes', component: () => import('../pages/Taxes.vue') },
        { path: '/finance/categories', component: () => import('../pages/Categories.vue') },
        { path: '/finance/suppliers', component: () => import('../pages/Suppliers.vue') },
        { path: '/finance/payment', component: () => import('../pages/PaymentMethods.vue') },
        { path: '/finance/expenses', component: () => import('../pages/Expenses.vue') },
        { path: '/finance/expense/:id', component: () => import('../pages/ExpenseShow.vue') }
      ],
      meta: {needsAuth: true}
    }
  ]

export default routes