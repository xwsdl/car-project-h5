<template>
  <div class="chat-header">
    <van-icon name="arrow-left" class="back-btn" @click="goBack" />
    <div class="agent-info">
      <div class="agent-avatar">CS</div>
      <div class="agent-details">
        <h3>客服</h3>
        <p><span class="status-dot"></span> 在线</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.chat-header {
  background: white;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.back-btn {
  margin-right: 15px;
  font-size: 18px;
  color: var(--primary);
  cursor: pointer;
}

.agent-info {
  display: flex;
  align-items: center;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 12px;
}

.agent-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
}

.agent-details p {
  font-size: 12px;
  color: var(--success);
  display: flex;
  align-items: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  margin-right: 5px;
}
</style>