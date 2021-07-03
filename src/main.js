import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import naive from 'naive-ui'
import router from '/@/router/index.js'
import api from '/@/api/api.js'

const app = createApp(App)
app.config.globalProperties.$api = api

app.use(router).use(naive).mount('#app')
