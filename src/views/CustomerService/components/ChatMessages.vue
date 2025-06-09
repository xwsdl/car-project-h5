<template>
  <div class="chat-messages" ref="messagesContainer">
    <!-- 自动欢迎消息 -->
    <div class="message received" v-if="showWelcome">
      <div class="message-bubble">
        你好！我是汽车销售客服，有什么可以帮您的吗？
      </div>
      <div class="message-time">{{ formatTime(new Date()) }}</div>
    </div>
    
    <!-- 客服提示卡片 -->
    <WelcomeCard v-if="showWelcome" />
    
    <!-- 热门车型推荐 -->
    <!-- <CarModels :cars="cars" @car-selected="handleCarSelected" /> -->
    
    <!-- 消息列表 -->
    <div 
      class="message" 
      :class="msg.sender" 
      v-for="(msg, index) in messages" 
      :key="index"
    >
      <div class="message-bubble">{{ msg.text }}</div>
      <div class="message-time">{{ formatTime(msg.time) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import WelcomeCard from './WelcomeCard.vue'
import CarModels from './CarModels.vue'

const props = defineProps({
  messages: Array,
  showWelcome: Boolean,
  cars: Array
})

const emit = defineEmits(['scrollToBottom'])

const messagesContainer = ref(null)

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 处理车型选择
const handleCarSelected = (car) => {
  // 在实际应用中，这里可以发送一条关于该车型的消息
  console.log(`用户选择了车型: ${car.name}`)
  
  emit('message', {
    text: `我对${car.name}感兴趣，能详细介绍一下吗？`,
    sender: 'sent',
    time: new Date()
  })
}

onMounted(() => {
  emit('scrollToBottom')
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.received {
  align-self: flex-start;
}

.message.sent {
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

.sent .message-bubble {
  background: #167BE1;
  color: white;
  border-top-right-radius: 5px;
}

.message-time {
  font-size: 11px;
  color: var(--gray-text);
  margin-top: 5px;
  text-align: right;
}
</style>