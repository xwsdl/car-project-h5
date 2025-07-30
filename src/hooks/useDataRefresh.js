import { onMounted, onUnmounted } from 'vue'
import eventBus, { EVENT_TYPES } from '@/utils/eventBus.js'

/**
 * 数据刷新组合式函数
 * @param {Function} refreshFunction 刷新数据的函数
 * @param {Object} options 配置选项
 * @returns {Object} 返回刷新相关的状态和方法
 */
export function useDataRefresh(refreshFunction, options = {}) {
  const {
    autoRefresh = true, // 是否自动刷新
    refreshOnLanguageChange = true, // 语言切换时是否刷新
    refreshOnMount = true, // 组件挂载时是否刷新
    debounceTime = 300 // 防抖时间
  } = options

  let refreshTimeout = null
  let isRefreshing = false

  // 防抖刷新函数
  const debouncedRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
    }
    refreshTimeout = setTimeout(() => {
      if (typeof refreshFunction === 'function' && !isRefreshing) {
        isRefreshing = true
        refreshFunction()
          .finally(() => {
            isRefreshing = false
          })
      }
    }, debounceTime)
  }

  // 立即刷新函数
  const refresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
    }
    if (typeof refreshFunction === 'function' && !isRefreshing) {
      isRefreshing = true
      return refreshFunction()
        .finally(() => {
          isRefreshing = false
        })
    }
    return Promise.resolve()
  }

  // 语言切换事件处理
  const handleLanguageChange = (data) => {
    if (refreshOnLanguageChange) {
      console.log('语言切换，重新获取数据:', data)
      debouncedRefresh()
    }
  }

  // 数据刷新事件处理
  const handleDataRefresh = (data) => {
    if (autoRefresh) {
      console.log('收到数据刷新事件:', data)
      debouncedRefresh()
    }
  }

  // 组件挂载时设置事件监听
  onMounted(() => {
    if (refreshOnLanguageChange) {
      eventBus.on(EVENT_TYPES.LANGUAGE_CHANGED, handleLanguageChange)
    }

    if (autoRefresh) {
      eventBus.on(EVENT_TYPES.DATA_REFRESH_NEEDED, handleDataRefresh)
    }

    // 组件挂载时刷新数据
    if (refreshOnMount) {
      debouncedRefresh()
    }
  })

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
    }

    if (refreshOnLanguageChange) {
      eventBus.off(EVENT_TYPES.LANGUAGE_CHANGED, handleLanguageChange)
    }

    if (autoRefresh) {
      eventBus.off(EVENT_TYPES.DATA_REFRESH_NEEDED, handleDataRefresh)
    }
  })

  return {
    refresh,
    debouncedRefresh,
    isRefreshing: () => isRefreshing
  }
}
