<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-08-07 23:47:50
 * @FilePath: \car-project-h5\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <RouterView />
</template>

<script setup>
  import { onMounted, watch } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useWebSocketStore } from '@/stores/websocket'
  import { online, checkToken } from '@/api'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const authStore = useAuthStore()
  const wsStore = useWebSocketStore()

  const checkTokenValidity = async token => {
    if (!token) return false
    checkToken()
      .then(res => {})
      .catch(err => {
        authStore.logout()
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      })
  }
  console.log('authStore.token.value', authStore.token)
  // 检测用户Token 是否有效
  checkTokenValidity(authStore.token)

  // WebSocket 连接地址
  const wsUrl = 'ws://8.211.38.230:8084/ws/chat?token='

  // 初始化 WebSocket 连接（如果用户已登录）
  const initWebSocketIfAuthenticated = () => {
    if (authStore.isAuthenticated && authStore.token) {
      console.log('页面刷新后检测到用户已登录，重新连接 WebSocket')
      wsStore.initWebSocket(wsUrl + authStore.token)
    }
  }

  // 监听登录状态变化
  watch(
    () => authStore.isAuthenticated,
    async isAuthenticated => {
      if (isAuthenticated && authStore.token) {
        wsStore.initWebSocket(wsUrl + authStore.token)

        // 判断当前登录账户是否为客服(调用客服上线接口)
        if (authStore.user.roleName === 'customer_service') {
          online()
        }
      } else {
        console.log('用户未登录，断开 WebSocket 连接')
        wsStore.closeWebSocket()
      }
    },
    { immediate: true } // 立即执行一次，处理页面刷新后的状态
  )

  // 页面加载时检查登录状态
  onMounted(() => {
    initWebSocketIfAuthenticated()
  })
</script>
