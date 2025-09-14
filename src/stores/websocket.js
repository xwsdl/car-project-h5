// src/stores/websocket.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import WebSocketService from '@/utils/websocket'
import eventBus from '@/utils/eventBus'

export const useWebSocketStore = defineStore('webSocket', () => {
  // WebSocket 实例
  const wsInstance = ref(null)
  // 连接状态
  const isConnected = ref(false)
  // 最新消息
  const lastMessage = ref(null)
  // 消息历史记录
  const messageHistory = ref([])
  // 连接错误信息
  const connectionError = ref(null)
  // 重连次数
  const reconnectCount = ref(0)
  // 最大重连次数
  const maxReconnectCount = ref(5)
  // 消息回调列表
  const messageCallbacks = ref([])

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

      // 触发全局事件
      eventBus.emit('websocket_connected', { url })
    })

    wsInstance.value.on('close', (event) => {
      console.log('WebSocket 连接关闭---store', event)
      isConnected.value = false

      // 如果是服务器错误（code: 1011），记录错误信息
      if (event.code === 1011) {
        connectionError.value = '服务器内部错误，请检查登录状态或联系客服'
      }

      // 触发全局事件
      eventBus.emit('websocket_disconnected', { event })
    })

    wsInstance.value.on('message', (msg) => {
      // 进一步规范化消息格式
      const normalizedMessage = {
        ...msg, // 保留原始消息的其他字段
        type: msg.type || 'UNKNOWN',
        data: msg.data || null
      }

      lastMessage.value = normalizedMessage
      messageHistory.value.push(normalizedMessage)

      console.log('收到 WebSocket 消息:', normalizedMessage)

      // 执行所有注册的消息回调
      messageCallbacks.value.forEach(callback => {
        try {
          callback(normalizedMessage)
        } catch (error) {
          console.error('WebSocket 消息回调执行错误:', error)
        }
      })

      // 通过全局事件总线分发消息
      eventBus.emit('websocket_message', normalizedMessage)
    })

    wsInstance.value.on('error', (error) => {
      console.error('WebSocket 连接错误---store', error)
      isConnected.value = false
      connectionError.value = '连接错误，请检查网络状态'

      // 触发全局事件
      eventBus.emit('websocket_error', { error })
    })

    wsInstance.value.on('maxReconnectReached', () => {
      console.warn('WebSocket 达到最大重连次数---store')
      connectionError.value = '连接失败，已达到最大重连次数，请刷新页面重试'

      // 触发全局事件
      eventBus.emit('websocket_max_reconnect_reached')
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

  // 订阅消息（推荐方式）
  function onMessage(callback) {
    if (typeof callback === 'function') {
      messageCallbacks.value.push(callback)

      // 返回取消订阅的函数
      return () => {
        const index = messageCallbacks.value.indexOf(callback)
        if (index > -1) {
          messageCallbacks.value.splice(index, 1)
        }
      }
    }
  }

  // 取消消息订阅
  function offMessage(callback) {
    if (callback) {
      const index = messageCallbacks.value.indexOf(callback)
      if (index > -1) {
        messageCallbacks.value.splice(index, 1)
      }
    } else {
      // 清空所有回调
      messageCallbacks.value = []
    }
  }

  // 获取指定类型的消息
  function getMessagesByType(messageType) {
    return messageHistory.value.filter(msg => msg.type === messageType)
  }

  // 清空消息历史
  function clearMessageHistory() {
    messageHistory.value = []
  }

  // 关闭连接
  function closeWebSocket() {
    if (wsInstance.value) {
      wsInstance.value.close()
      wsInstance.value = null
      isConnected.value = false
      connectionError.value = null
      reconnectCount.value = 0
      messageCallbacks.value = []
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
    messageHistory,
    connectionError,
    reconnectCount,
    maxReconnectCount,
    initWebSocket,
    sendMessage,
    onMessage,
    offMessage,
    getMessagesByType,
    clearMessageHistory,
    closeWebSocket,
    reconnect,
    getConnectionStatus
  }
})