<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:38:52
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-12 18:58:22
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\PriceInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="price-info">
    <div class="current-price">
      <PriceDisplay :price="currentPrice" />
      <span class="price-info__unit">({{ $t('home.horgosPrice') }})</span>
    </div>
    <div class="original-price" v-if="false">{{ originalPrice }}</div>
    <div class="more-info" v-if="false">
      <span>{{ $t('detail.detail') }}</span>
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<script setup>
  import PriceDisplay from '@/components/PriceDisplay/index.vue'
  defineProps({
    currentPrice: {
      type: String,
      required: true
    },
    originalPrice: {
      type: String,
      required: true
    }
  })
</script>

<style lang="scss" scoped>
  .price-info {
    padding: 20px 15px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    &__unit{
      margin-left: 10px;
      font-size: 16px;
      color: #1a365d;
    }
    .current-price {
      font-size: 24px;
      font-weight: bold;
      color: #e74c3c;
      margin-bottom: 5px;
    }

    .original-price {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-bottom: 15px;
    }

    .more-info {
      color: #3498db;
      font-weight: 500;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
</style>
