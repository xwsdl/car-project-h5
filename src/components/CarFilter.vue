<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-19 21:51:39
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-19 22:45:29
 * @FilePath: \car-project-h5\src\components\CarFilter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-dropdown-menu class="home-filter">
    <van-dropdown-item v-model="sortValue" :options="sortOptions" title="排序" @change="onSortChange" />
    <van-dropdown-item>
      <template #title>
        <span @click.stop="goBrandPage">品牌</span>
      </template>
    </van-dropdown-item>
    <van-dropdown-item title="价格">
      <template #default>
        <div class="price-filter-panel">
          <!-- 价格区间按钮 -->
          <div class="price-options">
            <van-button
              v-for="item in priceOptions"
              :key="item.value"
              :type="priceValue === item.value ? 'primary' : 'default'"
              size="small"
              @click="onPriceBtnClick(item.value)"
            >
              {{ item.text }}
            </van-button>
          </div>
          <!-- 自定义价格滑块（使用价格区间按钮的选项作为刻度） -->
          <div class="custom-slider">
            <div class="slider-labels">
              <span v-for="mark in priceMarks" :key="mark" style="width: 12%;text-align:center;display:inline-block;">
                {{ mark === 999 ? '不限' : mark }}
              </span>
            </div>
            <van-slider
              v-model="customPriceIndex"
              range
              :min="0"
              :max="priceMarks.length - 1"
              :step="1"
            />
          </div>
          <!-- 输入框 -->
          <div class="input-row">
            <van-field
              v-model="minPrice"
              type="number"
              placeholder="最小价格"
              suffix="万"
            />
            <span style="margin: 0 8px;">-</span>
            <van-field
              v-model="maxPrice"
              type="number"
              placeholder="最大价格"
              suffix="万"
            />
          </div>
          <!-- 确定按钮 -->
          <van-button type="primary" block @click="onPriceConfirm">确定</van-button>
        </div>
      </template>
    </van-dropdown-item>
    <van-dropdown-item>
      <template #title>
        <span @click.stop="goFilterPage">筛选 <van-icon name="filter-o" /></span>
      </template>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  sort: Number,
  brand: Number,
  price: Number,
  filter: Number,
})
const emit = defineEmits(['update:sort', 'update:brand', 'update:price', 'update:filter', 'sort-change', 'brand-change', 'price-change'])
const router = useRouter()

const sortValue = ref(props.sort ?? 0)
const priceValue = ref(props.price ?? 0)
const filterValue = ref(props.filter ?? 0)

const sortOptions = [
  { text: '默认排序', value: 0 },
  { text: '价格最低', value: 1 },
  { text: '价格最高', value: 2 },
  { text: '最新发布', value: 3 },
  { text: '年限最近', value: 4 },
  { text: '最近降价', value: 5 },
]
const priceOptions = [
  { text: '不限', value: 0 },
  { text: '5万以下', value: 1 },
  { text: '5-10万', value: 2 },
  { text: '10-20万', value: 3 },
  { text: '20万以上', value: 4 },
  { text: '10-15万', value: 5 },
  { text: '15-30万', value: 6 },
  { text: '30-100万', value: 7 },
  { text: '100-200万', value: 8 },
  { text: '200万以上', value: 9 },
]
// 价格刻度点，999代表不限
const priceMarks = [0, 5, 10, 15, 20, 30, 100, 200, 999]
const customPriceIndex = ref([0, priceMarks.length - 1])
const minPrice = ref('')
const maxPrice = ref('')

function onSortChange(val) {
  emit('update:sort', val)
  emit('sort-change', val)
}
function onPriceBtnClick(val) {
  priceValue.value = val
  // 可根据需要同步设置自定义价格
}
function onPriceConfirm() {
  // 处理确定逻辑，比如 emit 事件
  emit('update:price', priceValue.value)
  emit('price-change', priceValue.value)
}
function goBrandPage() {
  router.push('/brand')
}
function goFilterPage() {
  router.push('/filterPage')
}

watch(() => props.sort, v => sortValue.value = v)
watch(() => props.price, v => priceValue.value = v)
watch(() => props.filter, v => filterValue.value = v)
</script>

<style scoped>
.home-filter {
  margin: 10px 0 0 0;
}
.price-filter-panel {
  padding: 12px 8px 16px 8px;
  max-height: 420px;
  min-height: 320px;
  box-sizing: border-box;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
}
.price-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 12px;
}
.custom-slider {
  margin-bottom: 12px;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}
</style>
