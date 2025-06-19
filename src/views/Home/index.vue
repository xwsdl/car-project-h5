<template>
  <div class="home">
    <!-- 轮播图 -->
    <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(item, index) in swipeList"
        :key="index"
        @click="() => handleView(index)"
      >
        <img :src="item.mainImageUrl" width="50" height="50" class="swiper-img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 查询搜索框 -->
    <van-search
      class="home-search"
      @search="handleSearch"
      v-model="formData.modelName"
      :placeholder="$t('home.searchTip')"
    />

    <!-- 筛选区组件 -->
    <CarFilter
      v-model:sort="sortValue"
      v-model:brand="brandValue"
      v-model:price="priceValue"
      v-model:filter="filterValue"
      @sort-change="onSortChange"
      @brand-change="onBrandChange"
      @price-change="onPriceChange"
    />

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
import { useRouter } from 'vue-router'
const router = useRouter()
import { useI18n } from 'vue-i18n'
import { fetchCarList } from '@/api/base/index.js'
// import { getFile } from '@/utils/index.js' // 已移除未使用
import { ref, onMounted, reactive, computed } from 'vue'
import CarList from '@/components/CarList/CarList.vue'
import CarFilter from '@/components/CarFilter.vue'
const { t: $t } = useI18n()
// 轮播图
const swipeList = ref([])

// 初始车辆数据
const cars = ref([
  {
    id: 1,
    title: 'HONDA 2022 VEZEL 1.5 Unlimited',
    subtitle: 'Elite Intelligent Enjoyment Edition',
    fullTitle: 'HONDA 2022 VEZEL 1.5 Unlimited',
    date: '2025/05/30 15:18:19',
    location: 'China',
    tag: '二手车',
    price: '$10,250.82 USD',
    image:
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Li Auto 2024 L6 Pro',
    subtitle: 'Li Auto 2024 L6 Pro',
    fullTitle: 'Li Auto 2024 L6 Pro',
    date: '2025/05/30 15:15:04',
    location: 'China',
    tag: '二手车',
    price: '$26,363.22 USD',
    image:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Li Auto 2024 MEGA Ultra',
    subtitle: 'Li Auto 2024 MEGA Ultra',
    fullTitle: 'Li Auto 2024 MEGA Ultra',
    date: '2025/05/30 14:52:57',
    location: 'China',
    tag: '二手车',
    price: '$50,560.32 USD',
    image:
      'https://images.unsplash.com/photo-1617814076231-2c2f4e2b9c34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
])

// 加载更多车辆
const loadMoreCars = () => {
  if (isLoadAll.value) {
    return
  }
  formData.pageNo++
  fetchCarList(formData).then((res) => {
    formData.total = res.total
    formData.pages = res.pages
    cars.value = [...cars.value, ...res.list]
  })
}

const formData = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  modelName: '',
  isAsc: false,
  sortBy: '',
  pages: '', //总页数
})

const isLoadAll = computed(() => {
  return formData.pageNo >= formData.pages
})

const handleSearch = () => {
  fetchCardList()
}

onMounted(() => {
  fetchCardList()
})

const fetchCardList = () => {
  fetchCarList(formData).then((res) => {
    formData.total = res.total
    formData.pages = res.pages
    cars.value = res.list
    swipeList.value = res.list
      .map((item) => {
        item.mainImageUrl = item.carOtherPics && item.carOtherPics.split(',')[0]
        return item
      })
      .filter((item) => item.mainImageUrl)

    console.log('swipeList', swipeList.value)
  })
}

const handleView = (index) => {
  router.push(`/car/${swipeList.value[index].id}`)
}

// 筛选相关变量
const sortValue = ref(0)
const brandValue = ref(0)
const priceValue = ref(0)
const filterValue = ref(0)

function onSortChange() {
  // 这里可以执行排序相关逻辑
  fetchCardList()
}
function onBrandChange() {
  // 这里可以执行品牌筛选相关逻辑
  fetchCardList()
}
function onPriceChange() {
  // 这里可以执行价格筛选相关逻辑
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
.home-filter {
  margin: 10px 0 0 0;
}
</style>
