
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
    this.heartbeatInterval = options.heartbeatInterval || 5000 // 心跳包发送间隔（默认30秒）
    this.heartbeatTimer = null // 心跳定时器
    this.reconnectDelay = options.reconnectDelay || 3000 // 重连间隔（默认3秒）
    this.autoReconnect = options.autoReconnect !== false // 是否自动重连（默认true）
    this._reconnectCount = 3 // 重连次数计数
    this._manualClose = false // 是否为手动关闭标记
    this.maxReconnectCount = options.maxReconnectCount || 5 // 最大重连次数
  }

  /**
   * 建立WebSocket连接
   * 自动处理心跳和重连
   */
  connect() {
    this._manualClose = false // 标记为非手动关闭
    this.ws = new window.WebSocket(this.url)
    // 连接成功
    this.ws.onopen = (e) => {
      this._emit('open', e)
      this._reconnectCount = 0 // 重连计数清零
      this.startHeartbeat() // 启动心跳
      console.log('连接成功', e)
    }
    // 收到消息
    this.ws.onmessage = (event) => {
      this._emit('message', event.data)
    }
    // 连接关闭
    this.ws.onclose = (e) => {
      console.log('连接关闭', e)
      this._emit('close', e)
      this.stopHeartbeat() // 停止心跳
      // 非手动关闭且允许自动重连时，尝试重连

      if (this.autoReconnect && !this._manualClose) this.reconnect()
    }
    // 连接出错
    this.ws.onerror = (err) => {
      this._emit('error', err)
      this.close() // 出错时主动关闭连接
    }
  }

  /**
   * 发送消息
   * @param {string|object} data - 发送的数据
   */
  send(data) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(data)
    }
  }

  /**
   * 启动心跳包定时器，定时发送ping包
   */
  startHeartbeat() {
    this.stopHeartbeat() // 先清理旧定时器
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
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
    if (this._reconnectCount >= this.maxReconnectCount) {
      console.warn('已达到最大重连次数，停止重连')
      return
    }
    this._reconnectCount++
    setTimeout(() => {
      this.connect()
    }, this.reconnectDelay * Math.min(this._reconnectCount, 10))
  }

  /**
   * 主动关闭WebSocket连接，并停止心跳和重连
   */
  close() {
    this._manualClose = true // 标记为手动关闭
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.stopHeartbeat()
  }

  /**
   * 注册事件监听器
   * @param {string} event - 事件名（open/message/close/error）
   * @param {function} callback - 回调函数
   */
  on(event, callback) {
    this.listeners.push({ event, callback })
  }

  /**
   * 内部事件分发
   * @param {string} event - 事件名
   * @param  {...any} args - 事件参数
   */
  _emit(event, ...args) {
    this.listeners.forEach(l => {
      if (l.event === event) l.callback(...args)
    })
  }
}
