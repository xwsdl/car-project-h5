<template>
  <div class="layout">
    <router-view />
    <Tabbar v-if="isShowTabbar" />
  </div>
</template>

<script setup>
import Tabbar from '@/components/Tabbar/index.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const tabbarRoutePath = ['/home', '/orderProcess', '/message', '/profile']
const route = useRoute()

const isShowTabbar = computed(() => {
  return tabbarRoutePath.includes(route.path)
})
console.log('当前路由:', route.path)
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 8px 8px 0;
}
</style>
