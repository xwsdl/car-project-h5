<template>
  <div class="car-detail-view">
    <CarHeader />
    <div class="content-container">
      <CarSwiper v-if="carImages.length" :images="carImages" />
      <PriceInfo
        :currentPrice="carBasicInfo.networkPrice"
        :originalPrice="carBasicInfo.salesPrice || ''"
      />
      <BasicInfo :car="carBasicInfo" />
      <DetailInfo :details="carDetails" />
      <PurchaseProcess :steps="purchaseSteps" />
      <CarRecommend v-if="recommendedCars.length" :cars="recommendedCars" />
    </div>

    <ActionBar />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { fetchCarDetail, fetchCarList } from '@/api/base/index.js'
import { ref, onMounted } from 'vue'
import CarHeader from './components/CarHeader.vue'
import CarSwiper from './components/CarSwiper.vue'
import PriceInfo from './components/PriceInfo.vue'
import BasicInfo from './components/BasicInfo.vue'
import DetailInfo from './components/DetailInfo.vue'
import PurchaseProcess from './components/PurchaseProcess.vue'
import CarRecommend from './components/CarRecommend.vue'
import ActionBar from './components/ActionBar.vue'
import { useRoute } from 'vue-router'
const { t: $t } = useI18n()
const route = useRoute()

onMounted(() => {
  // 将页面滚动条滚动到顶部
  window.scrollTo(0, 0)
  fetchCarDetail(route.params.id).then((res) => {
    console.log('fetchCarDetail', res)
    carBasicInfo.value = res
    carImages.value = res.carOtherPics && res.carOtherPics.split(',')
    carDetails.value = carDetails.value.map((item) => {
      return {
        label: item.label,
        value: res[item.valueKey],
      }
    })
  })
  fetchCardList()
  initPurchaseSteps()
})
// 轮播图图片
const carImages = ref([])

// 价格信息
// const currentPrice = ref('$14,167.80 USD')
// const originalPrice = ref('$22,904.61 USD')

// 汽车基本信息
const carBasicInfo = ref({
  tag: '二手车',
  title: 'HONDA 2023 ZR-V (Zhizai) 1.5T',
  subtitle: 'Stepless Technology Edition',
  fullTitle: 'HONDA 2023 ZR-V (Zhizai) 1.5T',
  publishDate: '2025/05/30',
  updateDate: '2025/05/30',
  location: 'China',
})

// 汽车详细信息
const carDetails = ref([
  { label: $t('detail.registrationDate'), valueKey: 'firstRegTime' },
  { label: $t('detail.mileage'), valueKey: 'watchMile' },
  { label: $t('detail.energyType'), valueKey: 'energyType' },
  { label: $t('detail.displacement'), valueKey: 'displacement' },
  { label: $t('detail.color'), valueKey: 'color' },
  { label: $t('detail.emissionStandard'), valueKey: 'emissionStandard' },
  //  { label: $t('detail.transmission'), valueKey: 'gearbox' },
  // { label: $t('detail.manufacturerType'), valueKey: 'manufacturerType' },
  // { label: $t('detail.vehicleType'), valueKey: 'carAttribute' },
  // { label: $t('detail.msrp'), valueKey: 'networkPrice' },
  // { label: $t('detail.insuranceExpiry'), valueKey: 'warrantyDate' },
  // { label: $t('detail.location'), valueKey: 'storesAddress' },
])

// 购买流程
const purchaseSteps = ref([])

function initPurchaseSteps() {
  purchaseSteps.value = [
    { index: 1, title: $t('detail.submitOrder'), desc: $t('detail.submitOrderDesc') },
    { index: 2, title: $t('detail.pay'), desc: $t('detail.payDesc') },
    { index: 3, title: $t('detail.transport'), desc: $t('detail.transportDesc') },
    { index: 4, title: $t('detail.arrive'), desc: $t('detail.arriveDesc') },
    { index: 5, title: $t('detail.delivery'), desc: $t('detail.deliveryDesc') },
    { index: 6, title: $t('detail.afterSale'), desc: $t('detail.afterSaleDesc') },
  ]
}

// 推荐汽车
const recommendedCars = ref([
  {
    title: 'Li Auto 2024 L6 Pro',
    subtitle: 'Li Auto 2024 L6 Pro',
    date: '2025/05/30 15:15:04',
    location: 'China',
    tag: '二手车',
    price: '$26,363.22 USD',
    image:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Li Auto 2024 MEGA Ultra',
    subtitle: 'Li Auto 2024 MEGA Ultra',
    date: '2025/05/30 14:52:57',
    location: 'China',
    tag: '二手车',
    price: '$50,560.32 USD',
    image:
      'https://images.unsplash.com/photo-1617814076231-2c2f4e2b9c34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
])

const fetchCardList = () => {
  fetchCarList({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    modelName: '',
    isAsc: false,
    sortBy: '',
    pages: '',
  }).then((res) => {
    recommendedCars.value = res.list.map((item) => {
      return {
        title: item.modelName,
        subtitle: item.emissionStandard,
        date: item.firstRegTime,
        location: item.location,
        tag: item.carNature,
        price: `${item.networkPrice} ${$t('home.tenThousand')}`,
        image: item.carOtherPics && item.carOtherPics.split(',')[0],
      }
    })
  })
}
</script>


<style lang="scss" scoped>
.car-detail-view {
  background-color: #f5f7fa;
  padding-bottom: 80px; // 为底部操作栏留出空间
}

.content-container {
  max-width: 480px;
  margin: 0 auto;
}
</style>
