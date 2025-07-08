<template>
  <div class="car-recommend">
    <h2 class="section-title">{{ $t('detail.suggest') }}</h2>
    <div class="recommend-list">
      <div v-for="(car, index) in cars" :key="index" class="recommend-item">
        <div class="recommend-img-container">
          <img :src="car.mainImageUrl" class="recommend-img" :alt="$t('carDetail.swiper.carImage')" />
          <div class="recommend-tag" v-if="car.carNature">{{ car.carNature }}</div>
        </div>
        <div class="recommend-info">
          <h3 class="recommend-title">{{ `${car.brand} ${car.vehicleSeries}` }}</h3>
          <div class="recommend-subtitle">{{ car.carModel }}</div>
          <div class="car-meta">
            <van-icon name="clock-o" size="14" />
            <span>{{ car.firstRegTimeStr }}</span>
            <van-icon name="location-o" size="14" style="margin-left:8px;" />
            <span>{{ car.displacement }}</span>
          </div>
          <div class="recommend-price">{{ car.ruble }}{{ $t('home.tenThousand') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
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

  .recommend-img-container {
    position: relative;
    height: 120px;
    overflow: hidden;
    .recommend-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .recommend-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      padding: 3px 10px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: bold;
    }
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
    margin-bottom: 8px;
  }

  .car-meta {
    font-size: 12px;
    color: #999;
    margin: 5px 0;
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }

  .recommend-price {
    font-size: 18px;
    font-weight: bold;
    color: #e74c3c;
    margin: 10px 0 0 0;
  }
}
</style>
