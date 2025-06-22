<template>
  <div v-if="showCacheManager" class="cache-manager">
    <div class="cache-manager__header">
      <h3>页面缓存管理</h3>
      <van-button size="small" @click="toggleVisible">关闭</van-button>
    </div>

    <div class="cache-manager__content">
      <div class="cache-info">
        <p>缓存页面数量: {{ cacheInfo.total }}</p>
        <p>缓存页面: {{ cacheInfo.pages.join(', ') || '无' }}</p>
      </div>

      <div class="cache-actions">
        <van-button size="small" type="primary" @click="refreshCacheInfo">
          刷新缓存信息
        </van-button>
        <van-button size="small" type="danger" @click="clearAllCacheHandler">
          清除所有缓存
        </van-button>
      </div>

      <div class="cache-list">
        <div v-for="page in cacheInfo.pages" :key="page" class="cache-item">
          <span>{{ page }}</span>
          <van-button size="mini" type="danger" @click="clearPageCacheHandler(page)">
            清除
          </van-button>
        </div>
      </div>
    </div>
  </div>

  <!-- 开发环境显示缓存管理按钮 -->
  <div v-if="isDev && !showCacheManager" class="cache-manager__toggle">
    <van-button size="small" @click="toggleVisible">
      缓存管理
    </van-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCacheInfo, clearPageCache, clearAllPageCache } from '@/utils/cache.js'

// 定义组件名称
defineOptions({
  name: 'CacheManager'
})

const showCacheManager = ref(false)
const cacheInfo = ref({ total: 0, pages: [] })

// 判断是否为开发环境
const isDev = computed(() => {
  return import.meta.env.DEV
})

// 切换显示状态
const toggleVisible = () => {
  showCacheManager.value = !showCacheManager.value
  if (showCacheManager.value) {
    refreshCacheInfo()
  }
}

// 刷新缓存信息
const refreshCacheInfo = () => {
  cacheInfo.value = getCacheInfo()
}

// 清除指定页面缓存
const clearPageCacheHandler = (pageName) => {
  clearPageCache(pageName)
  refreshCacheInfo()
}

// 清除所有缓存
const clearAllCacheHandler = () => {
  clearAllPageCache()
  refreshCacheInfo()
}

onMounted(() => {
  refreshCacheInfo()
})
</script>

<style lang="scss" scoped>
.cache-manager {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  max-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #e8e8e8;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  &__content {
    padding: 16px;
    max-height: 300px;
    overflow-y: auto;
  }

  &__toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9998;
  }
}

.cache-info {
  margin-bottom: 16px;

  p {
    margin: 4px 0;
    font-size: 14px;
    color: #666;
  }
}

.cache-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.cache-list {
  .cache-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
