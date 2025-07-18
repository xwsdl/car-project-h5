<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-07-08 20:07:26
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-18 23:22:45
 * @FilePath: \car-project-h5\src\views\OrderProcess\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="order-process">
    <van-nav-bar :title="$t('orderProcess.title')" left-arrow @click-left="goBack" />
    <div class="order-content">
      <!-- 直接渲染全部订单列表 -->
      <order-list :orders="orders" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import OrderList from './components/OrderList.vue'
  import { fetchUserOrder } from '@/api'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const router = useRouter()

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

  fetchUserOrder(authStore.user.id).then(data => {
    orders.value = data
  })

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
