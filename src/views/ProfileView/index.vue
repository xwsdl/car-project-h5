<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-08 14:49:18
 * @FilePath: \car-project-h5\src\views\ProfileView\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="profile-view">
    <ProfileHeader />
    <div class="content-container">
      <ServicesSection />
    </div>
  </div>
</template>

<script setup>
  import ProfileHeader from './components/ProfileHeader.vue'
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
