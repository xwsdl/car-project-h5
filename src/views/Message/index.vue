<template>
  <div class="message-page">
    <van-nav-bar
      :title="$t('message.title')"
      left-arrow
      @click-left="goBack"
    />

    <div class="message-content">
      <van-tabs v-model="activeTab" sticky>
        <van-tab :title="$t('message.tabs.system')" name="system">
          <message-list :messages="systemMessages" />
        </van-tab>
        <van-tab :title="$t('message.tabs.order')" name="order">
          <message-list :messages="orderMessages" />
        </van-tab>
        <van-tab :title="$t('message.tabs.promotion')" name="promotion">
          <message-list :messages="promotionMessages" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MessageList from './components/MessageList.vue'

const router = useRouter()
const activeTab = ref('system')

// 模拟消息数据
const messages = ref([
  {
    id: '1',
    type: 'system',
    title: '系统维护通知',
    content: '系统将于今晚22:00-24:00进行维护，期间可能影响正常使用',
    time: '2024-01-15 10:30',
    isRead: false,
    icon: 'info-o'
  },
  {
    id: '2',
    type: 'order',
    title: '订单状态更新',
    content: '您的订单 #12345 已发货，预计3-5天送达',
    time: '2024-01-14 15:20',
    isRead: true,
    icon: 'logistics'
  },
  {
    id: '3',
    type: 'order',
    title: '支付成功',
    content: '您的订单 #12346 支付成功，商家正在处理中',
    time: '2024-01-14 09:15',
    isRead: false,
    icon: 'success'
  },
  {
    id: '4',
    type: 'promotion',
    title: '限时优惠活动',
    content: '新年特惠，全场汽车8折起，限时3天！',
    time: '2024-01-13 14:00',
    isRead: true,
    icon: 'gift-o'
  },
  {
    id: '5',
    type: 'promotion',
    title: '新车型上市',
    content: '全新奥迪A6L现已上市，预约试驾享优惠',
    time: '2024-01-12 11:30',
    isRead: false,
    icon: 'star-o'
  }
])

// 根据类型筛选消息
const systemMessages = computed(() => messages.value.filter(msg => msg.type === 'system'))
const orderMessages = computed(() => messages.value.filter(msg => msg.type === 'order'))
const promotionMessages = computed(() => messages.value.filter(msg => msg.type === 'promotion'))

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background-color: #f5f5f5;

  .message-content {
    padding-bottom: 50px;
  }
}
</style>
