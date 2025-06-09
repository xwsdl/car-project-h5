<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:39:38
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-06 21:46:44
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\PurchaseProcess.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="purchase-process">
    <h2 class="section-title">{{ $t('detail.purchaseProcess') }}</h2>
    <div class="process-steps">
      <div v-for="step in steps" :key="step.index" class="step-item">
        <div class="step-icon">{{ step.index }}</div>
        <div class="step-title">{{ $t(`detail.${step.titleKey}`) }}</div>
        <div class="step-desc">{{ $t(`detail.${step.descKey}`) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.purchase-process {
  padding: 20px 15px;
  background: #fff;
  border-bottom: 10px solid #f5f7fa;

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #1a365d;
  }

  .process-steps {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Opera
    }
  }

  .step-item {
    min-width: 100px;
    text-align: center;
    padding: 0 15px;
    position: relative;
  }

  .step-icon {
    width: 50px;
    height: 50px;
    background: #f0f7ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    color: #3498db;
    font-size: 20px;
    font-weight: bold;
  }

  .step-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .step-desc {
    font-size: 12px;
    color: #999;
  }
}
</style>