import { createRouter, createWebHashHistory } from 'vue-router'

import LoginOrRegister from '/@/containers/loginOrRegister/index.vue'

const routes = [
  {
    path: '/loginOrRegister',
    component: LoginOrRegister
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
