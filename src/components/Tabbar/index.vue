<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-10 16:53:35
 * @FilePath: \car-project-h5\src\components\Tabbar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item name="home" icon="wap-home">{{ $t('common.home') }}</van-tabbar-item>
    <van-tabbar-item v-permission="'route.orderProcess'" name="orderProcess" icon="orders-o">
      {{ $t('common.orderProcess') }}
    </van-tabbar-item>
    <van-tabbar-item v-permission="'route.pending_orders'" name="pendingOrders" icon="orders-o">
      {{ $t('common.pending_orders') }}
    </van-tabbar-item>
    <van-tabbar-item v-permission="'route.message'" name="message" icon="chat-o">
      <van-badge :content="unreadCount" max="99" :show-zero="false" :offset="[0, -25]">
        {{ $t('common.message') }}
      </van-badge>
    </van-tabbar-item>
    <van-tabbar-item v-permission="'route.profile'" name="profile" icon="user">
      {{ $t('common.personalCenter') }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getUnreadCount } from '@/api'
  import { useWebSocketStore } from '@/stores/websocket'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const wsStore = useWebSocketStore()
  // 定义组件名称
  defineOptions({
    name: 'AppTabbar'
  })

  const router = useRouter()
  const active = ref('home')
  const unreadCount = ref(0)

  // 根据路由路径设置默认选中项
  onMounted(async () => {
    const path = router.currentRoute.value.path
    const pathSegments = path.split('/')
    const currentPath = pathSegments[1] || 'home'

    // 映射路径到tabbar项
    const pathMap = {
      home: 'home',
      orderProcess: 'orderProcess',
      message: 'message',
      profile: 'profile',
      pendingOrders: 'pendingOrders'
    }

    active.value = pathMap[currentPath] || 'home'

    if (authStore.token) {
      unreadCount.value = await getUnreadCount()
    }

    // 订阅websocket响应回来的消息(更新对话列表)
    const unsubscribe = wsStore.onMessage(async message => {
      if (message.type === 'SEND_MESSAGE_RECEIVED') {
        unreadCount.value = await getUnreadCount()
      }
    })

    // 组件卸载时取消订阅
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })
  })

  const onChange = name => {
    router.push(`/${name}`)
  }
</script>

<style lang="scss">
  /* 深度选择器，兼容 Vant 3.x */
  :deep(.van-tabbar-item) {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    // 统一高度，防止因换行高度不齐
    height: 56px !important; // 可根据实际调整
    box-sizing: border-box;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  :deep(.van-tabbar-item__content) {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    display: flex !important;
    height: 100% !important;
    min-width: 0 !important;
  }

  :deep(.van-tabbar-item__icon) {
    margin-bottom: 2px !important;
    min-width: 0 !important;
  }

  :deep(.van-tabbar-item__text) {
    white-space: normal !important;
    text-align: center !important;
    word-break: break-all !important;
    line-height: 1.2 !important;
    font-size: 12px !important;
    margin-top: 2px !important;
    max-width: 100% !important;
    min-width: 0 !important;
    display: block !important;
    padding: 0 2px !important;
    overflow-wrap: break-word !important;
  }
</style>
