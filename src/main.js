// 重置样式
import '@/assets/scss/reset.scss'

import 'vant/lib/index.css'

import { installRouterGuard } from '@/router/guard'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n' // 修正为正确的 locales 目录

const app = createApp(App)
// 安装路由和守卫
installRouterGuard(app)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')

console.log(import.meta.env)
