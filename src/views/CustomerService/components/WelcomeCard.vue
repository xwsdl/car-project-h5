<template>
  <div class="welcome-card" v-if="show">
    <h3>📱 联系我们</h3>
    <p>你好，有喜欢的车型请添加微信或者WhatsApp与我联系</p>

    <div class="contact-methods">
      <ContactButton platform="wechat" text="微信客服" @show-chat-window="showChatWindow" />
      <ContactButton platform="whatsapp" text="WhatsApp" @show-chat-window="showChatWindow" />
    </div>
  </div>
</template>

<script setup>
import ContactButton from './ContactButton.vue'
import { getFile } from '@/utils/index.js'
import { ref, reactive } from 'vue'
import { showImagePreview } from 'vant'
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})

const imageList = reactive({
  wechat: getFile('wechat.jpg'),
  whatsapp: getFile('whatsApp.jpg'),
})

const showChatWindow = (value) => {
  showImagePreview([imageList[value]]);
}
</script>

<style scoped>
.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.15);
  text-align: center;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card h3 {
  color: var(--primary);
  margin-bottom: 15px;
  font-size: 18px;
}

.welcome-card p {
  margin-bottom: 20px;
  line-height: 1.6;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}
</style>