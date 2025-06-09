<template>
  <div @click="handleContact" class="contact-btn">
    <div class="contact-icon">{{ platformIcon }}</div>
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['show-chat-window'])
const props = defineProps({
  platform: {
    type: String,
    required: true,
    validator: (value) => ['wechat', 'whatsapp'].includes(value),
  },
  text: {
    type: String,
    default: '联系我们',
  },
})

const handleContact = () => {
  // 显示聊天窗口
  emit('show-chat-window', props.platform)
}

// 根据平台返回对应的图标
const platformIcon = computed(() => {
  return {
    wechat: '微',
    whatsapp: 'W',
  }[props.platform]
})

// 根据平台返回对应的链接
const platformLink = computed(() => {
  return {
    wechat: 'weixin://',
    whatsapp: 'https://wa.me/',
  }[props.platform]
})
</script>

<style scoped>
.contact-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f7ff;
  border-radius: 10px;
  padding: 12px 15px;
  width: 120px;
  text-decoration: none;
  color: var(--primary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(25, 137, 250, 0.2);
}

.contact-icon {
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: bold;
}
</style>