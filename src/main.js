import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import naive from 'naive-ui'
import router from '/@/router/index.js'

createApp(App).use(router).use(naive).mount('#app')
