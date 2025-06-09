<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-05 22:26:49
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-05 22:29:24
 * @FilePath: \car-h5-project\src\views\Brand\components\BrandSidebar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="brand-sidebar">
    <div v-for="letter in letters" :key="letter" class="brand-sidebar__item" @click="select(letter)">
      {{ letter }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  letters: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['select'])
function select(letter) {
  emit('select', letter)
}
</script>

<style lang="scss" scoped>
.brand-sidebar {
  position: fixed;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__item {
    padding: 2px 4px;
    font-size: 12px;
    color: #999;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #1989fa;
    }
  }
}
</style>
