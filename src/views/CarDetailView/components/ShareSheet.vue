<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:37:51
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-28 16:20:57
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\ShareSheet.vue
 * @Description: 自定义分享弹窗组件
-->
<template>
  <div v-if="visible" class="share-overlay" @click="handleOverlayClick">
    <div class="share-sheet" @click.stop>
      <div class="share-header">
        <h3>{{ $t('share.title') }}</h3>
        <van-icon name="cross" class="close-icon" @click="close" />
      </div>
      
      <div class="share-content">
        <div class="share-grid">
          <div 
            v-for="item in shareOptions" 
            :key="item.type"
            class="share-item"
            @click="handleShare(item.type)"
          >
            <div class="share-icon" :class="item.iconClass">
              <van-icon :name="item.icon" />
            </div>
            <span class="share-label">{{ $t(item.label) }}</span>
          </div>
        </div>
      </div>
      
      <div class="share-footer">
        <button class="cancel-btn" @click="close">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { copyToClipboard } from '@/utils/clipboard'
import { isWechatBrowser, shareToWechat as wxShareToWechat, shareToMoments as wxShareToMoments } from '@/utils/wechat'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  shareData: {
    type: Object,
    default: () => ({
      title: '',
      desc: '',
      link: '',
      image: ''
    })
  }
})

const emit = defineEmits(['update:visible', 'share'])

const shareOptions = computed(() => [
  // {
  //   type: 'wechat',
  //   icon: 'wechat',
  //   iconClass: 'wechat-bg',
  //   label: 'share.wechat'
  // },
  // {
  //   type: 'moments',
  //   icon: 'friends-o',
  //   iconClass: 'moments-bg',
  //   label: 'share.moments'
  // },
  // {
  //   type: 'whatsapp',
  //   icon: 'chat-o',
  //   iconClass: 'whatsapp-bg',
  //   label: 'share.whatsapp'
  // },
  // 复制链接图标选项：
  // - link-o: 链接图标，最直观表示复制链接 (推荐)
  // - copy-o: 通用复制图标，功能准确
  // - share-o: 分享图标，与分享功能语义一致
  // - description: 文档图标，适合复制文本内容
  {
    type: 'copy',
    icon: 'link-o',
    iconClass: 'copy-bg',
    label: 'share.copy'
  },
  // {
  //   type: 'sms',
  //   icon: 'chat-o',
  //   iconClass: 'sms-bg',
  //   label: 'share.sms'
  // },
  // {
  //   type: 'email',
  //   icon: 'envelop-o',
  //   iconClass: 'email-bg',
  //   label: 'share.email'
  // }
])

const close = () => {
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  close()
}

// 复制链接
const copyToClipboardHandler = async (link) => {
  const success = await copyToClipboard(link)
  if (!success) {
    throw new Error('复制失败')
  }
}

const handleShare = async (type) => {
  try {
    const { title, desc, link, image } = props.shareData
    
    switch (type) {
      case 'wechat':
        await shareToWechat(title, desc, link, image)
        break
      case 'moments':
        await shareToMoments(title, desc, link, image)
        break
      case 'whatsapp':
        await shareToWhatsApp(title, desc, link)
        break
      case 'copy':
        await copyToClipboardHandler(link)
        break
      case 'sms':
        await shareViaSMS(title, link)
        break
      case 'email':
        await shareViaEmail(title, desc, link)
        break
    }
    
    emit('share', { type, success: true })
    
    // 根据操作类型显示不同的成功提示语
    if (type === 'copy') {
      showToast(t('share.copySuccess'))
    } else {
      showToast(t('share.success'))
    }
    
    close()
  } catch (error) {
    console.error('分享失败:', error)
    showToast(t('share.error'))
    emit('share', { type, success: false, error })
  }
}

// 分享到微信
const shareToWechat = async (title, desc, link, image) => {
  if (isWechatBrowser()) {
    await wxShareToWechat({ title, desc, link, image })
  } else {
    // 非微信环境，引导用户打开微信
    showToast(t('share.openWechat'))
    throw new Error('非微信环境')
  }
}

// 分享到朋友圈
const shareToMoments = async (title, desc, link, image) => {
  if (isWechatBrowser()) {
    await wxShareToMoments({ title, desc, link, image })
  } else {
    showToast(t('share.openWechat'))
    throw new Error('非微信环境')
  }
}

// 分享到 WhatsApp
const shareToWhatsApp = async (title, desc, link) => {
  const text = `${title}\n${desc}\n${link}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

// 短信分享
const shareViaSMS = async (title, link) => {
  const text = `${title} ${link}`
  const url = `sms:?body=${encodeURIComponent(text)}`
  window.location.href = url
}

// 邮件分享
const shareViaEmail = async (title, desc, link) => {
  const subject = title
  const body = `${desc}\n\n${link}`
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = url
}
</script>

<style lang="scss" scoped>
.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999 !important;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
  pointer-events: auto;
}

.share-sheet {
  width: 100%;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  animation: slideUp 0.3s ease;
  z-index: 100000 !important;
  position: relative;
  pointer-events: auto;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a365d;
  }
  
  .close-icon {
    font-size: 20px;
    color: #999;
    cursor: pointer;
    padding: 4px;
    
    &:hover {
      color: #666;
    }
  }
}

.share-content {
  margin-bottom: 20px;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:active {
    background: #e8e8e8;
  }
}

.share-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 24px;
  color: #fff;
  
  &.wechat-bg {
    background: #07c160;
  }
  
  &.moments-bg {
    background: #1aad19;
  }
  
  &.whatsapp-bg {
    background: #25d366;
  }
  
  &.copy-bg {
    background: #1989fa;
  }
  
  &.sms-bg {
    background: #ff6b35;
  }
  
  &.email-bg {
    background: #ea4335;
  }
}

.share-label {
  font-size: 12px;
  color: #333;
  text-align: center;
}

.share-footer {
  .cancel-btn {
    width: 100%;
    padding: 12px;
    border: none;
    background: #f5f5f5;
    color: #666;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #e8e8e8;
    }
    
    &:active {
      background: #ddd;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

// 移动端适配
@media (max-width: 375px) {
  .share-sheet {
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
  
  .share-grid {
    gap: 16px;
  }
  
  .share-icon {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }
}

// 确保在所有设备上都有正确的层级
@media (max-width: 768px) {
  .share-overlay {
    z-index: 99999;
  }
  
  .share-sheet {
    z-index: 100000;
  }
}

// 针对特定设备的额外优化
@media (max-width: 480px) {
  .share-overlay {
    z-index: 99999;
  }
  
  .share-sheet {
    z-index: 100000;
    margin-bottom: 0;
  }
}
</style> 