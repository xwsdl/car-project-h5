<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-05 22:26:33
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-05 22:49:22
 * @FilePath: \car-h5-project\src\views\Brand\components\BrandHot.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="brand-hot">
    <div class="brand-hot__title">{{ $t('brand.hotBrands') }}</div>
    <van-row gutter="10" class="brand-hot__list">
      <van-col v-for="brand in brands" :key="brand.id" span="6" class="brand-hot__item" @click="select(brand)">
        <img :src="brand.logo" :alt="brand.name" class="brand-hot__logo" />
        <div class="brand-hot__name">{{ brand.name }}</div>
      </van-col>
    </van-row>
  </div>
</template>

<script setup>
defineProps({
  brands: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['select'])
function select(brand) {
  emit('select', brand)
}
</script>

<style lang="scss" scoped>
.brand-hot {
  margin-bottom: 20px;
  &__title {
    font-size: 14px;
    color: #999;
    margin-bottom: 12px;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    text-align: center;
    margin-bottom: 16px;
    cursor: pointer;
  }
  &__logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin-bottom: 4px;
  }
  &__name {
    font-size: 12px;
    color: #333;
  }
}
</style>
