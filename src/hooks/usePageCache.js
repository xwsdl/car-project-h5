import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import { savePageState, restorePageState, clearPageCache } from '@/utils/cache.js'

/**
 * 页面缓存管理组合式函数
 * @param {string} pageName 页面名称
 * @param {object} initialState 初始状态
 * @param {object} options 配置选项
 * @returns {object} 缓存管理对象
 */
export function usePageCache(pageName, initialState = {}, options = {}) {
  const {
    maxAge = 30 * 60 * 1000, // 默认30分钟缓存
    autoRestore = true, // 自动恢复状态
    autoSave = true, // 自动保存状态
    clearOnUnmount = false // 组件卸载时是否清除缓存
  } = options

  // 页面状态
  const pageState = ref({ ...initialState })

  // 是否已从缓存恢复
  const isRestored = ref(false)

  /**
   * 保存状态到缓存
   * @param {object} state 要保存的状态
   */
  const saveState = (state = null) => {
    const stateToSave = state || pageState.value
    savePageState(pageName, stateToSave)
  }

  /**
   * 从缓存恢复状态
   * @returns {object|null} 恢复的状态
   */
  const restoreState = () => {
    const cachedState = restorePageState(pageName, maxAge)
    if (cachedState) {
      pageState.value = { ...pageState.value, ...cachedState }
      isRestored.value = true
      return cachedState
    }
    return null
  }

  /**
   * 清除页面缓存
   */
  const clearCache = () => {
    clearPageCache(pageName)
    isRestored.value = false
  }

  /**
   * 更新状态并保存到缓存
   * @param {object} newState 新状态
   */
  const updateState = (newState) => {
    pageState.value = { ...pageState.value, ...newState }
    if (autoSave) {
      saveState()
    }
  }

  // 组件挂载时恢复状态
  onMounted(() => {
    if (autoRestore) {
      restoreState()
    }
  })

  // 组件激活时恢复状态（keep-alive）
  onActivated(() => {
    if (autoRestore && !isRestored.value) {
      restoreState()
    }
  })

  // 组件失活时保存状态（keep-alive）
  onDeactivated(() => {
    if (autoSave) {
      saveState()
    }
  })

  // 组件卸载时清除缓存（可选）
  if (clearOnUnmount) {
    onUnmounted(() => {
      clearCache()
    })
  }

  return {
    pageState,
    isRestored,
    saveState,
    restoreState,
    clearCache,
    updateState
  }
}
