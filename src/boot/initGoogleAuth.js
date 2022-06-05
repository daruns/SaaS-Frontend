import { boot } from 'quasar/wrappers'
import Auth from '../Auth';
const auth = new Auth({
  apiKey: process.env.GOOGLE_AUTH_KEY,
  clientId: process.env.GOOGLE_AUTH_APPID,
});
export default boot(({ store, router,app }) => {
  window.onGoogleApiLoad = async () => {
    console.log("boot/initGoogleAuth.js: ","auth"," --------");
    try {
      await auth.init();
      // On user log out.
      auth.addEventListener('loggedIn', () => {
        store.commit('auth/logIn');
        router.push('/');
      });
      // On user log in.
      auth.addEventListener('loggedOut', () => {
        store.commit('auth/logOut');
        router.push('/login');
      });
      // Load initial log in status.
      await store.dispatch('auth/loadInitialState');
    } catch (error) {
      document.write(error.message);
    }
  };
  window.onGoogleApiLoad()
})
