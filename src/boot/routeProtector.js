import { boot } from 'quasar/wrappers'
import routes from 'src/router/routes'

export default boot(async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
    if(to.meta.needsAuth){
      if(localStorage.getItem('accessToken'))
      next()
      else{
        next('/login')
      }
    }else{
   if(to.path === '/login' && localStorage.getItem('accessToken')){
     next(from.path)
     return
   }
    next()
    }
  });
});