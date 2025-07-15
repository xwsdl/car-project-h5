<template>
  <div class="car-card" @click="viewCarDetail">
    <div class="car-image-container">
      <van-image
        class="car-image"
        fit="cover"
        :src="car.mainImageUrl"
        width="100%"
        height="200"
        lazy-load
        :alt="$t('carDetail.swiper.carImage')"
      />
      <div class="car-tag" v-if="car.carNature">{{ car.carNature }}</div>
    </div>

    <div class="car-info">
      <h2 class="car-title">{{ `${car.brand} ${car.vehicleSeries}` }}</h2>
      <p class="car-subtitle">{{ car.carModel }}</p>
      <div class="car-meta">
        <van-icon name="clock-o" size="14" />
        <span>{{ car.firstRegTimeStr }}</span>
        <van-icon name="location-o" size="14" />
        <span>{{ car.displacement }}</span>
      </div>

      <div class="car-price">
        <PriceDisplay :price="car.ruble" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import PriceDisplay from '@/components/PriceDisplay/index.vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const router = useRouter()

  const { t: $t } = useI18n()

  const props = defineProps({
    car: {
      type: Object,
      required: true,
      default: () => ({})
    }
  })

  const viewCarDetail = () => {
    router.push(`/car?id=${props.car.id}`)
    // 实际项目中：
  }
</script>

<style lang="scss" scoped>
  .car-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .car-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;

      .car-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      &:hover .car-image {
        transform: scale(1.05);
      }

      .car-tag {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(231, 76, 60, 0.9);
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .car-info {
      padding: 20px;

      .car-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #1a365d;
      }

      .car-subtitle {
        font-size: 16px;
        color: #666;
        margin-bottom: 12px;
      }

      .car-meta {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #999;
        margin: 15px 0;

        span {
          margin-right: 15px;
          margin-left: 4px;
        }
      }

      .car-price {
        font-size: 22px;
        font-weight: bold;
        color: #e74c3c;
        margin-top: 10px;
      }
    }
  }

  @media (max-width: 480px) {
    .car-card {
      .car-title {
        font-size: 16px;
      }

      .car-subtitle {
        font-size: 14px;
      }

      .car-price {
        font-size: 20px;
      }

      .car-image-container {
        height: 180px;
      }
    }
  }
</style>
