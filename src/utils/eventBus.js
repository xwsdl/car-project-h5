/**
 * 全局事件总线
 * 用于组件间通信和全局事件管理
 */

class EventBus {
  constructor() {
    this.events = {}
  }

  /**
   * 监听事件
   * @param {string} event 事件名称
   * @param {function} callback 回调函数
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  /**
   * 移除事件监听
   * @param {string} event 事件名称
   * @param {function} callback 回调函数
   */
  off(event, callback) {
    if (!this.events[event]) return
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    } else {
      delete this.events[event]
    }
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {*} data 事件数据
   */
  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`事件 ${event} 回调执行失败:`, error)
      }
    })
  }

  /**
   * 清除所有事件
   */
  clear() {
    this.events = {}
  }
}

// 创建全局事件总线实例
const eventBus = new EventBus()

// 预定义的事件类型
export const EVENT_TYPES = {
  LANGUAGE_CHANGED: 'language_changed',
  DATA_REFRESH_NEEDED: 'data_refresh_needed',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  CACHE_CLEARED: 'cache_cleared'
}

export default eventBus
