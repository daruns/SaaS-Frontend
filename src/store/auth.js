const auth = {
  namespaced: true,

  state() {
    return {
      isLoggedIn: null,
    };
  },

  mutations: {
    googleLogIn(state) {
      state.isLoggedIn = true;
    },

    googleLogOut(state) {
      state.isLoggedIn = false;
    },
  },

  actions: {
    loadInitialState(context) {
      window.gapi.auth2.getAuthInstance().isSignedIn.get()
        ? context.commit('googleLogIn')
        : context.commit('googleLogOut');
    },
    googleLogIn() {
      const getauthinst = window.gapi.auth2.getAuthInstance().signIn();
      console.log("getauthinstance: ", getauthinst)
    },

    googleLogOut() {
      window.gapi.auth2.getAuthInstance().signOut();
    },
  },
};

export default auth;
