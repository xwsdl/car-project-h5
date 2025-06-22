/**
 * 页面缓存管理工具
 */

// 缓存键名前缀
const CACHE_PREFIX = 'page_cache_'

/**
 * 保存页面状态到本地存储
 * @param {string} pageName 页面名称
 * @param {object} state 要保存的状态
 */
export function savePageState(pageName, state) {
  try {
    const key = CACHE_PREFIX + pageName
    const data = {
      timestamp: Date.now(),
      state: state
    }
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('保存页面状态失败:', error)
  }
}

/**
 * 从本地存储恢复页面状态
 * @param {string} pageName 页面名称
 * @param {number} maxAge 最大缓存时间（毫秒），默认30分钟
 * @returns {object|null} 保存的状态或null
 */
export function restorePageState(pageName, maxAge = 30 * 60 * 1000) {
  try {
    const key = CACHE_PREFIX + pageName
    const data = sessionStorage.getItem(key)

    if (!data) return null

    const parsed = JSON.parse(data)
    const now = Date.now()

    // 检查缓存是否过期
    if (now - parsed.timestamp > maxAge) {
      sessionStorage.removeItem(key)
      return null
    }

    return parsed.state
  } catch (error) {
    console.error('恢复页面状态失败:', error)
    return null
  }
}

/**
 * 清除指定页面的缓存
 * @param {string} pageName 页面名称
 */
export function clearPageCache(pageName) {
  try {
    const key = CACHE_PREFIX + pageName
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('清除页面缓存失败:', error)
  }
}

/**
 * 清除所有页面缓存
 */
export function clearAllPageCache() {
  try {
    const keys = Object.keys(sessionStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('清除所有页面缓存失败:', error)
  }
}

/**
 * 获取缓存信息
 * @returns {object} 缓存信息
 */
export function getCacheInfo() {
  try {
    const keys = Object.keys(sessionStorage)
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX))

    return {
      total: cacheKeys.length,
      pages: cacheKeys.map(key => key.replace(CACHE_PREFIX, ''))
    }
  } catch (error) {
    console.error('获取缓存信息失败:', error)
    return { total: 0, pages: [] }
  }
}
