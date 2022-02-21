import axios from 'axios';
import { boot } from 'quasar/wrappers'
import routes from 'src/router/routes'
import { getUser } from 'src/store/module-example/index'

export default boot(async ({ app, router }) => {
  async function checkAuth(token) {
    var authed = false;
    try {
      let res = await axios.get(process.env.OC_BACKEND_API + 'auth/me', {headers: {Authorization: localStorage.getItem('accessToken')}});
      authed = res.data?.success
    } catch(err) {
      localStorage.removeItem('tab')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('accessToken')
      console.log('error:    sxscsc  ', err)
    }
    return authed
  }

  router.beforeEach((to, from, next) => {
    if(to.meta.needsAuth){
      if(localStorage.getItem('accessToken') && checkAuth(localStorage.getItem('accessToken')))
      next()
      else{
        next('/login')
      }
    }else{
   if(to.path === '/login' && localStorage.getItem('accessToken') && checkAuth(localStorage.getItem('accessToken'))){
     next(from.path)
     return
   }
    next()
    }
  });
});