<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-20 10:04:41
 * @FilePath: \car-project-h5\src\components\Tabbar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item name="home" icon="wap-home">{{ $t('common.home') }}</van-tabbar-item>
    <van-tabbar-item name="orderProcess" icon="orders-o">{{ $t('common.orderProcess') }}</van-tabbar-item>
    <van-tabbar-item name="message" icon="chat-o">{{ $t('common.message') }}</van-tabbar-item>
    <van-tabbar-item name="profile" icon="user">{{ $t('common.personalCenter') }}</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 定义组件名称
defineOptions({
  name: 'AppTabbar'
})

const router = useRouter()
const active = ref('home')

// 根据路由路径设置默认选中项
onMounted(() => {
  const path = router.currentRoute.value.path
  const pathSegments = path.split('/')
  const currentPath = pathSegments[1] || 'home'

  // 映射路径到tabbar项
  const pathMap = {
    'home': 'home',
    'orderProcess': 'orderProcess',
    'message': 'message',
    'profile': 'profile'
  }

  active.value = pathMap[currentPath] || 'home'
})

const onChange = (name) => {
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
