<template>
  <div class="order-detail">
    <van-nav-bar
      :title="$t('orderDetail.title')"
      left-arrow
      @click-left="goBack"
    />

    <div class="order-content">
      <!-- 订单基础信息 -->
      <div class="order-info-card">
        <div class="order-header">
          <h3 class="order-title">{{ $t('orderDetail.orderInfo') }}</h3>
          <span class="order-status" :class="orderDetail.status">
            {{ getStatusText(orderDetail.status) }}
          </span>
        </div>

        <div class="order-basic-info">
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.orderId') }}:</span>
            <span class="value">{{ orderDetail.orderId }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.createTime') }}:</span>
            <span class="value">{{ orderDetail.createTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.carName') }}:</span>
            <span class="value">{{ orderDetail.carName }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.price') }}:</span>
            <span class="value price">{{ orderDetail.price }}</span>
          </div>
        </div>
      </div>

      <!-- 垂直进度条 -->
      <div class="progress-section">
        <h3 class="section-title">{{ $t('orderDetail.progressTitle') }}</h3>
        <order-progress :progress-data="progressData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import OrderProgress from './components/OrderProgress.vue'
import { fetchOrderDetail, fetchOrderAllProcessNodes } from '@/api'

const route = useRoute()
const router = useRouter()
const { t: $t } = useI18n()

// 订单详情数据
const orderDetail = ref({
  orderId: '',
  carName: '',
  price: '',
  status: '',
  createTime: ''
})

// 进度数据（模拟接口返回）
const progressData = ref([])

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    unpaid: $t('orderDetail.status.unpaid'),
    unshipped: $t('orderDetail.status.unshipped'),
    unreceived: $t('orderDetail.status.unreceived'),
    completed: $t('orderDetail.status.completed')
  }
  return statusMap[status] || status
}

// 获取订单详情
const getOrderDetail = async (orderId) => {
  try {
    const response = await fetchOrderDetail(orderId)
    orderDetail.value = response.data || {
      orderId: orderId,
      carName: '奥迪 A4L 2024款 40 TFSI 豪华型',
      price: '¥258,000',
      status: 'unshipped',
      createTime: '2024-01-15 14:30:25'
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    // 使用模拟数据作为后备
    orderDetail.value = {
      orderId: orderId,
      carName: '奥迪 A4L 2024款 40 TFSI 豪华型',
      price: '¥258,000',
      status: 'unshipped',
      createTime: '2024-01-15 14:30:25'
    }
  }
}

// 获取进度数据
const fetchProgressData = async (orderId) => {
  try {
    const response = await fetchOrderAllProcessNodes(orderId)
    progressData.value = response.data || []
    throw new Error('获取订单进度失败')
  } catch (error) {
    console.error('获取订单进度失败:', error)
    // 使用模拟数据作为后备
    progressData.value = [
      {
        id: 1,
        title: $t('orderDetail.progress.orderCreated'),
        status: 'completed',
        time: '2024-01-15 14:30:25',
        description: $t('orderDetail.progress.orderCreatedDesc'),
        attachments: [
          {
            id: 1,
            name: '订单确认书.pdf',
            type: 'pdf',
            url: '/api/files/order-confirm.pdf',
            size: '256KB'
          },
          {
            id: 2,
            name: '车辆配置单.jpg',
            type: 'image',
            url: '/api/files/car-config.jpg',
            size: '1.2MB'
          }
        ]
      },
      {
        id: 2,
        title: $t('orderDetail.progress.paymentCompleted'),
        status: 'completed',
        time: '2024-01-15 15:45:12',
        description: $t('orderDetail.progress.paymentCompletedDesc'),
        attachments: [
          {
            id: 3,
            name: '支付凭证.png',
            type: 'image',
            url: '/api/files/payment-proof.png',
            size: '856KB'
          }
        ]
      },
      {
        id: 3,
        title: $t('orderDetail.progress.merchantAccepted'),
        status: 'active',
        time: '2024-01-16 09:20:30',
        description: $t('orderDetail.progress.merchantAcceptedDesc'),
        attachments: [
          {
            id: 4,
            name: '接单确认书.pdf',
            type: 'pdf',
            url: '/api/files/accept-confirm.pdf',
            size: '312KB'
          },
          {
            id: 5,
            name: '车辆照片1.jpg',
            type: 'image',
            url: '/api/files/car-photo1.jpg',
            size: '2.1MB'
          },
          {
            id: 6,
            name: '车辆照片2.jpg',
            type: 'image',
            url: '/api/files/car-photo2.jpg',
            size: '1.8MB'
          }
        ]
      },
      {
        id: 32,
        title: '上传中23423',
        status: 'processing',
        time: '2024-01-16 09:20:30',
        description: $t('orderDetail.progress.merchantAcceptedDesc'),
        attachments: []
      },
      {
        id: 4,
        title: $t('orderDetail.progress.preparingDelivery'),
        status: 'pending',
        time: '',
        description: $t('orderDetail.progress.preparingDeliveryDesc'),
        attachments: []
      },
      {
        id: 5,
        title: $t('orderDetail.progress.deliveryCompleted'),
        status: 'pending',
        time: '',
        description: $t('orderDetail.progress.deliveryCompletedDesc'),
        attachments: []
      }
    ]
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 页面加载时获取数据
onMounted(async () => {
  const orderId = route.query.id
  if (orderId) {
    await getOrderDetail(orderId)
    await fetchProgressData(orderId)
  }
})
</script>

<style lang="scss" scoped>
.order-detail {
  min-height: 100vh;
  background-color: #f5f5f5;

  .order-content {
    padding: 16px;
  }

  .order-info-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;

      .order-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .order-status {
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 16px;
        font-weight: 500;

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

    .order-basic-info {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 14px;
          color: #666;
        }

        .value {
          font-size: 14px;
          color: #333;
          font-weight: 500;

          &.price {
            color: #ff6b35;
            font-weight: 600;
            font-size: 16px;
          }
        }
      }
    }
  }

  .progress-section {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }
  }
}
</style>
