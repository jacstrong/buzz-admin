import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      // name: 'index',
      component: () => import(/* webpackChunkName: "Index" */ './views/admin/AdminIndex.vue'),
      children: [
        {
          path: '', name: 'dashboard', component: () => import(/* webpackChunkName: "Dashboard" */ './views/admin/Dashboard.vue')
        },
        {
          path: 'managestore/:id', name: 'ManageStore', component: () => import(/* webpackChunkName: "ManageStore" */ './views/admin/store/ManageStore.vue')
        },
        {
          path: 'manageorders/:id', name: 'ManageOrders', component: () => import(/* webpackChunkName: "ManageStore" */ './views/admin/store/ManageOrders.vue')
        },
        {
          path: 'manageusers', name: 'ManageUsers', component: () => import(/* webpackChunkName: "ManageUsers" */ './views/admin/user/ManageUsers.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ './views/Login.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ './views/Login.vue')
    },
    {
      path: '/emailconfirmation/:id',
      name: 'EmailConfirmation',
      component: () => import(/* webpackChunkName: "EmailConfirmation" */ './views/EmailConfirmation.vue')
    },
    {
      path: '/cancelemailconfirmation/:id',
      name: 'CancelEmailVerification',
      component: () => import(/* webpackChunkName: "CancelEmailVerification" */ './views/CancelEmailConfirmation.vue')
    },
    {
      path: '/passwordreset/',
      name: 'PasswordReset',
      component: () => import(/* webpackChunkName: "CancelEmailVerification" */ './views/PasswordReset.vue')
    },
    {
      path: '/passwordreset/:id',
      name: 'PasswordReset',
      component: () => import(/* webpackChunkName: "CancelEmailVerification" */ './views/PasswordReset.vue')
    }
  ],
  
})

router.onError(e => {
  console.log(e)
})

export default router
