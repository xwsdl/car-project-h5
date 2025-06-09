<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item">
      <van-icon name="home" class="nav-icon" />
      <span>首页</span>
    </router-link>
    <router-link to="/models" class="nav-item">
      <van-icon name="car" class="nav-icon" />
      <span>车型</span>
    </router-link>
    <router-link to="/customer-service" class="nav-item active">
      <van-icon name="chat" class="nav-icon" />
      <span>客服</span>
    </router-link>
    <router-link to="/profile" class="nav-item">
      <van-icon name="user" class="nav-icon" />
      <span>我的</span>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 计算当前路由是否激活
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 10px 0;
  border-top: 1px solid var(--border-color);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--gray-text);
  font-size: 12px;
  padding: 5px 10px;
}

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 3px;
}
</style>