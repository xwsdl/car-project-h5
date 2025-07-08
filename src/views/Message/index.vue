<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-20 09:34:18
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-08 15:29:41
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
            <span class="time">{{ msg.time }}</span>
          </div>
          <div class="summary">{{ msg.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'

  const customerMessages = ref([
    {
      id: 'a',
      name: 'A客户',
      summary: 'A客户的最新消息内容',
      time: '10:30',
      avatar: defaultAvatar
    },
    {
      id: 'b',
      name: 'B客户',
      summary: 'B客户的最新消息内容',
      time: '09:15',
      avatar: defaultAvatar
    },
    {
      id: 'c',
      name: 'C客户',
      summary: 'C客户的最新消息内容',
      time: '昨天',
      avatar: defaultAvatar
    }
  ])

  const router = useRouter()
  const goBack = () => {
    router.back()
  }

  const onMessageClick = msg => {
    // 这里可跳转到聊天详情页，暂用弹窗演示
    if (window.$toast) {
      window.$toast(`点击了${msg.name}`)
    } else {
      alert(`点击了${msg.name}`)
    }
  }
</script>

<style lang="scss" scoped>
  .message-page {
    min-height: 100vh;
    background-color: #f5f5f5;

    .wechat-message-list {
      display: flex;
      flex-direction: column;
      gap: 0;
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
