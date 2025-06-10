<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-09 09:14:40
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-10 09:10:56
 * @FilePath: \car-h5-project\src\views\Layout\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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

const tabbarRoutePath = ['/home', '/shoppingCart', '/profile']
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