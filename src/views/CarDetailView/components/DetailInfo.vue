<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-22 11:24:29
 * @FilePath: \car-project-h5\src\views\CarDetailView\components\DetailInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="detail-info">
    <div class="header">
      <h2 class="section-title">{{ $t('detail.vehicleInfoTitle') }}</h2>
      <a v-if="false" href="#" class="more-link">{{ $t('detail.seeMoreParams') }}</a>
    </div>
    <ul class="detail-grid">
      <li v-for="(detail, index) in details" :key="index" class="detail-item">
        <div class="detail-label">{{ detail.label }}</div>
        <div class="detail-value">{{ detail.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
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
  box-sizing: border-box;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .more-link {
      font-size: 14px;
      color: #999;
      text-decoration: none;
    }
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #1a365d;
    position: relative;
    /* padding-left: 10px; */
    margin-bottom: 0;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
  }

  .detail-item {
    padding: 15px 10px;
    text-align: center;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;

    .detail-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .detail-value {
      color: #333;
      font-weight: bold;
      font-size: 15px;
      word-break: break-all;
    }
  }
}
</style>
