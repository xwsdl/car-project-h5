<template>
  <div class="filter-page">
    <div class="filter-page__header">{{ t('filterPage.title') }}</div>
    <div class="filter-page__container">
      <div class="filter-page__sidebar">
        <div
          v-for="item in navList"
          :key="item.key"
          :class="[
            'filter-page__sidebar-item',
            { 'filter-page__sidebar-item--active': activeNav === item.key }
          ]"
          @click="scrollTo(item.key)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="filter-page__content" ref="contentRef" @scroll="handleScroll">
        <!-- 车辆类型 -->
        <div id="type" class="filter-section" v-if="false">
          <h3 class="filter-section__title">{{ t('filterPage.vehicleType') }}</h3>
          <div class="option-grid">
            <van-button
              v-for="item in vehicleTypes"
              :key="item.value"
              :type="filterData.carType === item.value ? 'primary' : 'default'"
              @click="filterData.carType = item.value"
            >
              {{ item.label }}
            </van-button>
          </div>
        </div>

        <!-- 自定义车龄 -->
        <div id="age" class="filter-section">
          <h3 class="filter-section__title">{{ t('filterPage.customVehicleAge') }}</h3>
          <div class="slider-container">
            <van-slider
              v-model="carBeginEnd"
              range
              :min="0"
              :max="11"
              :step="1"
              :marks="ageMarks"
            />
          </div>
          <div class="slider-inputs">
            <div class="input-item">
              <span>{{ formatAge(carBeginEnd[0]) }}</span>
              <small>{{ t('filterPage.year') }}</small>
            </div>
            <span class="separator">-</span>
            <div class="input-item">
              <span>{{ formatAge(carBeginEnd[1]) }}</span>
              <small>{{ t('filterPage.year') }}</small>
            </div>
          </div>
        </div>

        <!-- 排量 -->
        <div id="displacement" class="filter-section">
          <h3 class="filter-section__title">{{ t('filterPage.displacement') }}</h3>
          <div class="slider-container">
            <van-slider
              v-model="filterData.displacement"
              :min="0"
              :max="5"
              :step="0.1"
              :marks="displacementMarks"
            />
          </div>
          <div class="slider-inputs">
            <div class="input-item">
              <span>{{ formatDisplacement(filterData.displacement) }}</span>
              <small>{{ t('filterPage.displacementUnit') }}</small>
            </div>
          </div>
        </div>

        <!-- 车身颜色 -->
        <div id="color" class="filter-section">
          <h3 class="filter-section__title">{{ t('filterPage.bodyColor') }}</h3>
          <div class="option-grid">
            <van-button
              v-for="item in bodyColors"
              :key="item.value"
              :type="filterData.color === item.value ? 'primary' : 'default'"
              @click="filterData.color = item.value"
            >
              {{ item.label }}
            </van-button>
          </div>
        </div>

        <!-- 排放标准 -->
        <div id="emission" class="filter-section" v-if="false">
          <h3 class="filter-section__title">{{ t('filterPage.emissionStandard') }}</h3>
          <div class="option-grid">
            <van-button
              v-for="item in emissionStandards"
              :key="item.value"
              :type="filterData.emissionStandard === item.value ? 'primary' : 'default'"
              @click="filterData.emissionStandard = item.value"
            >
              {{ item.label }}
            </van-button>
          </div>
        </div>

        <!-- 能源类型 -->
        <div id="energy" class="filter-section">
          <h3 class="filter-section__title">{{ t('filterPage.energyType') }}</h3>
          <div class="option-grid">
            <van-button
              v-for="item in energyTypes"
              :key="item.value"
              :type="filterData.energyType === item.value ? 'primary' : 'default'"
              @click="filterData.energyType = item.value"
            >
              {{ item.label }}
            </van-button>
          </div>
        </div>
      </div>
      <div class="filter-page__footer">
        <div class="filter-page__footer-inner">
          <van-button block plain @click="onReset">{{ t('filterPage.reset') }}</van-button>
          <van-button block type="primary" @click="onConfirm">
            {{ t('filterPage.confirm') }}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useFilterStore } from '@/stores/filter'
  import { fetchCarColor, fetchCarEnergyType } from '@/api'
  import { useDataRefresh } from '@/hooks/useDataRefresh.js'

  defineOptions({
    name: 'FilterPage'
  })

  const { t } = useI18n()
  const router = useRouter()
  const filterStore = useFilterStore()

  const navList = [
    // { key: 'type', label: t('filterPage.vehicleType') },
    { key: 'age', label: t('filterPage.customVehicleAge') },
    { key: 'displacement', label: t('filterPage.displacement') },
    { key: 'color', label: t('filterPage.bodyColor') },
    { key: 'emission', label: t('filterPage.emissionStandard') },
    { key: 'energy', label: t('filterPage.energyType') }
  ]
  const activeNav = ref(navList[0].key)
  const contentRef = ref(null)
  let scrollTimeout = null // Timer to manage scroll event handling after a click

  const filterData = reactive({
    carType: null, // 车辆类型
    carBegin: 0, // 车龄起始
    carEnd: 11, // 车龄结束
    displacement: 0.0, // 排量
    color: null, // 颜色
    emissionStandard: null, // 排放标准
    energyType: null // 能源类型
  })

  const initialFilterData = JSON.parse(JSON.stringify(filterData))

  const vehicleTypes = computed(() => [
    { value: 1, label: t('filterPage.vehicleTypes.bus') },
    { value: 2, label: t('filterPage.vehicleTypes.truck') },
    { value: 3, label: t('filterPage.vehicleTypes.sedan') },
    { value: 4, label: t('filterPage.vehicleTypes.hatchback_2box') },
    { value: 5, label: t('filterPage.vehicleTypes.wagon') },
    { value: 6, label: t('filterPage.vehicleTypes.pickup') },
    { value: 7, label: t('filterPage.vehicleTypes.mpv') },
    { value: 8, label: t('filterPage.vehicleTypes.suv') },
    { value: 9, label: t('filterPage.vehicleTypes.hatchback') },
    { value: 10, label: t('filterPage.vehicleTypes.softTopConvertible') },
    { value: 11, label: t('filterPage.vehicleTypes.hardTopConvertible') },
    { value: 12, label: t('filterPage.vehicleTypes.hardTopCoupe') }
  ])

  const ageMarks = {
    0: '0',
    2: '2',
    4: '4',
    6: '6',
    8: '8',
    10: '10',
    11: t('filterPage.unlimited')
  }
  const displacementMarks = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: t('filterPage.unlimited') }

  const bodyColors = ref([])
  const energyTypes = ref([])

  // 加载车辆颜色数据
  const loadCarColors = async () => {
    try {
      const list = await fetchCarColor()
      bodyColors.value = list.map(item => ({
        value: item.num,
        label: item.color
      }))
      console.log('车辆颜色数据已加载:', bodyColors.value)
    } catch (error) {
      console.error('加载车辆颜色数据失败:', error)
    }
  }

  // 加载车辆能源类型数据
  const loadCarEnergyTypes = async () => {
    try {
      const list = await fetchCarEnergyType()
      energyTypes.value = list.map(item => ({
        value: item.num,
        label: item.energyType
      }))
      console.log('车辆能源类型数据已加载:', energyTypes.value)
    } catch (error) {
      console.error('加载车辆能源类型数据失败:', error)
    }
  }

  // 刷新所有筛选数据
  const refreshFilterData = async () => {
    console.log('刷新筛选页面数据...')
    await Promise.all([loadCarColors(), loadCarEnergyTypes()])
  }

  const emissionStandards = computed(() => [
    { value: 'Страна I', label: t('filterPage.emissions.guo1') },
    { value: 'Страна II', label: t('filterPage.emissions.guo2') },
    { value: 'Страна III', label: t('filterPage.emissions.guo3') },
    { value: 'Страна IV', label: t('filterPage.emissions.guo4') },
    { value: 'Страна V', label: t('filterPage.emissions.guo5') },
    { value: 'Страна VI', label: t('filterPage.emissions.guo6') }
  ])

  // 使用数据刷新组合式函数
  useDataRefresh(refreshFilterData, {
    autoRefresh: true,
    refreshOnLanguageChange: true,
    refreshOnMount: true,
    debounceTime: 300
  })

  function formatAge(val) {
    return val >= 11 ? t('filterPage.unlimited') : val
  }

  function formatDisplacement(val) {
    if (val >= 5) return t('filterPage.unlimited')
    return val?.toFixed(1)
  }

  const scrollTo = key => {
    activeNav.value = key

    // Temporarily ignore scroll events triggered by this programmatic scroll
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null
    }, 1000)

    const targetEl = contentRef.value.querySelector(`#${key}`)
    if (targetEl) {
      contentRef.value.scrollTo({
        top: targetEl.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    // If a click-initiated scroll is in progress, do nothing.
    if (scrollTimeout) {
      return
    }

    const contentEl = contentRef.value
    if (!contentEl) return

    const scrollTop = contentEl.scrollTop
    const sections = contentEl.querySelectorAll('.filter-section')

    // Use a dynamic offset based on viewport height to determine the "active" area.
    // An item is considered active if its top is within the top 40% of the viewport.
    const offset = contentEl.clientHeight * 0.4

    let currentId = ''

    // Iterate backwards to find the last section that has passed the offset.
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      if (scrollTop >= section.offsetTop - offset) {
        currentId = section.id
        break
      }
    }

    // Default to the first item if nothing else is matched (e.g., at the very top).
    if (!currentId && navList.length > 0) {
      currentId = navList[0].key
    }

    if (activeNav.value !== currentId) {
      activeNav.value = currentId
    }
  }

  function onReset() {
    Object.assign(filterData, JSON.parse(JSON.stringify(initialFilterData)))
  }

  function onConfirm() {
    console.log('onConfirm', filterData)
    filterStore.setFilter({ ...filterData })
    router.push('/home')
  }

  // 车龄双向绑定
  const carBeginEnd = computed({
    get: () => [filterData.carBegin, filterData.carEnd],
    set: ([begin, end]) => {
      filterData.carBegin = begin
      filterData.carEnd = end
    }
  })
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
        transition:
          background 0.2s,
          color 0.2s;
        user-select: none;
        display: block;
        height: auto;
        margin: 0;
        align-items: unset;
        justify-content: unset;
        white-space: normal;

        &--active {
          background: #fff;
          color: #1989fa;
          border-left: 3px solid #1989fa;
          box-shadow: 0 2px 8px rgba(255, 184, 0, 0.04);
        }
      }
    }

    &__content {
      position: relative;
      margin-left: 130px;
      flex: 1;
      height: calc(100vh - #{$header-height} - #{$footer-height});
      overflow-y: auto;
      padding: 16px 16px 80px 16px;
      background: #fff;
      box-sizing: border-box;
      scroll-behavior: smooth;
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

  .filter-section {
    margin-bottom: 24px;
    padding-top: 8px;

    &:first-child {
      padding-top: 0;
    }

    &__title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }
  }

  .option-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 8px;

    .van-button {
      height: auto;
      min-height: 32px;
      padding: 4px 12px;
      flex-basis: calc(33.333% - 6px);
      font-size: 13px;
      border-color: #f0f0f0;

      :deep(.van-button__text) {
        white-space: normal;
        word-break: break-word;
      }

      &.van-button--primary {
        border-color: var(--van-primary-color);
      }
    }
  }

  .slider-container {
    padding: 0 10px;
    margin-bottom: 24px;
  }

  .slider-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding: 0 10px;

    .separator {
      color: #999;
    }

    .input-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 12px;
      background: #f7f8fa;
      border-radius: 4px;
      min-width: 80px;
      text-align: center;

      span {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      small {
        font-size: 12px;
        color: #999;
        margin-top: 2px;
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

    .option-grid .van-button {
      font-size: 12px;
    }
  }
</style>
