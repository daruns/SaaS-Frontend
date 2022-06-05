import { boot } from 'quasar/wrappers'
export default boot(async ({ app }) => {
  const canActivate = (subject,action) => {
    const user = JSON.parse(localStorage.getItem('myUserDetail'))
    const permissions = JSON.parse(localStorage.getItem('myUserPermissions'))
    if (user && user?.userType === 'owner') {
      return true
    }
    if (permissions) {
      if (permissions?.some(e => {return (e.subject.includes(subject) || subject.includes(e.subject)) && (e.action === action || e.action === 'all') }) ) {
        return true
      }
    }
    return false
  }
  app.config.globalProperties.$canActivate = canActivate
})