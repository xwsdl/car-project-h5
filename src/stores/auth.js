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

  // 从本地存储恢复用户菜单
  const getUserMenusFromStorage = () => {
    try {
      const menusData = localStorage.getItem('auth_menus')
      return menusData ? JSON.parse(menusData) : []
    } catch (error) {
      console.error('解析用户菜单失败:', error)
      return []
    }
  }

  // 从本地存储恢复用户权限
  const getUserPermissionsFromStorage = () => {
    try {
      const permissionsData = localStorage.getItem('auth_permissions')
      return permissionsData ? JSON.parse(permissionsData) : []
    } catch (error) {
      console.error('解析用户权限失败:', error)
      return []
    }
  }

  // 用户信息
  const user = ref(getUserFromStorage())
  // 访问令牌
  const token = ref(localStorage.getItem('auth_token') || null)
  // 用户菜单列表
  const menus = ref(getUserMenusFromStorage())
  // 用户权限列表
  const permissions = ref(getUserPermissionsFromStorage())

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
  const login = (userData, authToken, userMenus = [], userPermissions = []) => {
    user.value = userData
    token.value = authToken
    menus.value = userMenus
    permissions.value = userPermissions || []
    // 持久化存储用户信息、令牌、菜单和权限
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_menus', JSON.stringify(userMenus))
    localStorage.setItem('auth_permissions', JSON.stringify(permissions.value))
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
    permissions.value = userPermissions || []
    localStorage.setItem('auth_permissions', JSON.stringify(permissions.value))
  }

  // 更新用户菜单
  const updateUserMenus = (userMenus) => {
    menus.value = userMenus || []
    localStorage.setItem('auth_menus', JSON.stringify(userMenus))
  }

  // 清除用户信息（保持令牌）
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    token,
    menus,
    permissions,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    updateUser,
    updatePermissions,
    updateUserMenus,
    clearUser,
  }
})
