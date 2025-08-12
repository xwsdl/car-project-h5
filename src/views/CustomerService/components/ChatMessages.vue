<template>
  <div class="chat-messages" ref="messagesContainer">
    <!-- 自动欢迎消息 -->
    <div class="message received" v-if="showWelcome">
      <div class="message-bubble">你好！我是汽车销售客服，有什么可以帮您的吗？</div>
      <div class="message-time">{{ formatTime(new Date()) }}</div>
    </div>

    <!-- 消息列表 -->
    <div
      class="message"
      :class="msg.sender"
      v-for="(msg, index) in messages"
      :key="msg.id || index"
    >
      <div class="message-bubble">{{ msg.content }}</div>
      <div class="message-footer">
        <div class="message-time">{{ msg.sendTime }}</div>
        <div v-if="msg.sender === 'self'" class="message-status" :class="msg.status">
          <span v-if="msg.status === 'sending'" class="status-sending">
            <i class="loading-icon"></i>
            {{ $t('customerService.sending') }}
          </span>
          <span v-else-if="msg.status === 'success'" class="status-success">
            <i class="success-icon">✓</i>
            {{ $t('customerService.sent') }}
          </span>
          <span
            v-else-if="msg.status === 'failed'"
            class="status-failed"
            @click="resendMessage(msg)"
          >
            <i class="failed-icon">!</i>
            {{ $t('customerService.send_failed_click_retry') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, watch } from 'vue'
  import WelcomeCard from './WelcomeCard.vue'
  import { formatTime } from '@/utils/index.js'

  const props = defineProps({
    messages: Array,
    showWelcome: Boolean,
    cars: Array
  })

  const emit = defineEmits(['scrollToBottom', 'resendMessage'])

  const messagesContainer = ref(null)

  // 重发消息
  const resendMessage = message => {
    emit('resendMessage', message)
  }
  // 处理车型选择
  const handleCarSelected = car => {
    // 在实际应用中，这里可以发送一条关于该车型的消息

    emit('message', {
      text: `我对${car.name}感兴趣，能详细介绍一下吗？`,
      sender: 'self',
      time: new Date()
    })
  }

  // 监听消息变化（排除历史记录加载）
  watch(
    () => props.messages,
    (newVal, oldVal) => {
      // 只有新消息添加到末尾时才滚动
      if (
        newVal.length > oldVal.length &&
        newVal[newVal.length - 1] !== oldVal[oldVal.length - 1]
      ) {
        emit('scrollToBottom')
      }
    },
    { deep: true }
  )

  onMounted(() => {
    nextTick(() => {
      emit('scrollToBottom')
    })
  })
</script>

<style scoped>
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 15px 80px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f7f8fa"/><path d="M20,20 Q40,10 60,20 T100,20 M20,60 Q40,50 60,60 T100,60 M20,40 Q40,30 60,40 T100,40" stroke="%23e0e0e0" stroke-width="0.5" fill="none"/></svg>');
    background-size: 100px;
  }

  .message {
    max-width: 80%;
    margin-bottom: 20px;
    position: relative;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.received {
    align-self: flex-start;
  }

  .message.self {
    align-self: flex-end;
    margin-left: auto;
  }

  .message-bubble {
    padding: 12px 15px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.5;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .received .message-bubble {
    background: white;
    border-top-left-radius: 5px;
    color: var(--dark-text);
  }

  .self .message-bubble {
    background: #167be1;
    color: white;
    border-top-right-radius: 5px;
  }

  .message-footer {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
  }

  .message-time {
    color: var(--gray-text);
  }

  .message-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
  }

  .status-sending {
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .status-success {
    color: #07c160;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .status-failed {
    color: #fa5151;
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .status-failed:hover {
    opacity: 0.8;
  }

  .loading-icon {
    width: 12px;
    height: 12px;
    border: 1px solid #999;
    border-top: 1px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .success-icon {
    font-size: 10px;
    font-weight: bold;
  }

  .failed-icon {
    width: 12px;
    height: 12px;
    background: #fa5151;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: bold;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .self .message-footer {
    justify-content: flex-end;
    flex-direction: row-reverse;
    gap: 8px;
  }

  .received .message-footer {
    justify-content: flex-start;
  }
</style>
