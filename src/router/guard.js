/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-15 11:42:41
 * @FilePath: \car-project-h5\src\router\guard.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/router/guard.js
import router from './index'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/i18n'
import { showToast } from 'vant'

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  document.title = i18n.global.t(to.meta.title) || '汽车云平台'

  // 检查路由是否需要登录
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      // 用户已登录，检查权限
      if (to.meta.permission1) {
        if (authStore.hasPermission(to.meta.permission)) {
          console.log('hasPermission:', authStore.hasPermission(to.meta.permission))
          // 有权限，允许访问
          next()
        } else {
          // 无权限，显示提示并返回
          showToast('无权限访问')
          next(false)
        }
      } else {
        // 不需要特殊权限，允许访问
        next()
      }
    } else {
      // 用户未登录，重定向到登录页
      // 记录目标路径，登录后可以重定向回来
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    // 不需要登录的路由，直接放行
    next()
  }
})

// 全局后置守卫
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = i18n.global.t(to.meta.title)
  }
})

// 导出路由守卫安装函数
export const installRouterGuard = (app) => {
  app.use(router)
}
