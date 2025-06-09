<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:38:52
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-06 21:48:49
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\PriceInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="price-info">
    <div class="current-price">{{ currentPrice }}{{ $t('home.tenThousand') }}</div>
    <div class="original-price">{{ originalPrice }}{{ $t('home.tenThousand') }}</div>
    <div class="more-info">
      <span>{{ $t('detail.detail') }}</span>
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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