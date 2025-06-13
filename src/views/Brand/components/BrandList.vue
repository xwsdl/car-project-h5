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
    <div v-for="group in brandGroups" :key="group.letter" class="brand-group" :data-letter="group.letter">
      <div class="brand-group__header">{{ group.letter }}</div>
      <div class="brand-group__content">
        <div
          v-for="brand in group.brands"
          :key="brand.id"
          class="brand-item"
          @click="$emit('select', brand)"
        >
          <div class="brand-item__logo">
            <img :src="brand.logo" :alt="brand.name" />
          </div>
          <div class="brand-item__name">{{ brand.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  brandGroups: {
    type: Array,
    required: true
  }
})

defineEmits(['select'])
</script>

<style lang="scss" scoped>
.brand-list {
  .brand-group {
    &__header {
      padding: 8px 16px;
      background-color: #f5f5f5;
      font-size: 14px;
      color: #666;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    &__content {
      background: #fff;
    }
  }

  .brand-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;

    &:active {
      background-color: #f5f5f5;
    }

    &__logo {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    &__name {
      font-size: 15px;
      color: #333;
      flex: 1;
    }
  }
}
</style>
