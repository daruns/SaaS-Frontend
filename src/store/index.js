import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import example from './module-example'
import crmStore from '../modules/crm/store'
import accountingStore from '../modules/accounting/store'
import financeStore from '../modules/finance/store'
import projectStore from '../modules/projectsAndTasks/store'
import userStore from '../modules/Users/store'
import chatStore from '../modules/chat/store'
import socialMediaManagementStore from '../modules/socialMedia/store'
import hrmStore from '../modules/hrm/store'
import payrollStore from '../modules/payroll/store'
import auth from './auth'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
*/

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      example,
      crmStore,
      accountingStore,
      financeStore,
      userStore,
      projectStore,
      chatStore,
      socialMediaManagementStore,
      hrmStore,
      payrollStore,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
