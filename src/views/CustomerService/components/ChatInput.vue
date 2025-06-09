<template>
  <div class="chat-input-area">
    <div class="input-container">
      <van-icon name="add" class="action-btn" />
      <input 
        type="text" 
        class="chat-input" 
        placeholder="输入消息..."
        v-model="message"
        @keyup.enter="send"
      >
      <van-icon name="smile" class="action-btn" />
    </div>
    <van-button 
      class="send-btn" 
      type="primary" 
      icon="back-top"
      @click="send"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const message = ref('')
const emit = defineEmits(['send'])

const send = () => {
  if (message.value.trim()) {
    console.log('发送消息：', message.value)
    emit('send', message.value)
    message.value = ''
  }
}
</script>

<style scoped>
.chat-input-area {
  background: white;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border-color);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.input-container {
  flex: 1;
  background: var(--light-bg);
  border-radius: 20px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  padding: 0 10px;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--gray-text);
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>