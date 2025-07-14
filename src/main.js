/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-11 23:53:30
 * @FilePath: \car-project-h5\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 重置样式
import '@/assets/scss/reset.scss'
// 解决函数式调用toast样式问题（Vant 自动导入插件的局限性， 自动导入插件无法感知你在 JS 里用到了 Toast）
import 'vant/es/toast/style';
import 'vant/es/image-preview/style'; // 手动导入showImagePreview方法用到的样式
import 'vant/lib/index.css'
import { installRouterGuard } from '@/router/guard'
import VueClipboard from 'vue3-clipboard'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import i18n from '@/i18n' // 修正为正确的 locales 目录
import { Lazyload } from 'vant';
const app = createApp(App)
// 安装路由和守卫
installRouterGuard(app)
app.use(i18n)
app.use(createPinia())
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true
})

app.use(Lazyload);

app.mount('#app')

console.log(import.meta.env)
