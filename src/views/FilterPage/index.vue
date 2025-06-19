<template>
  <div>
    <div class="filter-page__header">高级筛选</div>
    <div class="filter-page__container">
      <div class="filter-page__sidebar">
        <div
          v-for="item in navList"
          :key="item.key"
          :class="[
            'filter-page__sidebar-item',
            { 'filter-page__sidebar-item--active': activeNav === item.key },
          ]"
          @click="activeNav = item.key"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="filter-page__content">
        <component :is="navMap[activeNav]" />
      </div>
      <div class="filter-page__footer">
        <div class="filter-page__footer-inner">
          <van-button block plain @click="onReset">重置</van-button>
          <van-button block type="primary" @click="onConfirm">确定</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 右侧内容的占位组件
const Placeholder = {
  template: '<div style="padding:32px 0;text-align:center;color:#bbb;">此处为{{label}}内容</div>',
  props: ['label'],
}
const navList = [
  { key: 'hot', label: '热门筛选' },
  { key: 'type', label: '车辆类型' },
  { key: 'price', label: '价格' },
  { key: 'year', label: '上牌年份' },
  { key: 'age', label: '车龄' },
  { key: 'displacement', label: '排量' },
  { key: 'mileage', label: '里程' },
  { key: 'color', label: '车身颜色' },
  { key: 'country', label: '国别' },
  { key: 'gearbox', label: '变速箱' },
  { key: 'factory', label: '厂家类型' },
  { key: 'seat', label: '座位数量' },
  { key: 'emission', label: '排放标准' },
  { key: 'energy', label: '能源类型' },
  { key: 'drive', label: '驱动方式' },
  { key: 'structure', label: '车身结构' },
  { key: 'tag', label: '车源标签' },
]
const activeNav = ref(navList[0].key)
const navMap = {}
navList.forEach((item) => {
  navMap[item.key] = {
    ...Placeholder,
    props: { label: item.label },
  }
})
function onReset() {
  // TODO: 重置逻辑
}
function onConfirm() {
  // TODO: 确定逻辑
}
</script>

<style lang="scss" scoped>
$header-height: 46px;
$footer-height: 56px;

@media (max-width: 600px) {
  $header-height: 40px;
  $footer-height: 56px;
}

.filter-page {
  &__header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: $header-height;
    line-height: $header-height;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    background: #fff;
    color: #333;
    border-bottom: 1px solid #eee;
    z-index: 100;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  }
  &__container {
    display: flex;
    height: calc(100vh - #{$header-height});
    flex-direction: row;
    background: #f7f8fa;
    margin-top: $header-height;
    min-width: 320px;
    overflow: hidden;
  }
  &__sidebar {
    width: 130px;
    background: #f5f6fa;
    flex-shrink: 0;
    padding-top: 16px;
    height: calc(100vh - #{$header-height} - #{$footer-height});
    position: fixed;
    left: 0;
    top: $header-height;
    overflow-y: auto;
    border-right: 1px solid #eee;
    z-index: 10;
    box-sizing: border-box;
    &-item {
      padding: 12px 8px;
      text-align: left;
      color: #666;
      cursor: pointer;
      font-size: 18px;
      border-left: 3px solid transparent;
      transition: background 0.2s, color 0.2s;
      user-select: none;
      display: block;
      height: auto;
      margin: 0;
      align-items: unset;
      justify-content: unset;
      white-space: normal;
      &--active {
        background: #fff;
        color: #ff9800;
        border-left: 3px solid #ff9800;
        box-shadow: 0 2px 8px rgba(255, 184, 0, 0.04);
      }
    }
  }
  &__content {
    margin-left: 130px;
    flex: 1;
    height: calc(100vh - #{$header-height} - #{$footer-height});
    overflow-y: auto;
    padding: 16px 16px 80px 16px;
    background: #fff;
    box-sizing: border-box;
  }
  &__footer {
    position: fixed;
    left: 0;
    right: 0;
    width: 100vw;
    bottom: 0;
    height: auto;
    display: flex;
    justify-content: center;
    padding: 8px 0;
    background: #fff;
    box-shadow: 0 -2px 8px #f0f1f2;
    z-index: 20;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    .filter-page__footer-inner {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 400px;
      padding: 0 16px;
    }
    > .van-button {
      flex: 1;
      border-radius: 0;
      height: 36px;
      font-size: 15px;
      margin: 0 8px;
      width: auto;
    }
    > .van-button:not(:last-child) {
      margin-right: 0;
    }
  }
}

@media (max-width: 600px) {
  .filter-page {
    &__header {
      font-size: 17px;
    }
    &__sidebar {
      width: 90px;
      padding-top: 8px;
      height: calc(100vh - #{$header-height} - #{$footer-height});
      &-item {
        font-size: 15px;
        padding: 10px 4px;
      }
    }
    &__content {
      margin-left: 90px;
      padding: 8px 8px 70px 8px;
      height: calc(100vh - #{$header-height} - #{$footer-height});
    }
    &__footer {
      left: 0;
      width: 100vw;
      gap: 8px;
      padding: 6px 0;
      > .van-button {
        height: 32px;
        font-size: 14px;
        margin: 0 6px;
      }
    }
  }
}
</style> 