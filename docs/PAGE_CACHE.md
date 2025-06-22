# 页面缓存功能使用指南

## 概述

本项目实现了基于 `keep-alive` 和 `sessionStorage` 的页面缓存功能，可以保持用户在页面间的筛选条件、滚动位置等状态，提升用户体验。

## 功能特性

- ✅ 自动缓存页面状态（筛选条件、数据等）
- ✅ 支持动态缓存管理
- ✅ 缓存过期时间控制（默认30分钟）
- ✅ 开发环境缓存管理工具
- ✅ 支持手动清除缓存
- ✅ 组合式函数封装，易于使用

## 实现原理

### 1. Keep-Alive 组件缓存

- 使用 Vue 3 的 `keep-alive` 组件包装 `router-view`
- 通过 `include` 属性控制需要缓存的组件
- 组件名称必须与路由的 `name` 属性一致

### 2. 本地存储缓存

- 使用 `sessionStorage` 存储页面状态
- 支持缓存过期时间控制
- 自动清理过期缓存

## 使用方法

### 1. 路由配置

在路由配置中添加 `keepAlive` 属性：

```javascript
{
  path: '/home',
  name: 'homeIndex',
  component: () => import('@/views/Home/index.vue'),
  meta: {
    title: '首页',
    keepAlive: true, // 需要缓存
  },
}
```

### 2. 组件中使用缓存

#### 方式一：手动管理（推荐用于复杂场景）

```vue
<script setup>
import { savePageState, restorePageState } from '@/utils/cache.js'
import { ref, onMounted, activated, deactivated } from 'vue'

// 页面状态
const formData = ref({})
const cars = ref([])

onMounted(() => {
  // 尝试从缓存恢复状态
  const cachedState = restorePageState('homeIndex')
  if (cachedState) {
    formData.value = cachedState.formData
    cars.value = cachedState.cars
  } else {
    // 没有缓存，初始化数据
    fetchData()
  }
})

// 页面激活时触发
activated(() => {
  console.log('页面被激活')
})

// 页面失活时触发
deactivated(() => {
  // 保存当前状态
  savePageState('homeIndex', {
    formData: formData.value,
    cars: cars.value
  })
})
</script>
```

#### 方式二：使用组合式函数（推荐用于简单场景）

```vue
<script setup>
import { usePageCache } from '@/hooks/usePageCache.js'

// 使用缓存管理
const { pageState, updateState, clearCache } = usePageCache('homeIndex', {
  formData: {},
  cars: [],
  sortValue: 0
})

// 更新状态会自动保存到缓存
const handleSortChange = (type) => {
  updateState({
    sortValue: type,
    formData: { ...pageState.value.formData, sortBy: type }
  })
}
</script>
```

### 3. 缓存管理工具

#### 开发环境缓存管理

在开发环境中，页面右下角会显示"缓存管理"按钮，点击可以：

- 查看当前缓存状态
- 清除指定页面缓存
- 清除所有缓存
- 刷新缓存信息

#### 手动清除缓存

```javascript
import { clearPageCache, clearAllPageCache } from '@/utils/cache.js'

// 清除指定页面缓存
clearPageCache('homeIndex')

// 清除所有缓存
clearAllPageCache()
```

## 缓存配置

### 1. 缓存页面列表

在 `src/views/Layout/index.vue` 中配置需要缓存的页面：

```javascript
const cachedViews = ref(['homeIndex', 'orderProcess', 'message', 'profile'])
```

### 2. 缓存选项

使用 `usePageCache` 时可以配置缓存选项：

```javascript
const { pageState } = usePageCache('homeIndex', initialState, {
  maxAge: 30 * 60 * 1000, // 缓存过期时间（毫秒）
  autoRestore: true,      // 自动恢复状态
  autoSave: true,         // 自动保存状态
  clearOnUnmount: false   // 组件卸载时是否清除缓存
})
```

## 最佳实践

### 1. 合理使用缓存

- 只对需要保持状态的页面启用缓存
- 避免缓存大量数据，影响性能
- 及时清理不需要的缓存

### 2. 状态管理

- 只缓存必要的状态数据
- 避免缓存敏感信息
- 考虑数据大小和缓存时间

### 3. 用户体验

- 在页面激活时显示加载状态
- 提供清除缓存的选项
- 考虑网络环境，合理设置缓存策略

## 注意事项

1. **组件名称**：确保组件名称与路由名称一致
2. **数据序列化**：缓存的数据必须可以被 JSON 序列化
3. **内存管理**：避免缓存过大的数据对象
4. **浏览器兼容性**：`sessionStorage` 在大多数现代浏览器中支持良好

## 故障排除

### 1. 缓存不生效

- 检查组件名称是否正确
- 确认路由配置中 `keepAlive` 为 `true`
- 检查 `cachedViews` 数组是否包含该页面

### 2. 状态丢失

- 检查 `sessionStorage` 是否可用
- 确认数据序列化是否正常
- 检查缓存是否过期

### 3. 性能问题

- 减少缓存数据量
- 缩短缓存过期时间
- 定期清理无用缓存

## 相关文件

- `src/utils/cache.js` - 缓存管理工具函数
- `src/hooks/usePageCache.js` - 缓存管理组合式函数
- `src/components/CacheManager/index.vue` - 缓存管理组件
- `src/views/Layout/index.vue` - 布局组件（包含 keep-alive）
- `src/router/index.js` - 路由配置
