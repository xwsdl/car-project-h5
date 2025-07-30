<template>
  <div class="home">
    <van-search
      class="home-search"
      @search="handleSearch"
      v-model="formData.modelName"
      :placeholder="$t('common.welcome')"
    />
  </div>

  <!-- 商品列表 -->
  <div class="home-product">
    <CarList
      :cars="cars"
      @load-more="loadMoreCars"
      :isLoadAll="isLoadAll"
      :title="title"
      :subtitle="`${$t('home.qualityCar')},${$t('home.professionalService')}`"
    />
  </div>
</template>

<script setup>
  import { fetchCarList } from '@/api/base/index.js'
  import { ref, reactive, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useDataRefresh } from '@/hooks/useDataRefresh.js'
  import CarList from '@/components/CarList/index.vue'
  const route = useRoute()
  const { t: $t } = useI18n()
  // 辆数据
  const cars = ref([])
  const formData = reactive({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    modelName: '',
    isAsc: false,
    sortBy: '',
    pages: '' //总页数
  })
  const isLoadAll = computed(() => {
    return formData.pageNo >= formData.pages
  })
  // 加载更多车辆
  const loadMoreCars = () => {
    // 模拟加载更多数据

    if (isLoadAll.value) {
      // 提示已加载完所有数据
      return
    }
    formData.pageNo++
    fetchCarList(formData).then(res => {
      formData.total = res.total
      formData.pages = res.pages
      cars.value = [...cars.value, ...res.list]
    })
  }

  const handleSearch = () => {
    fetchCardList()
  }

  const title = ref(`${$t('home.newCar')}${$t('home.secondCar')}`)

  onMounted(() => {
    formData.modelName = ['更多', 'Больше'].includes(route.params.category)
      ? ''
      : route.params.category
    title.value = route.params.category || `${$t('home.newCar')}${$t('home.secondCar')}`

    fetchCardList()
    console.log('跳转guolde分类---', route.params.category)
  })

  const fetchCardList = () => {
    // 重置分页
    formData.pageNo = 1
    cars.value = []

    return fetchCarList(formData).then(res => {
      formData.total = res.total
      formData.pages = res.pages
      cars.value = res.list
    })
  }

  // 使用数据刷新组合式函数
  useDataRefresh(fetchCardList, {
    autoRefresh: true,
    refreshOnLanguageChange: true,
    refreshOnMount: false, // 手动控制初始加载
    debounceTime: 300
  })
</script>

<style lang="scss" scoped>
  @mixin flex($justify: space-between, $align: center) {
    display: flex;
    justify-content: $justify;
    align-items: $align;
  }
  .home {
    &-swipe {
      width: 100%;
      margin-top: 8px;
      border-radius: 10px;
    }
    .swiper-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &-menu {
      margin-top: 8px;
      padding: 16px;
      background-color: #fff;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      &__item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__icon {
        width: 40px;
        height: 40px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      &__name {
        font-size: 14px;
        color: #333;
        text-align: center;
        margin-top: 4px;
        /* 设置文本自动换行 */
        word-wrap: break-word;
        white-space: normal;
        line-height: 1.5;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
      }
    }

    &-brand {
      margin-top: 10px;
      background-color: #fff;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      @include flex();
      flex-wrap: wrap;
      &__item {
        width: 25%;
        @include flex(flex-start, center);
        flex-direction: column;
      }

      &__icon {
        width: 40px;
        height: 40px;
      }

      &__name {
        font-size: 14px;
        color: #333;
        text-align: center;
        margin-top: 4px;
      }
    }

    &-product {
      margin-top: 10px;
      border-radius: 16px;
      padding-bottom: 50px;
    }
  }
  .home-swipe {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
</style>
