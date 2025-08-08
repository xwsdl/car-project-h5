<template>
  <div class="chat-container">
    <ChatHeader />

    <ChatMessages
      :messages="messages"
      :showWelcome="showWelcome"
      :cars="cars"
      @scrollToBottom="scrollToBottom"
    />

    <ChatInput v-model="newMessage" @send="sendMessage" />
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import ChatHeader from './components/ChatHeader.vue'
  import ChatMessages from './components/ChatMessages.vue'
  import ChatInput from './components/ChatInput.vue'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // 聊天数据
  const showWelcome = ref(true)
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

  // 发送消息
  const sendMessage = value => {
    console.log('发送消息12321：', value)
    if (!value.trim()) return

    messages.value.push({
      text: value,
      sender: 'sent',
      time: new Date()
    })

    newMessage.value = ''
    scrollToBottom()

    // 模拟客服回复
    setTimeout(() => {
      const replies = [
        t('customerService.reply1'),
        t('customerService.reply2'),
        t('customerService.reply3'),
        t('customerService.reply4'),
        t('customerService.reply5')
      ]

      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      messages.value.push({
        text: randomReply,
        sender: 'received',
        time: new Date()
      })

      scrollToBottom()
    }, 1000)
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

  onMounted(() => {
    scrollToBottom()
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
