<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:38:32
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-06 22:47:44
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\CarSwiper.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="car-swiper">
    <van-swipe :autoplay="3000" :show-indicators="false" @change="onSwipeChange">
      <van-swipe-item
        v-for="(image, index) in images"
        :key="index"
        @click="() => handleView(images, index)"
      >
        <img :src="image" class="swiper-img" :alt="t('carDetail.swiper.carImage')" />
      </van-swipe-item>
    </van-swipe>

    <div class="swiper-indicator">
      <div
        v-for="(_, index) in images"
        :key="index"
        class="indicator-dot"
        :class="{ active: currentIndex === index }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showImagePreview } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  images: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const currentIndex = ref(0)

const onSwipeChange = (index) => {
  currentIndex.value = index
}

const handleView = (images, index) => {
  showImagePreview({
    images,
    startPosition: index,
    closeable: true,
    title: t('carDetail.swiper.viewImage')
  })
}
</script>

<style lang="scss" scoped>
.car-swiper {
  position: relative;
  height: 280px;
  overflow: hidden;

  .swiper-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-indicator {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;

    .indicator-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      margin: 0 4px;
      transition: all 0.3s;

      &.active {
        background: #fff;
        width: 20px;
        border-radius: 3px;
      }
    }
  }
}

@media (max-width: 480px) {
  .car-swiper {
    height: 240px;
  }
}
</style>