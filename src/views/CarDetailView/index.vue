<template>
  <div class="car-detail-view">
    <CarHeader />
    <div class="content-container">
      <CarSwiper :key="route.query.id" v-if="carImages.length" :images="carImages" />
      <PriceInfo
        :currentPrice="carBasicInfo.ruble || 0"
        :originalPrice="carBasicInfo.salesPrice || ''"
      />
      <BasicInfo :car="carBasicInfo" />
      <DetailInfo :details="carDetails" />
      <!-- 车辆报告 -->
      <div class="section-block">
        <h2 class="section-title">{{ $t('detail.report') }}</h2>
        <div class="section-content">
          <template v-if="carBasicInfo['thirdReport']">
            <a
              :href="carBasicInfo['thirdReport']"
              target="_blank"
              rel="noopener noreferrer"
              class="report-link"
            >
              {{ $t('detail.viewReport') }}
            </a>
          </template>
          <template v-else>
            {{ $t('detail.noRecord') }}
          </template>
        </div>
      </div>
      <!-- 车况描述板块 -->
      <div class="section-block">
        <h2 class="section-title">{{ $t('detail.carCondition') }}</h2>
        <div class="section-content">
          {{ carBasicInfo['carDescription'] || $t('detail.noRecord') }}
        </div>
      </div>
      <!-- 车源情况板块 -->
      <div class="section-block">
        <h2 class="section-title">{{ $t('detail.carSource') }}</h2>
        <div class="section-content car-source">
          <van-image
            class="car-source-img"
            fit="cover"
            v-for="item in carImages"
            :key="item"
            :src="item"
            lazy-load
            :alt="$t('carDetail.swiper.carImage')"
            radius="8"
          />
        </div>
      </div>
      <CarRecommend v-if="recommendedCars.length" :cars="recommendedCars" />
    </div>

    <ActionBar @buy="handleBuy" />
  </div>
</template>

<script setup name="CarDetailView">
  import { useI18n } from 'vue-i18n'
  import { extractImageUrls } from '@/utils/index.js'
  import { fetchCarDetail, fetchRecommend } from '@/api/base/index.js'
  import { createOrder } from '@/api'
  import { ref, onMounted, watch } from 'vue'
  import CarHeader from './components/CarHeader.vue'
  import CarSwiper from './components/CarSwiper.vue'
  import PriceInfo from './components/PriceInfo.vue'
  import BasicInfo from './components/BasicInfo.vue'
  import DetailInfo from './components/DetailInfo.vue'
  import CarRecommend from './components/CarRecommend.vue'
  import ActionBar from './components/ActionBar.vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { showFailToast,showToast} from 'vant'
  const authStore = useAuthStore()
  const { t: $t } = useI18n()
  const route = useRoute()
  const pageInit = () => {
    // 将页面滚动条滚动到顶部
    window.scrollTo(0, 0)
    fetchCarDetail(route.query.id).then(res => {
      fetchCardList(res.brand)
      carBasicInfo.value = res
      carImages.value = res.carOtherPics && extractImageUrls(res.carOtherPics)
      carDetails.value = carDetails.value.map(item => {
        return {
          label: item.label,
          value: item.valueKey != 'watchMile' ? res[item.valueKey] : `${res.watchMile} Km`
        }
      })
    })
  }
  onMounted(() => {
    pageInit()
  })

  watch(
    () => route.query.id,
    () => {
      pageInit()
    }
  )
  // 轮播图图片
  const carImages = ref([])

  // 汽车基本信息
  const carBasicInfo = ref({})

  // 汽车详细信息
  const carDetails = ref([
    { label: $t('detail.registrationDate'), valueKey: 'firstRegTimeStr' },
    { label: $t('detail.mileage'), valueKey: 'watchMile' },
    { label: $t('detail.displacement'), valueKey: 'displacement' },
    { label: $t('detail.transmission'), valueKey: 'gearBox' },
    { label: $t('detail.annualInspection'), valueKey: 'annualInspectionDateStr' },
    { label: $t('detail.insurance'), valueKey: 'warrantyDateStr' },
    { label: $t('detail.energyType'), valueKey: 'energyType' },
    { label: $t('detail.color'), valueKey: 'color' }
  ])

  // 推荐汽车
  const recommendedCars = ref([])

  const fetchCardList = brand => {
    fetchRecommend({
      brand
    }).then(res => {
      recommendedCars.value = res.map(item => {
        const imageList = (item.carOtherPics && extractImageUrls(item.carOtherPics)) || []
        return {
          ...item,
          mainImageUrl: imageList[0],
          carOtherPics: imageList
        }
      })
    })
  }

  const handleBuy = () => {
    if (!authStore.isAuthenticated) {
      showFailToast('请先登录')
      return false
    }
    const { id, username } = authStore.user
    const params = {
      csId: 1, ///客服ID
      customerContact: '', //客户联系方式
      customerId: id, //客户ID
      customerName: username //客户姓名
    }
    createOrder(params).then(() => {
      showToast('已加入订单进程成功')
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

  .section-block {
    background: #fff;
    margin: 12px 0;
    padding: 16px;
    &:nth-child(n + 2) {
      margin-top: 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #1a365d;
    }
    .section-content {
      font-size: 14px;
      color: #333;
      &.car-source {
        display: flex;
        align-items: center;
        flex-direction: column;

        .car-source-img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          object-fit: cover;
          margin-bottom: 5px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .report-link {
        color: #1989fa;
        text-decoration: underline;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
</style>
