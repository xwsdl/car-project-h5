// utils/websocket.js
// 聊天 WebSocket 封装类，适合 H5 项目（如 Vue/React/原生 JS 均可用）

class ChatWebSocket {
  constructor(url, options = {}) {
    this.url = url
    this.ws = null
    this.heartbeatInterval = options.heartbeatInterval || 30000 // 心跳间隔
    this.heartbeatTimer = null
    this.reconnectDelay = options.reconnectDelay || 3000 // 重连间隔
    this.onMessage = options.onMessage || function () {}
    this.onOpen = options.onOpen || function () {}
    this.onClose = options.onClose || function () {}
    this.onError = options.onError || function () {}
    this.autoReconnect = options.autoReconnect !== false
    this._reconnectCount = 0
  }

  connect(token) {
    if (this.ws) this.close()
    let wsUrl = this.url
    if (token) {
      wsUrl += (wsUrl.indexOf('?') === -1 ? '?' : '&') + 'token=' + encodeURIComponent(token)
    }
    this.ws = new window.WebSocket(wsUrl)

    this.ws.onopen = (e) => {
      this._reconnectCount = 0
      this.startHeartbeat()
      this.onOpen(e)
    }

    this.ws.onmessage = (event) => {
      // 可扩展自定义协议
      let data = {}
      try {
        data = JSON.parse(event.data)
      } catch (e) {
        data = { type: 'text', message: event.data }
      }
      this.onMessage(data)
    }

    this.ws.onclose = (e) => {
      this.stopHeartbeat()
      this.onClose(e)
      if (this.autoReconnect) this.reconnect(token)
    }

    this.ws.onerror = (err) => {
      this.onError(err)
      this.close()
    }
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== 1) {
      throw new Error('WebSocket not connected.')
    }
    const msg = typeof data === 'string' ? data : JSON.stringify(data)
    this.ws.send(msg)
  }

  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, this.heartbeatInterval)
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  reconnect(token) {
    this._reconnectCount++
    setTimeout(
      () => {
        this.connect(token)
      },
      this.reconnectDelay * Math.min(this._reconnectCount, 10),
    )
  }

  close() {
    this.autoReconnect = false
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.stopHeartbeat()
  }
}

export default ChatWebSocket
