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

  // 初始化 WebSocket
  function initWebSocket(url) {
    if (wsInstance.value) {
      wsInstance.value.close()
    }
    wsInstance.value = new WebSocketService(url)
    wsInstance.value.connect()
    wsInstance.value.on('open', () => {
      console.log('socket连接成功---store')
      isConnected.value = true
    })
    wsInstance.value.on('close', () => {
      isConnected.value = false
    })
    wsInstance.value.on('message', (msg) => {
      lastMessage.value = msg
      // 可在此分发消息
    })
    wsInstance.value.on('error', () => {
      isConnected.value = false
    })
  }

  // 发送消息
  function sendMessage(data) {
    if (wsInstance.value) {
      wsInstance.value.send(data)
    }
  }

  // 关闭连接
  function closeWebSocket() {
    if (wsInstance.value) {
      wsInstance.value.close()
      wsInstance.value = null
      isConnected.value = false
    }
  }

  return {
    wsInstance,
    isConnected,
    lastMessage,
    initWebSocket,
    sendMessage,
    closeWebSocket
  }
})