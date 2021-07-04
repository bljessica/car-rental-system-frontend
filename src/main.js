import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import naive from 'naive-ui'
import router from '/@/router/index.js'
import api from '/@/api/api.js'
import store from '/@/store/index.js'

const app = createApp(App)
app.config.globalProperties.$api = api
app.config.globalProperties.user = store.user

app.use(router).use(naive).mount('#app')

export default app
