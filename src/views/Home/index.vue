<template>
  <div class="home">
    <!-- 轮播图 -->
    <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(item, index) in swipeList"
        :key="index"
        @click="() => handleView(index)"
      >
        <img :src="item" width="50" height="50" class="swiper-img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 固钉：查询搜索框 -->
    <van-sticky :offset-top="0" z-index="10">
      <div class="home-search">
        <van-search
          @search="handleSearch"
          @clear="handleSearch"
          v-model="formData.modelName"
          :placeholder="$t('home.searchTip')"
        />
        <CarFilter
          v-model:sort="sortValue"
          v-model:brand="brandValue"
          v-model:price="priceValue"
          v-model:filter="filterValue"
          @sort-change="onSortChange"
          @brand-change="onBrandChange"
          @price-change="onPriceChange"
        />
      </div>
    </van-sticky>
    <!-- 商品列表 -->
    <div class="home-product">
      <CarList
        :cars="cars"
        :isLoadAll="isLoadAll"
        @load-more="loadMoreCars"
        :title="`${$t('home.newCar')}${$t('home.secondCar')}`"
        :subtitle="`${$t('home.qualityCar')},${$t('home.professionalService')}`"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { fetchCarList } from '@/api/base/index.js'
import { getBanner } from '@/utils/index.js'
import { ref, onMounted, computed } from 'vue'
import CarList from '@/components/CarList/index.vue'
import CarFilter from '@/components/CarFilter/index.vue'
const { t: $t, locale } = useI18n()

// 初始车辆数据
const cars = ref([])
const formData = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  modelName: '',
  isAsc: false,
  sortBy: '',
  pages: '', //总页数
  sortBetweenPrice: 0, //价格区间
})

// 加载更多车辆
const loadMoreCars = () => {
  if (isLoadAll.value) {
    return
  }
  formData.value.pageNo++
  fetchCarList({...formData.value}).then((res) => {
    formData.value.total = res.total
    formData.value.pages = res.pages
    cars.value = [...cars.value, ...res.list]
  })
}

const isLoadAll = computed(() => {
  return formData.value.pageNo >= formData.value.pages
})

const handleSearch = () => {
  fetchCardList()
}

onMounted(() => {
  fetchCardList()
})

const zhBanners = [
  getBanner('01.jpg'),
  getBanner('02.jpg'),
  getBanner('03.jpg'),
  getBanner('04.jpg'),
]

const ruBanners = [
  getBanner('01-2.jpg'),
  getBanner('02-2.jpg'),
  getBanner('03-2.jpg'),
  getBanner('04-2.jpg'),
]

// 轮播图
const swipeList = computed(() => {
  return locale.value === 'zh-CN' ? zhBanners : ruBanners
})

const fetchCardList = () => {
  fetchCarList({ ...formData.value }).then((res) => {
    formData.value.total = res.total
    formData.value.pages = res.pages
    cars.value = res.list
      .map((item) => {
        item.mainImageUrl = item.carOtherPics && item.carOtherPics.split(',')[0]
        return item
      })
      .filter((item) => item.mainImageUrl)
  })
}

const handleView = (index) => {
  // router.push(`/car/${swipeList.value[index].id}`)
}

// 筛选相关变量
const sortValue = ref(0)
const brandValue = ref(0)
const priceValue = ref(0)
const filterValue = ref(0)

function onSortChange(type) {
  // 排序 1-价格最低  2-价格最高  3-年限最近
  const params = {
    1: {
      isAsc: true,
      sortBy: 'networkPrice',
    },
    2: {
      isAsc: false,
      sortBy: 'networkPrice',
    },
    3: {
      isAsc: false,
      sortBy: 'firstRegTime',
    },
  }

  formData.value = {
    ...formData.value,
    sortBy: params[type].sortBy || '',
    isAsc: params[type].isAsc || false,
    pageNo: 1,
  }

  // 这里可以执行排序相关逻辑
  fetchCardList()
}
function onBrandChange() {
  // 这里可以执行品牌筛选相关逻辑
  fetchCardList()
}
function onPriceChange(type = 0) {
  // 这里可以执行价格筛选相关逻辑
  formData.value = {
    ...formData.value,
    sortBetweenPrice: type,
    pageNo: 1,
  }
  fetchCardList()
}
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

.home-search {
  background-color: #fff;
}
</style>
