<template>
  <div class="brand-select">
    <div class="brand-select__header">
      <span class="brand-select__title">{{ $t('brand.title') }}</span>
    </div>
    <BrandHot :brands="hotBrands" @select="onBrandSelect" />
    <BrandList :brand-groups="brandGroups" @select="onBrandSelect" />
    <!-- 字母索引 -->
    <div class="letter-index">
      <div
        v-for="letter in letters"
        :key="letter"
        class="letter-item"
        :class="{ active: currentLetter === letter && brandGroups.some(g => g.letter === letter) }"
        @click="onSidebarSelect(letter)"
      >
        {{ letter }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { fetchCarBrandList } from '@/api/base/index'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useDataRefresh } from '@/hooks/useDataRefresh.js'
  import BrandHot from './components/BrandHot.vue'
  import BrandList from './components/BrandList.vue'
  import { useFilterStore } from '@/stores/filter'

  const { t: $t } = useI18n()
  const router = useRouter()
  const filterStore = useFilterStore()

  const hotBrands = ref([])
  const brandGroups = ref([])
  const loading = ref(false)
  const currentLetter = ref('A') // 默认选中字母A
  const isSidebarClick = ref(false)
  let sidebarClickTimer = null
  // 定义组件名称
  defineOptions({
    name: 'BrandSelect'
  })

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
    'Z'
  ])

  // 缓存相关常量
  const CACHE_KEY = 'CAR_BRANDS_CACHE'
  const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000 // 24小时过期

  // 检查缓存是否有效
  function isCacheValid(cacheData) {
    if (!cacheData) return false
    const now = Date.now()
    return cacheData.timestamp && now - cacheData.timestamp < CACHE_EXPIRE_TIME
  }

  // 从缓存获取数据
  function getBrandsFromCache() {
    try {
      const cacheData = localStorage.getItem(CACHE_KEY)
      if (cacheData) {
        const parsedData = JSON.parse(cacheData)
        if (isCacheValid(parsedData)) {
          return parsedData.data
        }
      }
    } catch (error) {
      console.error('读取缓存失败:', error)
    }
    return null
  }

  // 保存数据到缓存
  function saveBrandsToCache(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('保存缓存失败:', error)
    }
  }

  // 按字母分组的品牌数据
  function groupBrandsByLetter(brands) {
    const groups = {}
    // 只初始化A-Z
    letters.value.forEach(letter => {
      groups[letter] = []
    })

    brands.forEach(brand => {
      let initial = (brand.initial || '').toUpperCase()
      // 只允许A-Z
      if (/^[A-Z]$/.test(initial) && groups[initial]) {
        groups[initial].push({
          id: brand.id,
          name: brand.name,
          logo: brand.logo
        })
      }
    })

    // 只返回有品牌的分组，避免空分组和无效分组
    return Object.entries(groups)
      .filter(([, brands]) => brands.length > 0)
      .map(([letter, brands]) => ({
        letter,
        brands
      }))
  }

  // 滚动到指定字母的位置
  function scrollToLetter(letter) {
    const targetElement = document.querySelector(`[data-letter="${letter}"]`)
    if (targetElement) {
      const offsetTop = targetElement.offsetTop
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  // 加载所有品牌数据
  async function loadAllBrands() {
    if (loading.value) return
    loading.value = true

    try {
      // 先尝试从缓存获取数据
      const cachedData = getBrandsFromCache()
      if (cachedData) {
        brandGroups.value = groupBrandsByLetter(cachedData)
        // 移除自动滚动到A的逻辑
        return
      }

      // 缓存不存在或已过期，从接口获取数据
      const list = await fetchCarBrandList()
      if (list && list.length) {
        // 保存到缓存
        saveBrandsToCache(list)
        // 更新品牌组
        brandGroups.value = groupBrandsByLetter(list)
        // 移除自动滚动到A的逻辑
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 强制刷新品牌数据（清除缓存后重新获取）
  async function refreshBrandData() {
    // 清除缓存
    clearBrandsCache()
    // 重新加载数据
    await loadAllBrands()
    // 重新加载热门品牌
    await loadHotBrands()
  }

  // 加载热门品牌数据
  async function loadHotBrands() {
    try {
      const list = await fetchCarBrandList()
      if (list && list.length) {
        hotBrands.value = list.slice(0, 8).map(brand => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo
        }))
      }
    } catch (error) {
      console.error('加载热门品牌失败:', error)
    }
  }

  // 监听滚动事件，更新当前字母
  function handleScroll() {
    if (isSidebarClick.value) return // 点击索引时不自动更新
    const letterElements = document.querySelectorAll('[data-letter]')
    let activeLetter = brandGroups.value.length ? brandGroups.value[0].letter : 'A'
    let minDiff = Infinity

    letterElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 0 && Math.abs(rect.top) < minDiff) {
        minDiff = Math.abs(rect.top)
        activeLetter = element.getAttribute('data-letter')
      }
    })

    if (activeLetter !== currentLetter.value) {
      currentLetter.value = activeLetter
    }
  }

  // 使用节流函数优化滚动性能
  function throttle(fn, delay) {
    let timer = null
    return function (...args) {
      if (timer) return
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }

  function onSidebarSelect(letter) {
    currentLetter.value = letter
    isSidebarClick.value = true
    scrollToLetter(letter)
    if (sidebarClickTimer) clearTimeout(sidebarClickTimer)
    sidebarClickTimer = setTimeout(() => {
      isSidebarClick.value = false
    }, 500)
  }

  function onBrandSelect(brand) {
    filterStore.setFilter({ modelName: brand.name })
    router.push('/home')
  }

  // 使用数据刷新组合式函数
  useDataRefresh(refreshBrandData, {
    autoRefresh: true,
    refreshOnLanguageChange: true,
    refreshOnMount: false, // 手动控制初始加载
    debounceTime: 300
  })

  onMounted(() => {
    // 页面初始滚动到顶部，确保A分组可见
    window.scrollTo(0, 0)
    // 加载所有品牌数据
    loadAllBrands()

    // 设置热门品牌
    loadHotBrands()

    // 添加滚动监听，使用节流函数优化性能
    window.addEventListener('scroll', throttle(handleScroll, 100))
  })

  // 清除缓存
  function clearBrandsCache() {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (error) {
      console.error('清除缓存失败:', error)
    }
  }

  onUnmounted(() => {
    // 移除滚动监听
    window.removeEventListener('scroll', handleScroll)
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

  .letter-index {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 2px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px 0 0 20px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    max-height: 80vh; /* 限制最大高度，超出可滚动 */
    overflow-y: auto;

    .letter-item {
      padding: 2px 6px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s;
      margin: 1px 0;
      border-radius: 4px;

      &:hover {
        color: #1890ff;
        background: rgba(24, 144, 255, 0.08);
      }

      &.active {
        color: #fff;
        font-weight: bold;
        background: #1890ff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
      }
    }
  }

  .letter-title {
    position: sticky;
    top: 0;
    background: #f5f5f5;
    padding: 10px 15px;
    margin: 0;
    font-size: 16px;
    color: #333;
    z-index: 1;
    /* 移除所有高亮相关样式 */
  }
</style>
