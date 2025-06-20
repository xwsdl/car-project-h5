<template>
  <div class="order-process">
    <van-nav-bar
      :title="$t('orderProcess.title')"
      left-arrow
      @click-left="goBack"
    />

    <div class="order-content">
      <van-tabs v-model="activeTab" sticky>
        <van-tab :title="$t('orderProcess.tabs.all')" name="all">
          <order-list :orders="allOrders" />
        </van-tab>
        <van-tab :title="$t('orderProcess.tabs.unpaid')" name="unpaid">
          <order-list :orders="unpaidOrders" />
        </van-tab>
        <van-tab :title="$t('orderProcess.tabs.unshipped')" name="unshipped">
          <order-list :orders="unshippedOrders" />
        </van-tab>
        <van-tab :title="$t('orderProcess.tabs.unreceived')" name="unreceived">
          <order-list :orders="unreceivedOrders" />
        </van-tab>
        <van-tab :title="$t('orderProcess.tabs.completed')" name="completed">
          <order-list :orders="completedOrders" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import OrderList from './components/OrderList.vue'

const router = useRouter()
const activeTab = ref('all')

// 模拟订单数据
const orders = ref([
  {
    id: '1',
    carName: '奥迪 A4L',
    price: '25.8万',
    status: 'unpaid',
    createTime: '2024-01-15',
    image: '/src/assets/images/aodi.png'
  },
  {
    id: '2',
    carName: '宝马 3系',
    price: '32.5万',
    status: 'unshipped',
    createTime: '2024-01-14',
    image: '/src/assets/images/baoma.png'
  },
  {
    id: '3',
    carName: '奔驰 C级',
    price: '28.9万',
    status: 'unreceived',
    createTime: '2024-01-13',
    image: '/src/assets/images/benchi.png'
  },
  {
    id: '4',
    carName: '比亚迪 汉',
    price: '22.8万',
    status: 'completed',
    createTime: '2024-01-12',
    image: '/src/assets/images/BYD.png'
  }
])

// 根据状态筛选订单
const allOrders = computed(() => orders.value)
const unpaidOrders = computed(() => orders.value.filter(order => order.status === 'unpaid'))
const unshippedOrders = computed(() => orders.value.filter(order => order.status === 'unshipped'))
const unreceivedOrders = computed(() => orders.value.filter(order => order.status === 'unreceived'))
const completedOrders = computed(() => orders.value.filter(order => order.status === 'completed'))

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.order-process {
  min-height: 100vh;
  background-color: #f5f5f5;

  .order-content {
    padding-bottom: 50px;
  }
}
</style>
