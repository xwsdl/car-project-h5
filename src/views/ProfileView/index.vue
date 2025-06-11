<template>
  <div class="profile-view">
    <ProfileHeader />
    <div class="content-container">
      <OrdersSection />
      <ServicesSection />
    </div>
  </div>
</template>

<script setup>
import ProfileHeader from './components/ProfileHeader.vue'
import OrdersSection from './components/OrdersSection.vue'
import ServicesSection from './components/ServicesSection.vue'
</script>

<style lang="scss" scoped>
.profile-view {
  background-color: #f5f7fa;
  min-height: 95vh;
  padding-bottom: 70px; /* 为底部菜单留出空间 */
  box-sizing: border-box;
}

.content-container {
  padding: 0 15px;
  max-width: 480px;
  margin: 0 auto;
}
</style>