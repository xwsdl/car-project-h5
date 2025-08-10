<template>
  <div class="chat-container">
    <ChatHeader @close-chat="closeChat" />

    <ChatMessages
      :messages="messages"
      :showWelcome="showWelcome"
      :cars="cars"
      @scrollToBottom="scrollToBottom"
      @resendMessage="handleResendMessage"
    />

    <ChatInput v-model="newMessage" @send="sendMessage" />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import ChatHeader from './components/ChatHeader.vue'
  import ChatMessages from './components/ChatMessages.vue'
  import ChatInput from './components/ChatInput.vue'
  import {
    createConversation,
    fetchConversationDetail,
    readConversation,
    sendConversation,
    closeConversation
  } from '@/api'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useWebSocketStore } from '@/stores/websocket'
  import { formatTime } from '@/utils/index.js'
  import { showConfirmDialog } from 'vant'
  const wsStore = useWebSocketStore()
  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  // 聊天数据
  const showWelcome = ref(false)
  const newMessage = ref('')
  const messages = ref([])
  const cars = ref([
    { emoji: '🚙', name: t('customerService.suvSeries') },
    { emoji: '🏎️', name: t('customerService.sportsCarSeries') },
    { emoji: '🚘', name: t('customerService.luxurySedan') },
    { emoji: '🚖', name: t('customerService.businessMPV') },
    { emoji: '🚔', name: t('customerService.newEnergyCar') },
    { emoji: '🚍', name: t('customerService.familyCar') }
  ])

  const getSenderValue = senderId => {
    return senderId == authStore.user.id ? 'self' : 'received'
  }

  // 获取聊天记录
  const getConversationHistory = async (isConcat = false) => {
    const params = {
      conversationId: route.query.conversationId,
      page: 1,
      size: 20
    }
    const data = await fetchConversationDetail(params)
    if (!isConcat) {
      messages.value = data.map(item => {
        return {
          ...item,
          sender: getSenderValue(item.senderId), //self:自己;received:回应发送者
          status: 'success' // 历史消息默认为成功状态
        }
      })
    }
  }

  // 标记信息为已读
  const markAsRead = async () => {
    const params = {
      conversationId: route.query.conversationId
    }
    const data = await readConversation(params)
  }

  // 发送消息
  const sendMessageHttp = async value => {
    const params = {
      conversationId: route.query.conversationId, //会话id
      receiverId: route.query.receiverId, //接收者id
      content: value, //内容
      messageType: 0 //消息类型：0-文本消息 1-图片消息
    }

    await sendConversation(params)
  }

  const isFirstConversation = ref(false)
  const conversationInfo = ref(null)
  const currentConversationId = ref(route.query.conversationId || '')
  // 判断是首次对话还是继续对话
  if (route.query.carId && route.query.conversationId) {
    isFirstConversation.value = false
    getConversationHistory()
    markAsRead()
  } else {
    isFirstConversation.value = true
  }

  // 发送消息
  const sendMessage = async value => {
    if (!value.trim()) return

    // 生成唯一的消息ID用于状态追踪
    const messageId = `temp_${Date.now()}_${Math.random()}`
    const currentTime = formatTime(new Date())

    // 先添加消息到界面，状态为发送中
    const newMsg = {
      id: messageId,
      content: value,
      sender: 'self',
      sendTime: currentTime,
      status: 'sending' // 发送状态：sending, success, failed
    }
    messages.value.push(newMsg)

    newMessage.value = ''
    scrollToBottom()

    try {
      // 第一次对话
      if (isFirstConversation.value && !conversationInfo.value) {
        // 创建对话
        conversationInfo.value = await createConversation({
          carId: +route.query.carId,
          initialMessage: value
        })

        currentConversationId.value = conversationInfo.value.id

        // 创建对话成功，更新消息状态为成功
        updateMessageStatus(messageId, 'success')
      } else if (isFirstConversation.value && conversationInfo.value) {
        const { id: conversationId, customerServiceId } = conversationInfo.value
        const message = {
          conversationId: conversationId, //会话id
          receiverId: customerServiceId, //接收者id
          content: value, //内容
          messageType: 0 //消息类型：0-文本消息 1-图片消息
        }
        // 1.如果分配到了客服
        if (customerServiceId) {
          const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: message })
          if (!success) {
            updateMessageStatus(messageId, 'failed')
          }
        } else {
          // 2.没有分配客服
          sendMessageHttp(message)
          updateMessageStatus(messageId, 'success')
        }

        // WebSocket 发送成功状态会在收到服务器响应时更新
      } else if (!isFirstConversation.value && !route.query.receiverId) {
        // 不是第一次对话，且没有分配客服的情况
        const message = {
          conversationId: route.query.conversationId, //会话id
          receiverId: route.query.receiverId, //接收者id
          content: value, //内容
          messageType: 0 //消息类型：0-文本消息 1-图片消息
        }
        sendMessageHttp(message)
        updateMessageStatus(messageId, 'success')
      } else {
        const message = {
          conversationId: route.query.conversationId,
          receiverId: route.query.receiverId,
          content: value,
          messageType: 0
        }

        const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: message })
        if (!success) {
          updateMessageStatus(messageId, 'failed')
        }
        // WebSocket 发送成功状态会在收到服务器响应时更新
      }
    } catch (error) {
      updateMessageStatus(messageId, 'failed')
    }
  }

  // 更新消息发送状态
  const updateMessageStatus = (messageId, status) => {
    const messageIndex = messages.value.findIndex(msg => msg.id === messageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex].status = status
    }
  }

  // 根据内容查找并更新消息状态（用于WebSocket响应）
  const updateMessageStatusByContent = (content, status) => {
    // 从后往前查找最近的发送中状态的消息
    for (let i = messages.value.length - 1; i >= 0; i--) {
      const msg = messages.value[i]
      if (msg.sender === 'self' && msg.content === content && msg.status === 'sending') {
        messages.value[i].status = status
        break
      }
    }
  }

  // 处理重发消息
  const handleResendMessage = message => {
    // 更新消息状态为发送中
    updateMessageStatus(message.id, 'sending')

    // 重新发送消息
    try {
      if (isFirstConversation.value && conversationInfo.value) {
        const messageData = {
          conversationId: conversationInfo.value.conversationId,
          receiverId: conversationInfo.value.customerServiceId,
          content: message.content,
          messageType: 0
        }

        const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: messageData })
        if (!success) {
          updateMessageStatus(message.id, 'failed')
        }
      } else if (!isFirstConversation.value) {
        const messageData = {
          conversationId: route.query.conversationId,
          receiverId: route.query.receiverId,
          content: message.content,
          messageType: 0
        }

        const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: messageData })
        if (!success) {
          updateMessageStatus(message.id, 'failed')
        }
      }
    } catch (error) {
      updateMessageStatus(message.id, 'failed')
    }
  }

  // 滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      const container = document.querySelector('.chat-messages')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }

  // 关闭会话提醒
  const closeChat = () => {
    const beforeClose = action =>
      new Promise(async resolve => {
        if (action === 'confirm') {
          await closeConversation({
            conversationId: currentConversationId.value
          })
        }
        resolve(true)
        if (action === 'confirm') {
          router.back()
        }
      })

    showConfirmDialog({
      title: '提示',
      message: '是否关闭会话？',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonColor: '#007aff',
      beforeClose
    })
  }

  onMounted(() => {
    scrollToBottom()

    // 订阅websocket响应回来的消息
    const unsubscribe = wsStore.onMessage(message => {
      // 处理不同类型的消息
      if (message.type === 'SEND_MESSAGE') {
        // 如果收到的是SEND_MESSAGE类型，说明是发送消息的确认响应
        if (message.data && message.data.content) {
          // 根据内容匹配并更新消息状态为成功
          updateMessageStatusByContent(message.data.content, 'success')
        }
      } else if (message.type === 'SEND_MESSAGE_RECEIVED') {
        const newMsg = {
          ...message.data,
          sender: 'received',
          status: 'success' // 发送状态：sending, success, failed
        }
        // 收到新的聊天消息
        messages.value.push(newMsg)
        scrollToBottom()
      } else if (message.type === 'SYSTEM_NOTIFICATION') {
        // 系统通知消息
      } else if (message.content) {
        // 兼容处理：如果有content字段，当作接收消息处理
        messages.value.push({
          id: message.id || `received_${Date.now()}`,
          content: message.content,
          sender: 'received',
          sendTime: message.sendTime || new Date(),
          status: 'success'
        })
        scrollToBottom()
      }
    })

    // 组件卸载时取消订阅
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })
  })
</script>

<style scoped>
  .chat-container {
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  .dialog-content {
    padding: 20px;
    text-align: center;
  }

  .dialog-content p {
    margin-bottom: 20px;
    font-size: 16px;
    color: var(--dark-text);
  }

  .contact-options {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
  }
</style>
