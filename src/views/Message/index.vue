<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-20 09:34:18
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-08-09 15:46:36
 * @FilePath: \car-project-h5\src\views\Message\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="message-page">
    <van-nav-bar :title="$t('message.title')" left-arrow @click-left="goBack" />

    <div class="wechat-message-list">
      <div
        v-for="msg in customerMessages"
        :key="msg.id"
        class="wechat-message-item"
        @click="onMessageClick(msg)"
      >
        <img class="avatar" :src="msg.avatar" alt="avatar" />
        <div class="content">
          <div class="header">
            <span class="name">{{ msg.name }}</span>
            <span class="time">{{ msg.lastMessageTimeStr }}</span>
          </div>
          <div class="summary">{{ msg.lastMessage }}</div>
        </div>
         <van-badge :content="msg.unreadCount" max="99" :show-zero="false" :offset="[0, -20]" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { fetchConversationList } from '@/api'
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useWebSocketStore } from '@/stores/websocket'
  const wsStore = useWebSocketStore()
  const authStore = useAuthStore()

  const role = computed(() => {
    return authStore.user.roleName
  })

  // 角色头像映射
  const roleViewAvatarMap = {
    consumer: 'customerServiceAvatar',
    admin: 'customerAvatar',
    customer_service: 'customerAvatar'
  }
  // 角色名称映射
  const roleViewNameMap = {
    consumer: 'customerServiceName',
    admin: 'customerName',
    customer_service: 'customerName'
  }

  // 接受消息者角色id字段映射
  const receiverRoleIdMap = {
    consumer: 'customerServiceId',
    admin: 'consumerId',
    customer_service: 'consumerId'
  }

  const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'

  const customerMessages = ref([])

  const getConversationList = async () => {
    const list = await fetchConversationList()
    customerMessages.value =
      list.map(item => ({
        ...item,
        name: item[roleViewNameMap[role.value]],
        avatar: item[roleViewAvatarMap[role.value]],
        receiverId: item[receiverRoleIdMap[role.value]] //接收者id
      })) || []
  }

  getConversationList()

  const router = useRouter()
  const goBack = () => {
    router.back()
  }

  const onMessageClick = msg => {
    router.push({
      path: '/customerService',
      query: {
        carId: msg.carId, //汽车id
        conversationId: msg.id, //会话id
        receiverId: msg.receiverId //接收者id
      }
    })
  }

  onMounted(() => {
    // 订阅websocket响应回来的消息(更新对话列表)
    const unsubscribe = wsStore.onMessage(message => {
      if (message.type === 'SEND_MESSAGE_RECEIVED') {
        const { conversationId, content, sendTime, isRead } = message.data
        customerMessages.value.forEach(item => {
          if (item.conversationId === conversationId) {
            item.lastMessage = content
            item.lastMessageTimeStr = sendTime
            item.unreadCount = isRead ? item.unreadCount : item.unreadCount + 1
          }
        })
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

<style lang="scss" scoped>
  .message-page {
    min-height: 100vh;
    background-color: #f5f5f5;

    .wechat-message-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding-bottom: 45px;
    }

    .wechat-message-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;

      &:active {
        background: #f2f2f2;
      }

      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
        background: #eee;
      }

      .content {
        flex: 1;
        min-width: 0;

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .name {
            font-size: 16px;
            font-weight: 500;
            color: #222;
          }
          .time {
            font-size: 12px;
            color: #999;
            margin-left: 8px;
            white-space: nowrap;
          }
        }

        .summary {
          font-size: 14px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
