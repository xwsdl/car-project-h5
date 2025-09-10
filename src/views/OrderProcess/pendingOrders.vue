<!-- 用于客服 -->
<template>
  <div class="order-process">
    <van-nav-bar :title="$t('common.pending_orders')" left-arrow @click-left="goBack" />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('common.noMore')"
      @load="onLoad"
    >
      <div class="order-content">
        <OrderItem
          v-for="order in list"
          :key="order.id"
          :order="order"
          @cancel="handleCancelOrder"
        />
      </div>
    </van-list>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  import { useRouter } from 'vue-router'

  import { fetchUncompleted, cancelOrderStatus } from '@/api'
  import { useAuthStore } from '@/stores/auth'
  import { extractImageUrls } from '@/utils'
  import { showToast } from 'vant'
  import OrderItem from './components/OrderItem.vue'
  const authStore = useAuthStore()
  const router = useRouter()

  const list = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const params = ref({
    pageNum: 0,
    pageSize: 20,
    keyword: ''
  })
  const onLoad = () => {
    params.value.pageNum++
    fetchUncompleted({ ...params.value }).then(data => {
      const { records } = data
      const result = records.map(item => {
        const imageList = (item.carOtherPics && extractImageUrls(item.carOtherPics)) || []
        return {
          ...item,
          mainImageUrl: imageList[0]
        }
      })
      // 加载状态结束
      loading.value = false
      // 获取数据和加载更多
      if (params.value.pageNum == 1) {
        list.value = result
      } else {
        list.value = list.value.concat(result)
      }
      // 数据全部加载完成
      if (result.length < params.value.pageSize) {
        finished.value = true
      }
    })
  }
  // 模拟订单数据

  const pageInit = () => {}

  pageInit()

  const goBack = () => {
    router.back()
  }

  const handleCancelOrder = order => {
    cancelOrderStatus(order.id).then(() => {
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
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
    }
  }
</style>
