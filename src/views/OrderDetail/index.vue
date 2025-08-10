<template>
  <div class="order-detail">
    <van-nav-bar :title="$t('orderDetail.title')" left-arrow @click-left="goBack" />

    <div class="order-content">
      <!-- 订单基础信息 -->
      <div class="order-info-card">
        <div class="order-header">
          <h3 class="order-title">{{ $t('orderDetail.orderInfo') }}</h3>
          <span class="order-status">
            {{ getStatusText(orderDetail.orderStatus) }}
          </span>
        </div>

        <div class="order-basic-info">
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.orderId') }}:</span>
            <span class="value">{{ orderDetail.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.createTime') }}:</span>
            <span class="value">{{ orderDetail.createTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.carName') }}:</span>
            <span class="value" @click="goCarDetailPage(orderDetail.carId)">
              {{ orderDetail.carName }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('orderDetail.price') }}:</span>
            <span class="value price">{{ orderDetail.carPrice }}</span>
          </div>
        </div>
      </div>

      <!-- 垂直进度条 -->
      <div class="progress-section">
        <h3 class="section-title">{{ $t('orderDetail.progressTitle') }}</h3>
        <order-progress
          :progress-data="progressData"
          @refresh="() => getOrderDetail(orderDetail.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import OrderProgress from './components/OrderProgress.vue'
  import { fetchOrderDetail } from '@/api'

  const route = useRoute()
  const router = useRouter()
  const { t: $t } = useI18n()

  // 订单详情数据
  const orderDetail = ref({
    orderId: '',
    carName: '',
    carPrice: '',
    orderStatus: '',
    createTime: '',
    mainImage: ''
  })

  // 进度数据（模拟接口返回）
  const progressData = ref([])

  // 获取状态文本
  const getStatusText = status => {
    const statusMap = {
      unpaid: $t('orderDetail.status.unpaid'),
      unshipped: $t('orderDetail.status.unshipped'),
      unreceived: $t('orderDetail.status.unreceived'),
      completed: $t('orderDetail.status.completed')
    }
    return statusMap[status] || status
  }

  // 获取订单详情
  const getOrderDetail = async orderId => {
    try {
      const response = await fetchOrderDetail(orderId)
      orderDetail.value = response
      progressData.value = response.processNodes.map(item => ({
        ...item,
        attachments: item.attachments || []
      }))
    } catch (error) {
      console.error('获取订单详情失败:', error)
    }
  }

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  const goCarDetailPage = carId => {
    router.push(`/car?id=${carId}`)
  }

  // 页面加载时获取数据
  onMounted(async () => {
    const orderId = route.query.id
    if (orderId) {
      await getOrderDetail(orderId)
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
