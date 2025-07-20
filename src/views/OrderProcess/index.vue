<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-07-08 20:07:26
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-20 18:37:25
 * @FilePath: \car-project-h5\src\views\OrderProcess\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="order-process">
    <van-nav-bar :title="$t('orderProcess.title')" left-arrow @click-left="goBack" />
    <div class="order-content">
      <!-- 直接渲染全部订单列表 -->
      <order-list :orders="orders" @cancel="handleCancelOrder" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import OrderList from './components/OrderList.vue'
  import { fetchUserOrder, cancelOrderStatus } from '@/api'
  import { useAuthStore } from '@/stores/auth'
  import { extractImageUrls } from '@/utils'
  import { showToast } from 'vant'
  const authStore = useAuthStore()
  const router = useRouter()

  // 模拟订单数据
  const orders = ref([])

  const pageInit = () => {
    fetchUserOrder(authStore.user.id).then(data => {
      orders.value = data.map(item => {
        const imageList = (item.carOtherPics && extractImageUrls(item.carOtherPics)) || []
        return {
          ...item,
          mainImageUrl: imageList[0]
        }
      })
    })
  }

  pageInit()

  const goBack = () => {
    router.back()
  }

  const handleCancelOrder = order => {
    cancelOrderStatus(order.id).then(res => {
      showToast('取消成功')
      pageInit()
    })
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
