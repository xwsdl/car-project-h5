<template>
  <div class="message-list">
    <van-empty v-if="messages.length === 0" :description="$t('message.empty')" />

    <div v-else class="message-items">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.isRead }"
        @click="viewMessage(message)"
      >
        <div class="message-icon">
          <van-icon :name="message.icon" :class="message.type" />
        </div>

        <div class="message-content">
          <div class="message-header">
            <h3 class="message-title">{{ message.title }}</h3>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <p class="message-text">{{ message.content }}</p>
        </div>

        <div class="message-actions">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showToast } from 'vant'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const viewMessage = (message) => {
  // 标记消息为已读
  message.isRead = true
  showToast('查看消息详情')
}
</script>

<style lang="scss" scoped>
.message-list {
  padding: 16px;

  .message-items {
    .message-item {
      background: white;
      border-radius: 8px;
      margin-bottom: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.unread {
        border-left: 4px solid #1890ff;
        background: #f8f9ff;

        .message-title {
          font-weight: 600;
        }
      }

      .message-icon {
        margin-right: 12px;
        margin-top: 2px;

        .van-icon {
          font-size: 20px;

          &.system {
            color: #1890ff;
          }

          &.order {
            color: #52c41a;
          }

          &.promotion {
            color: #ff6b35;
          }
        }
      }

      .message-content {
        flex: 1;

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .message-title {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
            color: #333;
            flex: 1;
            margin-right: 8px;
          }

          .message-time {
            font-size: 12px;
            color: #999;
            white-space: nowrap;
          }
        }

        .message-text {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .message-actions {
        margin-left: 12px;
        margin-top: 2px;

        .van-icon {
          color: #ccc;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
