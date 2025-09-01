/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-08-07 23:49:04
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
  // 用户权限列表 - 写死权限节点用于测试
  const permissions = ref([
    'role_management',
    'user_management',
    'basic_access',
    'customer_service',
    'order_management',
    'system_config'
  ])

  // 检查是否登录
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 检查是否有指定权限
  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 检查是否有任意一个权限
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.value.includes(permission))
  }

  // 检查是否有所有权限
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.value.includes(permission))
  }

  // 登录方法
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    // 注意：这里暂时不更新权限，因为权限是写死的
    // 持久化存储用户信息和令牌
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // 登出方法
  const logout = () => {
    user.value = null
    token.value = null
    permissions.value = []
    // 清除本地存储
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_permissions')
  }

  // 更新用户信息
  const updateUser = (userData) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // 更新权限信息
  const updatePermissions = (userPermissions) => {
    // 注意：权限暂时是写死的，不更新
    console.log('权限更新被忽略，当前权限是写死的:', userPermissions)
    // permissions.value = userPermissions
    // localStorage.setItem('auth_permissions', JSON.stringify(userPermissions))
  }

  // 清除用户信息（保持令牌）
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    token,
    permissions,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    updateUser,
    updatePermissions,
    clearUser,
  }
})
