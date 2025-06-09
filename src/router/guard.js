// src/router/guard.js
import router from './index'
import { useAuthStore } from '@/stores/auth'

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  document.title = to.meta.title || '汽车云平台'

  // 检查路由是否需要登录
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      // 用户已登录，允许访问
      next()
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
  // 可以在这里添加页面访问统计
  console.log(`访问了页面: ${to.name}`)
})

// 导出路由守卫安装函数
export const installRouterGuard = (app) => {
  app.use(router)
}
