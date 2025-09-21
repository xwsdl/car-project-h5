import { useAuthStore } from '@/stores/auth'

// 权限指令
const permissionDirective = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const value = binding.value
    
    // 根据不同类型的权限进行检查
    if (typeof value === 'string') {
      // 单个权限检查
      if (!authStore.hasPermission(value)) {
        hideElement(el)
      }
    } else if (Array.isArray(value)) {
      // 权限数组检查（默认任意一个满足即可）
      if (!authStore.hasAnyPermission(value)) {
        hideElement(el)
      }
    } else if (typeof value === 'object' && value !== null) {
      // 对象形式，支持配置
      const { permissions, requireAll = false } = value
      if (Array.isArray(permissions)) {
        if (requireAll) {
          // 需要所有权限都满足
          if (!authStore.hasAllPermissions(permissions)) {
            hideElement(el)
          }
        } else {
          // 任意一个权限满足即可
          if (!authStore.hasAnyPermission(permissions)) {
            hideElement(el)
          }
        }
      } else if (typeof permissions === 'string') {
        // 对象中传入单个权限字符串
        if (!authStore.hasPermission(permissions)) {
          hideElement(el)
        }
      }
    }
  },
  updated(el, binding) {
    // 更新时重新检查权限
    permissionDirective.mounted(el, binding)
  }
}

// 隐藏元素的方法
function hideElement(el) {
  el.style.display = 'none'
  // 或者完全移除元素
  // el.parentNode?.removeChild(el)
}

export default permissionDirective