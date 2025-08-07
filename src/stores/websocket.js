// src/stores/websocket.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import WebSocketService from '@/utils/websocket'

export const useWebSocketStore = defineStore('webSocket', () => {
  // WebSocket 实例
  const wsInstance = ref(null)
  // 连接状态
  const isConnected = ref(false)
  // 最新消息
  const lastMessage = ref(null)
  // 连接错误信息
  const connectionError = ref(null)
  // 重连次数
  const reconnectCount = ref(0)
  // 最大重连次数
  const maxReconnectCount = ref(5)

  // 初始化 WebSocket
  function initWebSocket(url) {
    // 如果已有连接，先关闭
    if (wsInstance.value) {
      wsInstance.value.close()
    }

    // 重置状态
    isConnected.value = false
    connectionError.value = null
    reconnectCount.value = 0

    // 创建新的 WebSocket 实例
    wsInstance.value = new WebSocketService(url, {
      maxReconnectCount: maxReconnectCount.value,
      heartbeatInterval: 30000, // 30秒心跳
      reconnectDelay: 3000 // 3秒重连间隔
    })

    // 绑定事件监听器
    wsInstance.value.on('open', () => {
      console.log('WebSocket 连接成功---store')
      isConnected.value = true
      connectionError.value = null
      reconnectCount.value = 0
    })

    wsInstance.value.on('close', (event) => {
      console.log('WebSocket 连接关闭---store', event)
      isConnected.value = false

      // 如果是服务器错误（code: 1011），记录错误信息
      if (event.code === 1011) {
        connectionError.value = '服务器内部错误，请检查登录状态或联系客服'
      }
    })

    wsInstance.value.on('message', (msg) => {
      lastMessage.value = msg
      console.log('收到 WebSocket 消息:', msg)
      // 可在此分发消息到其他组件
    })

    wsInstance.value.on('error', (error) => {
      console.error('WebSocket 连接错误---store', error)
      isConnected.value = false
      connectionError.value = '连接错误，请检查网络状态'
    })

    wsInstance.value.on('maxReconnectReached', () => {
      console.warn('WebSocket 达到最大重连次数---store')
      connectionError.value = '连接失败，已达到最大重连次数，请刷新页面重试'
    })

    // 开始连接
    wsInstance.value.connect()
  }

  // 发送消息
  function sendMessage(data) {
    if (wsInstance.value && wsInstance.value.isConnected()) {
      wsInstance.value.send(data)
      return true
    } else {
      console.warn('WebSocket 未连接，无法发送消息')
      return false
    }
  }

  // 关闭连接
  function closeWebSocket() {
    if (wsInstance.value) {
      wsInstance.value.close()
      wsInstance.value = null
      isConnected.value = false
      connectionError.value = null
      reconnectCount.value = 0
    }
  }

  // 重新连接
  function reconnect() {
    if (wsInstance.value) {
      wsInstance.value.close()
    }
    // 重新初始化连接
    if (wsInstance.value && wsInstance.value.url) {
      initWebSocket(wsInstance.value.url)
    }
  }

  // 获取连接状态文本
  function getConnectionStatus() {
    if (isConnected.value) {
      return '已连接'
    } else if (connectionError.value) {
      return '连接失败'
    } else {
      return '未连接'
    }
  }

  return {
    wsInstance,
    isConnected,
    lastMessage,
    connectionError,
    reconnectCount,
    maxReconnectCount,
    initWebSocket,
    sendMessage,
    closeWebSocket,
    reconnect,
    getConnectionStatus
  }
})