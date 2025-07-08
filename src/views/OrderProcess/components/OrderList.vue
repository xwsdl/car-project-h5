<template>
  <div class="order-list">
    <van-empty v-if="orders.length === 0" :description="$t('orderProcess.empty')" />

    <div v-else class="order-items">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-item"
        @click="viewOrderDetail(order)"
      >
        <div class="order-header">
          <span class="order-id">{{ $t('orderProcess.orderId') }}: {{ order.id }}</span>
          <!-- 删除状态标签 -->
        </div>

        <div class="order-content">
          <div class="car-image">
            <img :src="order.image" :alt="order.carName" />
          </div>
          <div class="car-info">
            <h3 class="car-name">{{ order.carName }}</h3>
            <p class="car-price">{{ order.price }}</p>
            <p class="order-time">{{ $t('orderProcess.createTime') }}: {{ order.createTime }}</p>
            <!-- 新增：实际进度展示 -->
            <p class="order-progress">{{$t('orderProcess.progress')}}：{{ getStatusText(order.status) }}</p>
          </div>
        </div>

        <!-- 删除底部按钮 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t: $t } = useI18n()

defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const getStatusText = (status) => {
  // 建议后续用i18n多语言
  const statusMap = {
    unpaid: $t('orderProcess.status.unpaid'),
    unshipped: $t('orderProcess.status.unshipped'),
    unreceived: $t('orderProcess.status.unreceived'),
    completed: $t('orderProcess.status.completed')
  }
  return statusMap[status] || status
}

const viewOrderDetail = (order) => {
  router.push(`/order/${order.id}`)
}
</script>

<style lang="scss" scoped>
.order-list {
  padding: 16px;

  .order-items {
    .order-item {
      background: white;
      border-radius: 8px;
      margin-bottom: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: box-shadow 0.2s;
      &:active {
        box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      }
      .order-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
        .order-id {
          font-size: 14px;
          color: #666;
        }
      }
      .order-content {
        display: flex;
        margin-bottom: 12px;
        .car-image {
          width: 80px;
          height: 60px;
          margin-right: 12px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
          }
        }
        .car-info {
          flex: 1;
          .car-name {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 4px 0;
            color: #333;
          }
          .car-price {
            font-size: 18px;
            font-weight: bold;
            color: #ff6b35;
            margin: 0 0 4px 0;
          }
          .order-time {
            font-size: 12px;
            color: #999;
            margin: 0;
          }
          .order-progress {
            font-size: 13px;
            color: #1890ff;
            margin: 4px 0 0 0;
          }
        }
      }
    }
  }
}
</style>
