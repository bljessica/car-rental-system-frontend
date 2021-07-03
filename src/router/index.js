import { createRouter, createWebHashHistory } from 'vue-router'

import LoginOrRegister from '/@/containers/loginOrRegister/index.vue'
import DashBoard from '/@/containers/DashBoard.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'dashBoard' }
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

export default router
