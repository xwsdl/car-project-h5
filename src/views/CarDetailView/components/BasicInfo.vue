<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-10 15:11:19
 * @FilePath: \car-project-h5\src\views\CarDetailView\components\BasicInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-28 12:34:42
 * @FilePath: \car-project-h5\src\views\CarDetailView\components\BasicInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="basic-info">
    <h1 class="car-title">
      {{ `${car.brand} ${car.vehicleSeries}` }}
      <span
        style="margin-left: 10px"
        v-clipboard:copy="car.id"
        v-clipboard:success="onCopySuccess"
        v-clipboard:error="onCopyError"
      >
        {{ car.id }}
      </span>
    </h1>
    <div class="car-subtitle">{{ car.carModel }}</div>
    <div class="car-subtitle">{{ car.color }}</div>
    <div class="car-meta">
      <div>{{ $t('detail.publishTime') }}: {{ car.publishTimeStr }}</div>
      <div>{{ $t('detail.updateTime') }}: {{ car.updatetimeStr }}</div>
    </div>
  </div>
</template>

<script setup>
  import { showToast } from 'vant'
  import { useI18n } from 'vue-i18n'
  const { t: $t } = useI18n()
  defineProps({
    car: {
      type: Object,
      required: true,
      default: () => ({
        brand: '',
        vehicleSeries: '',
        carModel: '',
        color: '',
        publishTimeStr: '',
        updatetimeStr: ''
      })
    }
  })

  function onCopySuccess() {
    showToast($t('common.copySuccess'))
  }
  function onCopyError() {
    showToast($t('common.copyFail'))
  }
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
