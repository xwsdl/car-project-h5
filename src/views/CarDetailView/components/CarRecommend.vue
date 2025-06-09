<template>
  <div class="car-recommend">
    <h2 class="section-title">{{ $t('detail.suggest') }}</h2>
    <div class="recommend-list">
      <div v-for="(car, index) in cars" :key="index" class="recommend-item">
        <img :src="car.image" class="recommend-img" :alt="$t('detail.recommend')" />
        <div class="recommend-info">
          <h3 class="recommend-title">{{ car.title }}</h3>
          <div class="recommend-subtitle">{{ car.subtitle }}</div>
          <div class="car-meta">{{ car.date }} ©{{ car.location }}</div>
          <div class="recommend-tag">{{ car.tag }}</div>
          <div class="recommend-price">{{ car.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cars: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.car-recommend {
  padding: 20px 15px;
  background: #fff;

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #1a365d;
  }

  .recommend-list {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding: 10px 0;
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Opera
    }
  }

  .recommend-item {
    min-width: 200px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }

  .recommend-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }

  .recommend-info {
    padding: 12px;
  }

  .recommend-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #1a365d;
  }

  .recommend-subtitle {
    font-size: 14px;
    color: #666;
  }

  .car-meta {
    font-size: 12px;
    color: #999;
    margin: 5px 0;
  }

  .recommend-tag {
    display: inline-block;
    background: #f8f9fa;
    color: #666;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .recommend-price {
    font-size: 18px;
    font-weight: bold;
    color: #e74c3c;
    margin: 10px 0;
  }
}
</style>