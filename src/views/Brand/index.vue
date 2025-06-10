<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-05 21:11:47
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-09 22:14:55
 * @FilePath: \car-h5-project\src\views\Brand\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
import { fetchCarBrandList, fetchCarHotList } from '@/api/jiSuApi/index.js'
import { ref,onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BrandHot from './components/BrandHot.vue'
import BrandList from './components/BrandList.vue'
import BrandSidebar from './components/BrandSidebar.vue'

const { t } = useI18n()
const router = useRouter()

const hotBrands = ref([])
const brandGroups = ref([])

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

// 按字母分组的品牌数据
function groupBrandsByLetter(brands) {
  const groups = {}
  // 初始化26个字母的分组
  letters.value.forEach(letter => {
    groups[letter] = []
  })
  
  // 将品牌按首字母分组
  brands.forEach(brand => {
    const initial = brand.initial.toUpperCase()
    if (groups[initial]) {
      groups[initial].push({
        id: brand.id,
        name: brand.name,
        logo: brand.logo
      })
    }
  })
  
  // 转换为数组格式
  return Object.entries(groups)
    .filter(([_, brands]) => brands.length > 0)
    .map(([letter, brands]) => ({
      letter,
      brands
    }))
}

onMounted(() => {
  // 获取热门品牌
  // fetchCarHotList({pricetype:1}).then((res) => {
  //   if (res.result) {
  //     hotBrands.value = res.result
  //       .slice(0, 8) // 只取前8个品牌
  //       .map(brand => ({
  //         id: brand.id,
  //         name: brand.name,
  //         logo: brand.logo
  //       }))
  //   }
  // })
  
  // 获取所有品牌并按字母分组
  fetchCarBrandList().then((res) => {
    if (res.result) {
      brandGroups.value = groupBrandsByLetter(res.result)
      hotBrands.value = res.result
        .slice(0, 8) // 只取前8个品牌
        .map(brand => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo
        }))
    }
  })
})
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
