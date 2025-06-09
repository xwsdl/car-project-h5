<template>
  <div class="basic-info">
    <div class="car-tag">{{ car.carNature }}</div>
    <h1 class="car-title">{{ car.modelName }}</h1>
    <div class="car-subtitle">{{ car.emissionStandard }}</div>
    <div class="car-title">{{ car.color }}</div>
    <div class="car-meta">
      <div>Published Time: {{ car.firstRegTime }}</div>
      <div>Update Time: {{ car.displacement }} ©{{ car.licensePlate }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  car: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.basic-info {
  padding: 20px 15px;
  background: #fff;
  border-bottom: 10px solid #f5f7fa;
  
  .car-tag {
    display: inline-block;
    background: #f0f7ff;
    color: #3498db;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;
    margin-bottom: 10px;
  }
  
  .car-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #1a365d;
  }
  
  .car-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
  }
  
  .car-meta {
    margin-top: 15px;
    font-size: 14px;
    color: #999;
  }
}

@media (max-width: 480px) {
  .basic-info {
    .car-title {
      font-size: 18px;
    }
  }
}
</style>