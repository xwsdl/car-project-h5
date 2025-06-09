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
