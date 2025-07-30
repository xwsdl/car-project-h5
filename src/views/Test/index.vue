<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-07-11 23:48:51
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-12 18:49:10
 * @FilePath: \car-project-h5\src\views\Test\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="test-page">
    <div class="test-header">
      <h1>{{ $t('test.title') }}</h1>
      <p>{{ $t('test.description') }}</p>
    </div>

    <div class="test-content">
      <div class="test-section">
        <h2>{{ $t('test.languageInfo') }}</h2>
        <p>{{ $t('test.currentLanguage') }}: {{ currentLanguage }}</p>
        <p>{{ $t('test.lastRefresh') }}: {{ lastRefreshTime }}</p>
      </div>

      <div class="test-section">
        <h2>{{ $t('test.dataInfo') }}</h2>
        <div v-if="loading" class="loading">
          {{ $t('test.loading') }}
        </div>
        <div v-else-if="error" class="error">{{ $t('test.error') }}: {{ error }}</div>
        <div v-else class="data-list">
          <div v-for="item in testData" :key="item.id" class="data-item">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>{{ $t('test.actions') }}</h2>
        <van-button type="primary" @click="refreshData">
          {{ $t('test.refreshData') }}
        </van-button>
        <van-button type="success" @click="clearCache">
          {{ $t('test.clearCache') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useDataRefresh } from '@/hooks/useDataRefresh.js'
  import { clearAllPageCache } from '@/utils/cache.js'
  import { showToast } from 'vant'

  // 定义组件名称
  defineOptions({
    name: 'TestPage'
  })

  const { t: $t, locale } = useI18n()

  // 响应式数据
  const loading = ref(false)
  const error = ref(null)
  const testData = ref([])
  const lastRefreshTime = ref('')

  // 获取当前语言
  const currentLanguage = ref(locale.value)

  // 模拟数据获取函数
  const fetchTestData = async () => {
    loading.value = true
    error.value = null

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟根据语言返回不同数据
      const data =
        locale.value === 'zh-CN'
          ? [
              {
                id: 1,
                title: '中文测试数据',
                description: '这是中文语言环境下的测试数据'
              },
              {
                id: 2,
                title: '中文测试项目',
                description: '用于验证语言切换功能的数据'
              }
            ]
          : [
              {
                id: 1,
                title: 'Russian Test Data',
                description: 'This is test data for Russian language environment'
              },
              {
                id: 2,
                title: 'Russian Test Item',
                description: 'Data for verifying language switching functionality'
              }
            ]

      testData.value = data
      lastRefreshTime.value = new Date().toLocaleString()

      console.log('测试数据已刷新:', data)
    } catch (err) {
      error.value = err.message
      console.error('获取测试数据失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 手动刷新数据
  const refreshData = () => {
    fetchTestData()
    showToast($t('test.refreshSuccess'))
  }

  // 清除缓存
  const clearCache = () => {
    clearAllPageCache()
    showToast($t('test.cacheCleared'))
  }

  // 使用数据刷新组合式函数
  useDataRefresh(fetchTestData, {
    autoRefresh: true,
    refreshOnLanguageChange: true,
    refreshOnMount: true,
    debounceTime: 300
  })

  // 监听语言变化
  onMounted(() => {
    // 初始加载数据
    fetchTestData()
  })
</script>

<style lang="scss" scoped>
  .test-page {
    padding: 16px;
    background: #f5f7fa;
    min-height: 100vh;
  }

  .test-header {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 16px;
    text-align: center;

    h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 8px;
    }

    p {
      color: #666;
      font-size: 14px;
    }
  }

  .test-content {
    .test-section {
      background: #fff;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 16px;

      h2 {
        font-size: 18px;
        color: #333;
        margin-bottom: 12px;
      }

      p {
        color: #666;
        margin-bottom: 8px;
      }
    }
  }

  .loading {
    text-align: center;
    color: #1989fa;
    padding: 20px;
  }

  .error {
    color: #ee0a24;
    padding: 12px;
    background: #fef0f0;
    border-radius: 8px;
  }

  .data-list {
    .data-item {
      padding: 12px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 8px;

      h3 {
        font-size: 16px;
        color: #333;
        margin-bottom: 4px;
      }

      p {
        color: #666;
        font-size: 14px;
      }
    }
  }

  .van-button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
