// 重置样式
import '@/assets/scss/reset.scss'
// 解决函数式调用toast样式问题（Vant 自动导入插件的局限性， 自动导入插件无法感知你在 JS 里用到了 Toast）
import 'vant/es/toast/style';
import 'vant/es/image-preview/style'; // 手动导入showImagePreview方法用到的样式
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
