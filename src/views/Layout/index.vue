<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-20 20:46:32
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-22 17:21:01
 * @FilePath: \car-project-h5\src\views\Layout\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="layout">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <Tabbar v-if="isShowTabbar" />

    <!-- 开发环境显示缓存管理组件 -->
    <CacheManager v-if="isDev && false" />
  </div>
</template>

<script setup>
  import Tabbar from '@/components/Tabbar/index.vue'
  import CacheManager from '@/components/CacheManager/index.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import router from '@/router'

  // 定义组件名称
  defineOptions({
    name: 'LayoutIndex'
  })

  const route = useRoute()

  // 需要缓存的页面组件名称列表 (注意是组件的 name，需与路由 name 保持一致)
  const cachedViews = computed(() => getCachedViews(router.options.routes))

  // 判断是否为开发环境
  const isDev = computed(() => {
    return import.meta.env.DEV
  })

  // 根据路由路径判断是否显示Tabbar
  const tabbarRoutePath = ['/home', '/orderProcess', '/message', '/profile', '/pendingOrders']
  const isShowTabbar = computed(() => {
    return tabbarRoutePath.includes(route.path)
  })

  /**
   * 递归遍历路由表，收集所有 keepAlive 为 true 的页面组件 name
   * 要求页面组件必须设置 name，且与路由 name 保持一致
   */
  function getCachedViews(routes) {
    let cached = []
    routes.forEach(route => {
      if (route.meta && route.meta.keepAlive && route.name) {
        // 这里直接用 route.name，要求页面组件 name 与路由 name 完全一致
        cached.push(route.name)
      }
      if (route.children) {
        cached = cached.concat(getCachedViews(route.children))
      }
    })
    return cached
  }
</script>

<style lang="scss" scoped>
  .layout {
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding: 8px 8px 0;
  }
</style>
