import { createRouter, createWebHashHistory } from 'vue-router'
import LoginOrRegister from '/@/containers/loginOrRegister/index.vue'
import DashBoard from '/@/containers/DashBoard/index.vue'
import store from '/@/store/index.js'

const routes = [
  {
    path: '/',
    redirect: { name: 'loginOrRegister' }
  },
  {
    path: '/dashBoard',
    name: 'dashBoard',
    component: DashBoard
  },
  {
    path: '/loginOrRegister',
    name: 'loginOrRegister',
    component: LoginOrRegister
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'dashBoard') {
    if (store.user.userId) {
      next()
    } else {
      next({ name: 'loginOrRegister' })
    }
  } else next()
})

export default router
