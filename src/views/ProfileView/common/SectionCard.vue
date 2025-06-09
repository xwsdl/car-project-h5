<template>
  <div class="section-card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// 这是一个通用卡片组件，没有特定逻辑
</script>

<style lang="scss" scoped>
.section-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  
  .card-header {
    margin-bottom: 15px;
  }
}
</style>