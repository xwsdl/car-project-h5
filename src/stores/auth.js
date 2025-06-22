/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-22 13:19:09
 * @FilePath: \car-project-h5\src\stores\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 用户信息
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 用户信息
  const user = ref(null)
  // 访问令牌
  const token = ref(localStorage.getItem('auth_token') || null)

  // 检查是否登录
  const isAuthenticated = computed(() => !!token.value)

  // 登录方法
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  // 登出方法
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
})
