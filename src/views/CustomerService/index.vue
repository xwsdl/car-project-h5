<template>
  <div class="chat-container">
    <ChatHeader @close-chat="closeChat" :receiverId="receiverId" />

    <ChatMessages
      ref="chatMessagesRef"
      :messages="messages"
      :showWelcome="showWelcome"
      :cars="cars"
      @scrollToBottom="scrollToBottom"
      @resendMessage="handleResendMessage"
      @loadPrev="loadPrevHistory"
    />

    <ChatInput v-model="newMessage" @send="sendMessage" />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
  import ChatHeader from './components/ChatHeader.vue'
  import ChatMessages from './components/ChatMessages.vue'
  import ChatInput from './components/ChatInput.vue'
  import {
    createConversation,
    fetchConversationDetail,
    readConversation,
    closeConversation
  } from '@/api'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useWebSocketStore } from '@/stores/websocket'
  import { formatTime } from '@/utils/index.js'
  import { showConfirmDialog } from 'vant'
  defineOptions({ name: 'CustomerServiceView' })
  const wsStore = useWebSocketStore()
  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  // 聊天数据
  const showWelcome = ref(false)
  const newMessage = ref('')
  const messages = ref([])
  const chatMessagesRef = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
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

  // 统一转换历史记录为展示结构（按时间升序）
  const transformHistory = list => {
    return list.map(item => ({
      ...item,
      sender: getSenderValue(item.senderId),
      status: 'success'
    }))
  }

  // 获取聊天记录（首次加载/刷新）
  const getConversationHistory = async () => {
    const params = {
      conversationId: conversationId.value,
      page: 1,
      size: pageSize.value
    }
    const data = await fetchConversationDetail(params)
    messages.value = transformHistory(data)
    currentPage.value = 1
    hasMore.value = Array.isArray(data) && data.length === pageSize.value
  }

  // 上拉加载上一页历史（向列表顶部追加）
  const loadPrevHistory = async () => {
    if (!hasMore.value) {
      chatMessagesRef.value && chatMessagesRef.value.finishLoad(false)
      return
    }
    const nextPage = currentPage.value + 1
    const params = {
      conversationId: conversationId.value,
      page: nextPage,
      size: pageSize.value
    }
    try {
      const data = await fetchConversationDetail(params)
      const transformed = transformHistory(data)
      if (!Array.isArray(transformed) || transformed.length === 0) {
        hasMore.value = false
      } else {
        messages.value = [...transformed, ...messages.value]
        currentPage.value = nextPage
        hasMore.value = transformed.length === pageSize.value
      }
    } finally {
      chatMessagesRef.value && chatMessagesRef.value.finishLoad(hasMore.value)
    }
  }

  // 标记信息为已读
  const markAsRead = async () => {
    const params = {
      conversationId: conversationId.value
    }
    await readConversation(params)
  }

  // 接受消息者角色id字段映射
  const receiverRoleIdMap = {
    consumer: 'customerServiceId',
    admin: 'consumerId',
    customer_service: 'consumerId'
  }
  // 当前用户角色
  const role = computed(() => {
    return authStore.user.roleName
  })

  // 发送消息（WebSocket 实时发送，HTTP 备用已移除未使用实现）

  // 当前会话信息
  const conversationInfo = ref(null)
  // 初始化会话
  const initConversation = async conversationId => {
    console.log('initConversation', conversationId)
    // 创建对话
    // 如果不存在则创建会话
    if (!conversationId) {
      conversationInfo.value = await createConversation({
        carId: +route.query.carId || '',
        initialMessage: ''
      })
    }
    await getConversationHistory()
    nextTick(() => {
      chatMessagesRef.value && chatMessagesRef.value.resetLoadState()
    })
    await markAsRead()
  }

  // 对话接收者id
  // 根据当前用户角色动态获取
  const receiverId = computed(() => {
    if (conversationInfo.value) {
      return route.query.receiverId || conversationInfo.value[receiverRoleIdMap[role.value]]
    }
    return route.query.receiverId
  })

  // 会话id
  const conversationId = computed(() => {
    if (conversationInfo.value) {
      return route.query.conversationId || conversationInfo.value.id
    }
    return route.query.conversationId
  })

  console.log('conversationId', conversationId.value)

  // 初始化会话
  initConversation(conversationId.value)

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
      const message = {
        conversationId: conversationId.value,
        receiverId: receiverId.value, //接受者id
        content: value,
        messageType: 0
      }

      const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: message })
      if (!success) {
        updateMessageStatus(messageId, 'failed')
      }
      // WebSocket 发送成功状态会在收到服务器响应时更新
    } catch {
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
      const params = {
        conversationId: conversationId.value, //会话id
        receiverId: receiverId.value, //接收者id
        content: message.content, //内容
        messageType: 0 //消息类型：0-文本消息 1-图片消息
      }

      const success = wsStore.sendMessage({ type: 'SEND_MESSAGE', data: params })
      if (!success) {
        updateMessageStatus(message.id, 'failed')
      }
    } catch {
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
      new Promise(resolve => {
        if (action === 'confirm') {
          closeConversation({
            conversationId: conversationId.value
          })
            .then(() => {
              resolve(true)
              router.back()
            })
            .catch(() => {
              resolve(false)
            })
        } else {
          resolve(true)
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
