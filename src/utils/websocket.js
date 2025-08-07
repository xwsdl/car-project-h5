
// src/utils/websocket.js
// WebSocketService：H5项目通用WebSocket封装，支持心跳包与自动重连
export default class WebSocketService {
  /**
   * 构造函数
   * @param {string} url - WebSocket服务端地址
   * @param {object} options - 配置项（心跳间隔、重连间隔等）
   */
  constructor(url, options = {}) {
    this.url = url // 连接地址
    this.ws = null // WebSocket实例
    this.listeners = [] // 事件监听器数组
    // 心跳和重连相关配置
    this.heartbeatInterval = options.heartbeatInterval || 30000 // 心跳包发送间隔（默认30秒）
    this.heartbeatTimer = null // 心跳定时器
    this.reconnectDelay = options.reconnectDelay || 3000 // 重连间隔（默认3秒）
    this.autoReconnect = options.autoReconnect !== false // 是否自动重连（默认true）
    this.maxReconnectCount = options.maxReconnectCount || 5 // 最大重连次数
    this._reconnectCount = 0 // 重连次数计数
    this._manualClose = false // 是否为手动关闭标记
    this._isConnecting = false // 是否正在连接中
  }

  /**
   * 建立WebSocket连接
   * 自动处理心跳和重连
   */
  connect() {
    // 防止重复连接
    if (this._isConnecting || (this.ws && this.ws.readyState === 1)) {
      console.log('WebSocket 已连接或正在连接中，跳过重复连接')
      return
    }

    this._manualClose = false // 标记为非手动关闭
    this._isConnecting = true // 标记正在连接

    try {
      this.ws = new window.WebSocket(this.url)

      // 连接成功
      this.ws.onopen = (e) => {
        this._isConnecting = false
        this._emit('open', e)
        this._reconnectCount = 0 // 重连计数清零
        this.startHeartbeat() // 启动心跳
        console.log('WebSocket 连接成功', e)
      }

      // 收到消息
      this.ws.onmessage = (event) => {
        this._emit('message', event.data)
      }

      // 连接关闭
      this.ws.onclose = (e) => {
        this._isConnecting = false
        console.log('WebSocket 连接关闭', e)
        this._emit('close', e)
        this.stopHeartbeat() // 停止心跳

        // 非手动关闭且允许自动重连时，尝试重连
        if (this.autoReconnect && !this._manualClose) {
          this.reconnect()
        }
      }

      // 连接出错
      this.ws.onerror = (err) => {
        this._isConnecting = false
        console.error('WebSocket 连接错误', err)
        this._emit('error', err)
      }
    } catch (error) {
      this._isConnecting = false
      console.error('WebSocket 连接创建失败', error)
      this._emit('error', error)
    }
  }

  /**
   * 发送消息
   * @param {string|object} data - 发送的数据
   */
  send(data) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data))
    } else {
      console.warn('WebSocket 未连接，无法发送消息')
    }
  }

  /**
   * 启动心跳包定时器，定时发送ping包
   */
  startHeartbeat() {
    this.stopHeartbeat() // 先清理旧定时器
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        console.log('发送心跳包')
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳包定时器
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 自动重连逻辑，重连间隔递增
   */
  reconnect() {
    // 检查是否超过最大重连次数
    if (this._reconnectCount >= this.maxReconnectCount) {
      console.warn(`WebSocket 已达到最大重连次数 ${this.maxReconnectCount}，停止重连`)
      this._emit('maxReconnectReached')
      return
    }

    this._reconnectCount++
    const delay = this.reconnectDelay * Math.min(this._reconnectCount, 10)
    console.log(`WebSocket 第 ${this._reconnectCount} 次重连，延迟 ${delay}ms`)

    setTimeout(() => {
      if (!this._manualClose) {
        this.connect()
      }
    }, delay)
  }

  /**
   * 主动关闭WebSocket连接，并停止心跳和重连
   */
  close() {
    this._manualClose = true // 标记为手动关闭
    this._isConnecting = false

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.stopHeartbeat()
    console.log('WebSocket 手动关闭连接')
  }

  /**
   * 注册事件监听器
   * @param {string} event - 事件名（open/message/close/error/maxReconnectReached）
   * @param {function} callback - 回调函数
   */
  on(event, callback) {
    this.listeners.push({ event, callback })
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名
   * @param {function} callback - 回调函数（可选，不传则移除该事件的所有监听器）
   */
  off(event, callback) {
    if (callback) {
      this.listeners = this.listeners.filter(l => !(l.event === event && l.callback === callback))
    } else {
      this.listeners = this.listeners.filter(l => l.event !== event)
    }
  }

  /**
   * 清空所有监听器
   */
  clearListeners() {
    this.listeners = []
  }

  /**
   * 内部事件分发
   * @param {string} event - 事件名
   * @param  {...any} args - 事件参数
   */
  _emit(event, ...args) {
    this.listeners.forEach(l => {
      if (l.event === event) {
        try {
          l.callback(...args)
        } catch (error) {
          console.error(`WebSocket 事件监听器执行错误: ${event}`, error)
        }
      }
    })
  }

  /**
   * 获取连接状态
   */
  getReadyState() {
    return this.ws ? this.ws.readyState : 3 // 3 = CLOSED
  }

  /**
   * 检查是否已连接
   */
  isConnected() {
    return this.ws && this.ws.readyState === 1
  }
}
