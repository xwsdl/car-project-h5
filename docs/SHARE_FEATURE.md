# 分享功能使用文档

## 概述

本项目实现了一个自定义的分享功能，支持多种分享方式，包括微信好友、朋友圈、WhatsApp、复制链接、短信和邮件分享。

## 功能特性

- 🎨 自定义 UI 设计，不使用 Vant 分享组件
- 🌍 支持多语言（中文、俄语）
- 📱 移动端优化
- 🔗 多种分享方式
- 📋 跨浏览器复制功能
- 💬 微信环境检测和适配
- 🎯 高层级显示，确保不被其他元素覆盖

## 支持的分享方式

1. **微信好友** - 在微信环境中使用微信 JS-SDK
2. **朋友圈** - 分享到微信朋友圈
3. **WhatsApp** - 通过 WhatsApp 分享
4. **复制链接** - 复制当前页面链接到剪贴板
5. **短信** - 通过短信应用分享
6. **邮件** - 通过邮件应用分享

## 层级管理

### 分享弹窗层级设置

分享弹窗使用了极高的 z-index 值，确保在所有页面元素之上：

```scss
.share-overlay {
  z-index: 99999 !important; // 遮罩层
}

.share-sheet {
  z-index: 100000 !important; // 弹窗内容
}
```

### 层级优先级说明

- **分享弹窗内容**: z-index: 100000 (最高优先级)
- **分享弹窗遮罩**: z-index: 99999
- **底部按钮 (ActionBar)**: z-index: 100 (较低优先级)
- **其他页面元素**: z-index < 100

### 安全区域适配

```scss
padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
```

支持 iPhone 等设备的底部安全区域，确保弹窗内容不被遮挡。

## 使用方法

### 1. 在组件中使用

```vue
<template>
  <div>
    <!-- 分享按钮 -->
    <van-icon name="share-o" @click="showShare" />
    
    <!-- 分享弹窗 -->
    <ShareSheet
      v-model:visible="shareVisible"
      :share-data="shareData"
      @share="handleShareResult"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ShareSheet from '@/views/CarDetailView/components/ShareSheet.vue'

const shareVisible = ref(false)

// 分享数据
const shareData = computed(() => ({
  title: '汽车标题',
  desc: '汽车描述',
  link: window.location.href,
  image: 'https://example.com/car-image.jpg'
}))

const showShare = () => {
  shareVisible.value = true
}

const handleShareResult = ({ type, success, error }) => {
  if (success) {
    console.log(`分享成功: ${type}`)
  } else {
    console.error(`分享失败: ${type}`, error)
  }
}
</script>
```

### 2. 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| visible | Boolean | false | 控制弹窗显示/隐藏 |
| shareData | Object | {} | 分享数据对象 |

### 3. 分享数据格式

```javascript
{
  title: '分享标题',
  desc: '分享描述',
  link: '分享链接',
  image: '分享图片URL'
}
```

### 4. 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:visible | Boolean | 弹窗显示状态变化 |
| share | Object | 分享结果回调 |

分享结果对象格式：
```javascript
{
  type: 'wechat' | 'moments' | 'whatsapp' | 'copy' | 'sms' | 'email',
  success: Boolean,
  error?: Error
}
```

## 工具函数

### 剪贴板工具 (`src/utils/clipboard.js`)

```javascript
import { copyToClipboard, isClipboardSupported } from '@/utils/clipboard'

// 复制文本
const success = await copyToClipboard('要复制的文本')

// 检查是否支持剪贴板
const supported = isClipboardSupported()
```

### 微信分享工具 (`src/utils/wechat.js`)

```javascript
import { 
  isWechatBrowser, 
  shareToWechat, 
  shareToMoments,
  autoInitWechatShare 
} from '@/utils/wechat'

// 检查是否在微信中
const inWechat = isWechatBrowser()

// 分享到微信好友
await shareToWechat({
  title: '标题',
  desc: '描述',
  link: '链接',
  image: '图片'
})

// 自动初始化微信分享
await autoInitWechatShare({
  title: '默认标题',
  desc: '默认描述',
  link: '默认链接',
  image: '默认图片'
})
```

## 多语言配置

分享功能支持中文和俄语两种语言，相关翻译文本在以下文件中：

- 中文：`src/i18n/locales/zh-CN.json`
- 俄语：`src/i18n/locales/ru-RU.json`

### 中文翻译键值

```json
{
  "share": {
    "title": "分享到",
    "wechat": "微信好友",
    "moments": "朋友圈",
    "whatsapp": "WhatsApp",
    "copy": "复制链接",
    "sms": "短信",
    "email": "邮件",
    "success": "分享成功",
    "error": "分享失败",
    "openWechat": "请在微信中打开"
  }
}
```

## 微信分享配置

要在微信中使用分享功能，需要：

1. **引入微信 JS-SDK**
   ```html
   <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
   ```

2. **后端配置接口**
   创建 `/api/wechat/config` 接口，返回微信 JS-SDK 配置：
   ```javascript
   {
     appId: 'your-app-id',
     timestamp: 'timestamp',
     nonceStr: 'nonce-str',
     signature: 'signature'
   }
   ```

3. **初始化分享**
   ```javascript
   import { autoInitWechatShare } from '@/utils/wechat'
   
   // 在页面加载时初始化
   autoInitWechatShare({
     title: '默认分享标题',
     desc: '默认分享描述',
     link: window.location.href,
     image: '默认分享图片'
   })
   ```

## 样式定制

分享弹窗的样式可以通过修改 `ShareSheet.vue` 组件的样式部分来自定义：

- 弹窗背景色：`.share-sheet`
- 分享图标颜色：`.share-icon`
- 动画效果：`@keyframes fadeIn` 和 `@keyframes slideUp`

## 注意事项

1. **微信分享**：需要在微信环境中才能正常使用
2. **HTTPS 要求**：现代浏览器的剪贴板 API 需要 HTTPS 环境
3. **移动端适配**：已针对移动端进行了优化
4. **错误处理**：所有分享操作都包含错误处理机制
5. **降级方案**：提供了多种降级方案确保兼容性
6. **层级管理**：使用极高的 z-index 值确保弹窗显示在最顶层

## 常见问题

### Q: 复制功能在某些浏览器中不工作？
A: 现代浏览器需要 HTTPS 环境才能使用 Clipboard API，项目提供了降级方案。

### Q: 微信分享在非微信环境中如何处理？
A: 会提示用户"请在微信中打开"，引导用户使用微信访问。

### Q: 分享弹窗被其他元素覆盖怎么办？
A: 分享弹窗使用了极高的 z-index 值（99999/100000），并使用了 `!important` 确保优先级。如果仍有问题，请检查是否有其他元素使用了更高的 z-index。

### Q: 如何添加新的分享方式？
A: 在 `ShareSheet.vue` 的 `shareOptions` 中添加新选项，并在 `handleShare` 方法中实现对应的分享逻辑。

### Q: 如何自定义分享弹窗样式？
A: 直接修改 `ShareSheet.vue` 组件中的 `<style>` 部分。

## 测试建议

1. 测试不同浏览器的复制功能
2. 测试移动端和桌面端的显示效果
3. 测试多语言切换功能
4. 测试分享链接的有效性
5. 测试弹窗层级是否正确显示
6. 测试在不同设备上的安全区域适配 