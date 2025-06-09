/**
 * 滚动到底部监听指令
 * 使用方式: v-scroll-to-bottom="options"
 *
 * @param {Object} options - 配置对象
 * @param {Function} options.callback - 到达底部时触发的回调函数
 * @param {number} options.threshold - 距离底部的阈值(px)
 * @param {boolean} options.immediate - 是否立即检查
 * @param {boolean} options.once - 是否只触发一次
 */
export const scrollToBottomDirective = {
  mounted(el, binding) {
    // 解析配置参数
    const { callback, threshold = 50, immediate = true, once = false } = binding.value || {}

    // 验证回调函数
    if (typeof callback !== 'function') {
      console.warn('v-scroll-to-bottom requires a callback function')
      return
    }

    // 保存配置到元素上
    el._scrollConfig = {
      callback,
      threshold,
      immediate,
      once,
      triggered: false,
    }

    // 滚动处理函数
    const handleScroll = () => {
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight
      const clientHeight = el.clientHeight

      // 计算距离底部的距离
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight)

      // 检查是否到达底部
      if (distanceToBottom <= threshold) {
        // 如果设置了只触发一次且已触发过，则跳过
        if (once && el._scrollConfig.triggered) return

        // 执行回调
        callback({
          element: el,
          scrollTop,
          scrollHeight,
          clientHeight,
          distanceToBottom,
        })

        // 标记已触发
        el._scrollConfig.triggered = true
      }
    }

    // 保存处理函数以便卸载时使用
    el._scrollHandler = handleScroll

    // 添加滚动监听
    el.addEventListener('scroll', handleScroll)

    // 初始检查
    if (immediate) {
      setTimeout(() => {
        // 检查初始状态
        handleScroll()

        // 如果初始就在底部，立即触发
        const scrollTop = el.scrollTop
        const scrollHeight = el.scrollHeight
        const clientHeight = el.clientHeight
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight)

        if (distanceToBottom <= threshold) {
          callback({
            element: el,
            scrollTop,
            scrollHeight,
            clientHeight,
            distanceToBottom,
          })
          el._scrollConfig.triggered = true
        }
      }, 100)
    }
  },

  updated(el, binding) {
    // 当绑定的值发生变化时更新配置
    if (binding.value && typeof binding.value === 'object') {
      Object.assign(el._scrollConfig, binding.value)
    }
  },

  beforeUnmount(el) {
    // 清理事件监听
    if (el._scrollHandler) {
      el.removeEventListener('scroll', el._scrollHandler)
      delete el._scrollHandler
      delete el._scrollConfig
    }
  },
}

// 默认导出指令
export default scrollToBottomDirective
