import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snack: '',
    auth: {
      firstName: '',
      email: '',
      token: '',
      id: ''
    },
    isLoggedIn: false,
    authChecked: false
  },
  mutations: {
    setSnack (state, snack) {
      state.snack = snack;
    },
    setAuth (state, auth) {
      state.auth.firstName = auth.firstName;
      state.auth.email = auth.email;
      state.auth.token = `Token ${auth.token}`;
      state.auth.id = auth._id;
      cookie.set('token', `Token ${auth.token}`)
      cookie.set('email', auth.email)
      cookie.set('id', auth._id)
      cookie.set('firstName', auth.firstName)
      state.isLoggedIn = true;
    },
    clearAuth (state) {
      state.auth = {
        firstName: '',
        email: '',
        token: '',
        id: ''
      }
      state.isLoggedIn = false
      cookie.remove('token')
      cookie.remove('email')
      cookie.remove('id')
      cookie.remove('firstName')
    },
    getAuthFromCookie (state) {
      state.auth.firstName = cookie.get('firstName');
      state.auth.email = cookie.get('email');
      state.auth.token = cookie.get('token');
      state.auth.id = cookie.get('id');
      state.isLoggedIn = true;
    }
  },
  getters: {
    isLoggedIn: (state) => {
      return state.isLoggedIn;
    }
  },
  actions: {
    checkCurrentUser: (context, callback) => {
      // if (cookie.get('token') != undefined) {
      //   context.commit('getAuthFromCookie');
      // }
      // console.log(callback)
      Vue.prototype.$http.get(`/api/admin/user/`)
        .then(response => {
          if (response.data.success === true) context.commit('getAuthFromCookie');
          if (callback) callback();
        })
        .catch(err => {
          console.log(err)
        });
      
    }
  }
})
