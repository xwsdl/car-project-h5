# 语言切换功能改进

## 概述

本次改进主要解决了切换多语言时页面缓存需要重置的问题，确保切换语言后页面能够重新获取接口请求回来的数据进行展示。

## 问题背景

在原有的语言切换逻辑中，切换语言时只是简单地更新了语言设置，但没有处理以下问题：

1. 页面缓存没有清除，导致显示的还是旧语言的数据
2. 后端返回的数据可能包含语言相关的内容，需要重新获取
3. 页面组件没有重新渲染，导致界面文本没有及时更新

## 解决方案

### 1. 事件总线系统

创建了全局事件总线 `src/utils/eventBus.js`，用于管理全局事件：

```javascript
// 预定义的事件类型
export const EVENT_TYPES = {
  LANGUAGE_CHANGED: 'language_changed',
  DATA_REFRESH_NEEDED: 'data_refresh_needed',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  CACHE_CLEARED: 'cache_cleared'
}
```

### 2. 数据刷新组合式函数

创建了 `src/hooks/useDataRefresh.js` 组合式函数，用于处理页面数据刷新逻辑：

```javascript
export function useDataRefresh(refreshFunction, options = {}) {
  const {
    autoRefresh = true, // 是否自动刷新
    refreshOnLanguageChange = true, // 语言切换时是否刷新
    refreshOnMount = true, // 组件挂载时是否刷新
    debounceTime = 300 // 防抖时间
  } = options
  // ...
}
```

### 3. 增强的语言切换逻辑

修改了 `src/i18n/index.js` 中的 `setLanguage` 函数：

```javascript
export const setLanguage = lang => {
  try {
    // 如果语言没有变化，直接返回
    if (i18n.global.locale.value === lang) {
      return
    }

    // 设置新语言
    i18n.global.locale.value = lang
    localStorage.setItem('language', lang)
    document.querySelector('html').setAttribute('lang', lang)
    Locale.use(lang === 'zh-CN' ? vantZhCN : vantRuRU)

    // 清除所有页面缓存
    clearAllPageCache()
    console.log('已清除所有页面缓存')

    // 触发语言切换事件，通知所有页面重新获取数据
    eventBus.emit(EVENT_TYPES.LANGUAGE_CHANGED, {
      newLanguage: lang,
      oldLanguage: i18n.global.locale.value,
      timestamp: Date.now()
    })

    // 触发数据刷新事件
    eventBus.emit(EVENT_TYPES.DATA_REFRESH_NEEDED, {
      reason: 'language_changed',
      language: lang,
      timestamp: Date.now()
    })

    console.log('语言切换成功:', lang)
  } catch (error) {
    console.error('语言切换失败:', error)
  }
}
```

## 页面集成

### 1. Home页面 (`src/views/Home/index.vue`)

```javascript
// 使用数据刷新组合式函数
useDataRefresh(fetchCardList, {
  autoRefresh: true,
  refreshOnLanguageChange: true,
  refreshOnMount: false, // 手动控制初始加载
  debounceTime: 300
})
```

### 2. Brand页面 (`src/views/Brand/index.vue`)

```javascript
// 强制刷新品牌数据（清除缓存后重新获取）
async function refreshBrandData() {
  // 清除缓存
  clearBrandsCache()
  // 重新加载数据
  await loadAllBrands()
  // 重新加载热门品牌
  await loadHotBrands()
}

// 使用数据刷新组合式函数
useDataRefresh(refreshBrandData, {
  autoRefresh: true,
  refreshOnLanguageChange: true,
  refreshOnMount: false, // 手动控制初始加载
  debounceTime: 300
})
```

### 3. CarDetailView页面 (`src/views/CarDetailView/index.vue`)

```javascript
// 强制刷新车辆详情数据
const refreshCarDetail = () => {
  if (route.query.id) {
    pageInit()
  }
}

// 使用数据刷新组合式函数
useDataRefresh(refreshCarDetail, {
  autoRefresh: true,
  refreshOnLanguageChange: true,
  refreshOnMount: false, // 手动控制初始加载
  debounceTime: 300
})
```

## 测试页面

创建了测试页面 `src/views/Test/index.vue` 来验证语言切换功能：

- 显示当前语言信息
- 显示最后刷新时间
- 模拟根据语言返回不同数据
- 提供手动刷新和清除缓存功能

## 使用方法

### 1. 在页面中使用数据刷新

```javascript
import { useDataRefresh } from '@/hooks/useDataRefresh.js'

// 定义数据获取函数
const fetchData = async () => {
  // 你的数据获取逻辑
}

// 使用数据刷新组合式函数
useDataRefresh(fetchData, {
  autoRefresh: true,
  refreshOnLanguageChange: true,
  refreshOnMount: true,
  debounceTime: 300
})
```

### 2. 手动触发语言切换

```javascript
import { setLanguage } from '@/i18n/index.js'

// 切换到中文
setLanguage('zh-CN')

// 切换到俄语
setLanguage('ru-RU')
```

## 配置选项

### useDataRefresh 选项

| 选项                    | 类型    | 默认值 | 说明               |
| ----------------------- | ------- | ------ | ------------------ |
| autoRefresh             | boolean | true   | 是否自动刷新       |
| refreshOnLanguageChange | boolean | true   | 语言切换时是否刷新 |
| refreshOnMount          | boolean | true   | 组件挂载时是否刷新 |
| debounceTime            | number  | 300    | 防抖时间（毫秒）   |

## 事件类型

### EVENT_TYPES

- `LANGUAGE_CHANGED`: 语言切换事件
- `DATA_REFRESH_NEEDED`: 数据刷新需求事件
- `USER_LOGIN`: 用户登录事件
- `USER_LOGOUT`: 用户登出事件
- `CACHE_CLEARED`: 缓存清除事件

## 注意事项

1. **性能优化**: 使用防抖机制避免频繁刷新
2. **错误处理**: 所有异步操作都有错误处理
3. **内存管理**: 组件卸载时自动清理事件监听
4. **缓存策略**: 根据页面需求选择合适的缓存策略

## 兼容性

- 支持 Vue 3 Composition API
- 支持 TypeScript
- 支持 SSR（服务端渲染）
- 支持移动端和桌面端

## 未来改进

1. 添加更多的缓存策略选项
2. 支持更细粒度的事件控制
3. 添加性能监控和统计
4. 支持更多的语言切换场景
