<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-05 21:11:47
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-10 09:12:51
 * @FilePath: \car-h5-project\src\views\Brand\index.vue
 * @Description：brand
-->
<template>
  <div class="brand-select">
    <div class="brand-select__header">
      <span class="brand-select__title">{{ $t('brand.title') }}</span>
    </div>
    <BrandHot :brands="hotBrands" @select="onBrandSelect" />
    <BrandList :brand-groups="brandGroups" @select="onBrandSelect" />
    <BrandSidebar :letters="letters" @select="onSidebarSelect" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BrandHot from './components/BrandHot.vue'
import BrandList from './components/BrandList.vue'
import BrandSidebar from './components/BrandSidebar.vue'

const { t } = useI18n()
const router = useRouter()

// 模拟热门品牌数据
const hotBrands = ref([
  {
    id: 1,
    name: t('brand.unlimited'),
    logo: new URL('@/assets/images/more.png', import.meta.url).href,
  },
  { id: 2, name: t('brand.audi'), logo: new URL('@/assets/images/aodi.png', import.meta.url).href },
  { id: 3, name: t('brand.bmw'), logo: new URL('@/assets/images/baoma.png', import.meta.url).href },
  {
    id: 4,
    name: t('brand.benz'),
    logo: new URL('@/assets/images/benchi.png', import.meta.url).href,
  },
  {
    id: 5,
    name: t('brand.volkswagen'),
    logo: new URL('@/assets/images/dazhong.png', import.meta.url).href,
  },
  {
    id: 6,
    name: t('brand.toyota'),
    logo: new URL('@/assets/images/fengtian.png', import.meta.url).href,
  },
  {
    id: 7,
    name: t('brand.honda'),
    logo: new URL('@/assets/images/bentian.png', import.meta.url).href,
  },
  { id: 8, name: t('brand.byd'), logo: new URL('@/assets/images/BYD.png', import.meta.url).href },
])

// 模拟按字母分组的品牌数据
const brandGroups = ref([
  {
    letter: 'A',
    brands: [
      {
        id: 1,
        name: t('brand.audi'),
        logo: new URL('@/assets/images/aodi.png', import.meta.url).href,
      },
      {
        id: 2,
        name: t('brand.alfaRomeo'),
        logo: new URL('@/assets/images/more.png', import.meta.url).href,
      },
    ],
  },
  {
    letter: 'B',
    brands: [
      {
        id: 3,
        name: t('brand.bmw'),
        logo: new URL('@/assets/images/baoma.png', import.meta.url).href,
      },
      {
        id: 4,
        name: t('brand.benz'),
        logo: new URL('@/assets/images/benchi.png', import.meta.url).href,
      },
      {
        id: 5,
        name: t('brand.buick'),
        logo: new URL('@/assets/images/more.png', import.meta.url).href,
      },
    ],
  },
  {
    letter: 'D',
    brands: [
      {
        id: 6,
        name: t('brand.volkswagen'),
        logo: new URL('@/assets/images/dazhong.png', import.meta.url).href,
      },
      {
        id: 7,
        name: t('brand.dodge'),
        logo: new URL('@/assets/images/more.png', import.meta.url).href,
      },
    ],
  },
])

// 字母索引数据
const letters = ref([
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
])

function onSidebarSelect(letter) {
  // 处理字母索引点击，可以滚动到对应分组
  console.log('选中字母:', letter)
}

function onBrandSelect(brand) {
  // 处理品牌点击
  console.log('选中品牌:', brand)
  router.push(`/list/${brand.name}`)
}
</script>

<style lang="scss" scoped>
.brand-select {
  padding: 16px;
  background: #fff;
  min-height: 100vh;
  &__header {
    margin-bottom: 16px;
    text-align: center;
  }
  &__title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}
</style>
