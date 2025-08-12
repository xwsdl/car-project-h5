<template>
  <div class="chat-header">
    <van-icon name="arrow-left" class="back-btn" @click="goBack" />
    <div class="agent-info">
      <div class="agent-avatar">
        <img class="avatar" :src="receiverInfo && receiverInfo.avatar" alt="avatar" />
      </div>
      <div class="agent-details">
        <h3>{{ receiverName }}</h3>
        <p>
          <span class="status-dot"></span>
          {{ $t('customerService.online') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { getUserInfo } from '@/api'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const props = defineProps({
    receiverId: [String, Number]
  })

  const receiverInfo = ref({
    username: t('customerService.customer_service')
  })
  const receiverName = computed(() => {
    // 1.接受者为客服
    if (receiverInfo.value?.roleName === 'customer_service') {
      return `${t('customerService.customer_service')}-${receiverInfo.value.username}`
    }
    return receiverInfo.value?.username
  })
  const getReceiverInfo = async () => {
    if (!props.receiverId) return
    receiverInfo.value = await getUserInfo(props.receiverId)
  }

  getReceiverInfo()

  const emit = defineEmits(['close-chat'])

  const goBack = () => {
    emit('close-chat')
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

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #eee;
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
