/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-12 13:56:55
 * @FilePath: \car-project-h5\src\stores\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 用户信息
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 从本地存储恢复用户信息
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('auth_user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }

  // 用户信息
  const user = ref(getUserFromStorage())
  // 访问令牌
  const token = ref(localStorage.getItem('auth_token') || null)

  // 检查是否登录
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 登录方法
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    // 持久化存储用户信息和令牌
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // 登出方法
  const logout = () => {
    user.value = null
    token.value = null
    // 清除本地存储
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // 更新用户信息
  const updateUser = (userData) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // 清除用户信息（保持令牌）
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    clearUser,
  }
})
