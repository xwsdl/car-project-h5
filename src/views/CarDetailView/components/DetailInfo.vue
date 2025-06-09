<template>
  <div class="detail-info">
    <h2 class="section-title">Information</h2>
    <ul class="detail-list">
      <li v-for="(detail, index) in details" :key="index" class="detail-item">
        <div class="detail-label">{{ detail.label }}</div>
        <div class="detail-value">{{ detail.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  details: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.detail-info {
  padding: 20px 15px;
  background: #fff;
  border-bottom: 10px solid #f5f7fa;
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #1a365d;
  }
  
  .detail-list {
    list-style: none;
  }
  
  .detail-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .detail-label {
    width: 100px;
    color: #666;
    font-weight: 500;
  }
  
  .detail-value {
    flex: 1;
    color: #333;
  }
}
</style>