<template>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item name="home" icon="wap-home">{{ $t('common.home') }}</van-tabbar-item>
    <!-- <van-tabbar-item name="records" icon="records">标签</van-tabbar-item>
    <van-tabbar-item name="setting" icon="setting">标签</van-tabbar-item> -->
    <van-tabbar-item name="shoppingCart" icon="cart">{{
      $t('common.shoppingCart')
    }}</van-tabbar-item>
    <van-tabbar-item name="profile" icon="user">{{ $t('common.personalCenter') }}</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const active = ref('home')

// 根据路由路径设置默认选中项
onMounted(() => {
  const path = router.currentRoute.value.path
  active.value = path.split('/')[1] || 'home'
})

const onChange = (name) => {
  router.push(`/${name}`)
}
</script>

<style>
</style>