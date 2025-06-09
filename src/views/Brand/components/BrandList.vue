<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-05 22:26:41
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-05 22:34:48
 * @FilePath: \car-h5-project\src\views\Brand\components\BrandList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="brand-list">
    <div v-for="group in brandGroups" :key="group.letter" class="brand-list__group">
      <div class="brand-list__letter">{{ group.letter }}</div>
      <div class="brand-list__items">
        <div v-for="brand in group.brands" :key="brand.id" class="brand-list__item" @click="select(brand)">
          <img :src="brand.logo" :alt="brand.name" class="brand-list__logo" />
          <span class="brand-list__name">{{ brand.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  brandGroups: {
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
.brand-list {
  &__group {
    margin-bottom: 16px;
  }
  &__letter {
    font-size: 14px;
    color: #999;
    background: #f7f8fa;
    padding: 4px 12px;
    margin-bottom: 8px;
  }
  &__items {
    display: block;
    padding: 0 8px;
  }
  &__item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
    }
  }
  &__logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 12px;
  }
  &__name {
    font-size: 15px;
    color: #333;
  }
}
</style>
