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
          <span class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <div class="order-content">
          <div class="car-image">
            <img :src="order.image" :alt="order.carName" />
          </div>
          <div class="car-info">
            <h3 class="car-name">{{ order.carName }}</h3>
            <p class="car-price">{{ order.price }}</p>
            <p class="order-time">{{ $t('orderProcess.createTime') }}: {{ order.createTime }}</p>
          </div>
        </div>

        <div class="order-actions">
          <van-button
            v-if="order.status === 'unpaid'"
            type="primary"
            size="small"
            @click.stop="payOrder(order)"
          >
            {{ $t('orderProcess.pay') }}
          </van-button>
          <van-button
            v-if="order.status === 'unreceived'"
            type="success"
            size="small"
            @click.stop="confirmReceive(order)"
          >
            {{ $t('orderProcess.confirmReceive') }}
          </van-button>
          <van-button
            plain
            size="small"
            @click.stop="viewDetail(order)"
          >
            {{ $t('orderProcess.viewDetail') }}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const getStatusText = (status) => {
  const statusMap = {
    unpaid: '待付款',
    unshipped: '待发货',
    unreceived: '待收货',
    completed: '已完成'
  }
  return statusMap[status] || status
}

const viewOrderDetail = (order) => {
  router.push(`/order/${order.id}`)
}

const payOrder = (order) => {
  showToast('跳转到支付页面')
}

const confirmReceive = (order) => {
  showToast('确认收货成功')
}

const viewDetail = (order) => {
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

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;

        .order-id {
          font-size: 14px;
          color: #666;
        }

        .order-status {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;

          &.unpaid {
            background: #fff2e8;
            color: #ff6b35;
          }

          &.unshipped {
            background: #e6f7ff;
            color: #1890ff;
          }

          &.unreceived {
            background: #f6ffed;
            color: #52c41a;
          }

          &.completed {
            background: #f0f0f0;
            color: #666;
          }
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
        }
      }

      .order-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    }
  }
}
</style>
