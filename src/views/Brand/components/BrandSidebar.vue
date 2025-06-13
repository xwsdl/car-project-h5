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
    <div
      v-for="letter in letters"
      :key="letter"
      class="brand-sidebar__item"
      :class="{ 'brand-sidebar__item--active': activeLetter === letter }"
      @click="handleClick(letter)"
    >
      {{ letter }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  letters: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])
const activeLetter = ref('')

function handleClick(letter) {
  activeLetter.value = letter
  emit('select', letter)
  // 300ms后清除激活状态
  setTimeout(() => {
    activeLetter.value = ''
  }, 300)
}
</script>

<style lang="scss" scoped>
.brand-sidebar {
  position: fixed;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 8px 4px;
  z-index: 100;

  &__item {
    color: #fff;
    font-size: 12px;
    padding: 4px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 12px;

    &:hover {
      color: #1890ff;
      background: rgba(255, 255, 255, 0.1);
    }

    &--active {
      color: #1890ff;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
