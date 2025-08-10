<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-19 21:51:39
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-30 17:29:59
 * @FilePath: \car-project-h5\src\components\CarFilter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-dropdown-menu class="home-filter">
    <van-dropdown-item v-model="sortValue" :options="sortOptions" @change="onSortChange">
      <template #title>
        <span :class="{ 'dropdown-title--active': isSortActive }">
          {{ $t('carFilter.sort') }}
        </span>
      </template>
    </van-dropdown-item>
    <van-dropdown-item title-class="no-arrow" disabled>
      <template #title>
        <div
          class="filter-action"
          :style="{ color: isBrandActive ? '#1989fa' : '#323233' }"
          @click="goBrandPage"
        >
          {{ $t('carFilter.brand') }}
        </div>
      </template>
    </van-dropdown-item>
    <van-dropdown-item ref="itemRef">
      <template #title>
        <span :class="{ 'dropdown-title--active': isPriceActive }">
          {{ $t('carFilter.price') }}
        </span>
      </template>
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
              <span
                v-for="mark in priceMarks"
                :key="mark"
                style="width: 12%; text-align: center; display: inline-block"
              >
                {{ mark === 999 ? $t('carFilter.unlimited') : mark }}
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
              :placeholder="$t('carFilter.minPrice')"
              :suffix="$t('carFilter.tenThousand')"
            />
            <span style="margin: 0 8px">-</span>
            <van-field
              v-model="maxPrice"
              type="number"
              :placeholder="$t('carFilter.maxPrice')"
              :suffix="$t('carFilter.tenThousand')"
            />
          </div>
          <!-- 确定按钮 -->
          <van-button type="primary" block @click="onPriceConfirm">
            {{ $t('carFilter.confirm') }}
          </van-button>
        </div>
      </template>
    </van-dropdown-item>
    <van-dropdown-item title-class="no-arrow" disabled>
      <template #title>
        <div
          class="filter-action"
          :style="{ color: isFilterActive ? '#1989fa' : '#323233' }"
          @click="goFilterPage"
        >
          {{ $t('carFilter.filter') }}
          <van-icon name="filter-o" />
        </div>
      </template>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useFilterStore } from '@/stores/filter'
  const filterStore = useFilterStore()
  const { t } = useI18n()
  const props = defineProps({
    sort: Number,
    brand: Number,
    price: Number,
    filter: Number
  })
  const emit = defineEmits([
    'update:sort',
    'update:brand',
    'update:price',
    'update:filter',
    'sort-change',
    'brand-change',
    'price-change'
  ])
  const router = useRouter()

  const sortValue = ref(props.sort ?? 0)
  const priceValue = ref(props.price ?? 0)
  const filterValue = ref(props.filter ?? 0)

  const sortOptions = computed(() => [
    { text: t('carFilter.defaultSort'), value: 0 },
    { text: t('carFilter.lowestPrice'), value: 1 },
    { text: t('carFilter.highestPrice'), value: 2 },
    { text: t('carFilter.latestYear'), value: 3 }
  ])
  // 价格区间 1:0-100卢布 2:100-200卢布 2:200-3003:00-400 4:400-500 5:500以上
  const itemRef = ref(null)
  const priceOptions = computed(() => [
    { text: t('carFilter.unlimited'), value: 0 },
    { text: t('carFilter.price0_10'), value: 1 },
    { text: t('carFilter.price10_20'), value: 2 },
    { text: t('carFilter.price20_30'), value: 3 },
    { text: t('carFilter.price30_40'), value: 4 },
    { text: t('carFilter.price40_50'), value: 5 },
    { text: t('carFilter.price50_up'), value: 6 }
  ])
  // 价格刻度点，999代表不限
  const priceMarks = [0, 10, 20, 30, 40, 50, 999]
  const customPriceIndex = ref([0, priceMarks.length - 1])
  const minPrice = ref('')
  const maxPrice = ref('')

  const priceRanges = [
    [0, 999], // 不限
    [0, 10], // 0-10万
    [10, 20], // 10-20万
    [20, 30], // 20-30万
    [30, 40], // 30-40万
    [40, 50], // 40-50万
    [50, 999] // 50万以上
  ]

  function onSortChange(val) {
    emit('update:sort', val)
    emit('sort-change', val)
  }

  // 优先级1：输入框输入
  watch([minPrice, maxPrice], ([min, max]) => {
    if (min !== '' || max !== '') {
      const minNum = min === '' ? 0 : Number(min)
      const maxNum = max === '' ? 999 : Number(max)
      const idx = priceRanges.findIndex(([start, end]) => start === minNum && end === maxNum)
      if (idx !== -1) {
        priceValue.value = idx
        customPriceIndex.value = [priceMarks.indexOf(minNum), priceMarks.indexOf(maxNum)]
      } else {
        priceValue.value = -1 // -1表示自定义
        // 滑块同步到输入框区间
        let minIdx = priceMarks.findIndex(v => v === minNum)
        let maxIdx = priceMarks.findIndex(v => v === maxNum)
        if (minIdx === -1) minIdx = 0
        if (maxIdx === -1) maxIdx = priceMarks.length - 1
        customPriceIndex.value = [minIdx, maxIdx]
      }
    } else {
      // 输入框都为空时，恢复按钮/滑块联动
      if (priceValue.value >= 0 && priceValue.value < priceRanges.length) {
        const [min, max] = priceRanges[priceValue.value]
        minPrice.value = min === 0 ? '' : min
        maxPrice.value = max === 999 ? '' : max
        customPriceIndex.value = [priceMarks.indexOf(min), priceMarks.indexOf(max)]
      }
    }
  })

  // 优先级2：滑块
  watch(customPriceIndex, val => {
    // 只有输入框为空时才响应滑块
    if (val) {
      const [minIdx, maxIdx] = val
      const min = priceMarks[minIdx]
      const max = priceMarks[maxIdx]
      // 查找是否有对应的 priceOptions
      const idx = priceRanges.findIndex(([start, end]) => start === min && end === max)
      if (idx !== -1) {
        priceValue.value = idx
      } else {
        priceValue.value = -1 // -1表示自定义
      }
      // 同步输入框
      minPrice.value = min === 0 ? '' : min
      maxPrice.value = max === 999 ? '' : max
    }
  })

  // 优先级3：按钮
  function onPriceBtnClick(val) {
    // 按钮优先级最低，点击时清空输入框并同步滑块
    priceValue.value = val
    minPrice.value = ''
    maxPrice.value = ''
    if (val >= 0 && val < priceRanges.length) {
      const [min, max] = priceRanges[val]
      customPriceIndex.value = [priceMarks.indexOf(min), priceMarks.indexOf(max)]
    }
  }

  // 确定按钮逻辑，优先读取输入框，其次滑块，最后按钮
  function onPriceConfirm() {
    let emitValue = 0
    let minNum = minPrice.value === '' ? 0 : Number(minPrice.value)
    let maxNum = maxPrice.value === '' ? 999 : Number(maxPrice.value)
    // 判断输入框或滑块区间是否等于预设区间
    const idx = priceRanges.findIndex(([start, end]) => start === minNum && end === maxNum)
    if (idx !== -1) {
      emitValue = idx
    } else {
      emitValue = 0 // 或 -1，表示不限或自定义
    }
    emit('update:price', emitValue)
    emit('price-change', emitValue)
    itemRef.value && itemRef.value.toggle()
  }

  function goBrandPage() {
    router.push('/brand')
  }
  function goFilterPage() {
    router.push('/filterPage')
  }

  watch(
    () => props.sort,
    v => (sortValue.value = v)
  )
  watch(
    () => props.price,
    v => (priceValue.value = v)
  )
  watch(
    () => props.filter,
    v => (filterValue.value = v)
  )

  // 高亮逻辑
  const isSortActive = computed(
    () => sortValue.value !== 0 && sortValue.value !== undefined && sortValue.value !== null
  )
  const isBrandActive = computed(() => !!filterStore.filter.brand)
  const isPriceActive = computed(
    () => priceValue.value !== 0 && priceValue.value !== undefined && priceValue.value !== null
  )
  // carType: null, // 车辆类型
  //   carBegin: 0, // 车龄起始
  //   carEnd: 11, // 车龄结束
  //   displacement: 0.0, // 排量
  //   color: null, // 颜色
  //   emissionStandard: null, // 排放标准
  //   energyType: null // 能源类型
  const isFilterActive = computed(
    () =>
      !!filterStore.filter.carType ||
      !!filterStore.filter.carBegin ||
      !!filterStore.filter.carEnd ||
      !!filterStore.filter.displacement ||
      !!filterStore.filter.emissionStandard ||
      !!filterStore.filter.color ||
      !!filterStore.filter.energyType
  )
</script>

<style scoped>
  .home-filter {
    margin: 0 0 0 0;
  }

  .price-filter-panel {
    padding: 12px 8px 16px 8px;
    max-height: 420px;
    box-sizing: border-box;
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: scroll;
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
  /* 只隐藏品牌和筛选按钮的小三角图标 */
  .filter-action {
    color: #323233;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    line-height: 22px;
    transition: color 0.2s;
  }
  .filter-action:active {
    color: #1989fa;
  }
  .dropdown-title--active {
    color: #1989fa !important;
  }
</style>
<style>
  .van-dropdown-menu__title.no-arrow::after {
    display: none !important;
    opacity: 0 !important;
  }
</style>
::v-deep .van-dropdown-menu__title.dropdown-title--active { color: #1989fa !important; }
