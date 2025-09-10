<template>
  <div class="order-progress-steps">
    <van-steps
      direction="vertical"
      :active="activeStep"
      active-color="#1890ff"
      inactive-color="#bbb"
    >
      <van-step v-for="item in progressData" :key="item.id">
        <div class="step-content">
          <div class="desc">{{ item.processDesc }}</div>
          <div
            v-if="Array.isArray(item.attachments) && item.attachments.length > 0"
            class="attachments"
          >
            <div class="attachments-title">{{ $t('orderDetail.attachments') }}</div>
            <div class="attachments-list">
              <div
                v-for="att in item.attachments"
                :key="att.id"
                class="attachment-item"
                @click="previewAttachment(att)"
              >
                <van-icon :name="getAttachmentIcon(att.fileType)" />
                <div class="attachment-info">
                  <div class="attachment-name">{{ att.fileName }}</div>
                  <div class="attachment-meta">
                    <span class="upload-time">{{ att.uploadTime }}</span>
                    <span class="upload-user" v-if="att.uploadUserId">
                      ID: {{ att.uploadUserId }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.isCompleteSign === 2 && canUpload(item)" class="attachments upload-area">
            <div class="attachments-header">
              <div class="attachments-title">{{ $t('orderDetail.uploadAttachment') }}</div>
              <AttachmentUploader
                :accept="'video/*,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                :max-count="6"
                :button-text="$t('orderDetail.uploadAttachment')"
                @uploaded="onAttachmentUploaded"
                :onUpload="uploadAttachmentsCallBack(item.id)"
              />
            </div>
          </div>

          <!-- 节点操作区域 -->
          <div
            class="step-node__action"
            v-if="
              item.isCompleteSign === 2 &&
              item.attachments.length &&
              showRoleTabbar('customer_service')
            "
          >
            <van-button type="primary" size="small" @click="handleNodeAction(3, item.id)">
              通过
            </van-button>
            <van-button
              style="margin-left: 5px"
              type="default"
              size="small"
              @click="handleNodeAction(1, item.id)"
            >
              不通过
            </van-button>
          </div>
        </div>
      </van-step>
    </van-steps>
  </div>
</template>

<script setup>
  import { uploadAttachments, completeProcessNodes } from '@/api'
  import { Steps as VanSteps, Step as VanStep, Icon as VanIcon, showToast } from 'vant'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AttachmentUploader from './AttachmentUploader.vue'
  import { useAuthStore } from '@/stores/auth'
  import { showImagePreview } from 'vant'
  const { t: $t } = useI18n()
  const authStore = useAuthStore()
  const props = defineProps({
    progressData: {
      type: Array,
      default: () => []
    }
  })
  const emit = defineEmits(['refresh'])
  console.log(props.progressData)
  const activeStep = computed(() => {
    const idx = props.progressData.findIndex(i => +i.isCompleteSign === 2)
    return idx === -1 ? props.progressData.length - 1 : idx
  })

  const getAttachmentIcon = type => {
    const iconMap = {
      // pdf: 'description',
      // image: 'photo-o',
      // doc: 'description',
      // xls: 'description',
      // txt: 'description',

      'application/pdf': 'PDF文档',
      'image/jpeg': 'photo-o',
      'image/png': 'photo-o',
      'image/gif': 'photo-o',
      'image/webp': 'photo-o',
      'image/svg+xml': 'photo-o',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
      'application/vnd.ms-excel': 'description',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'description',
      'application/vnd.ms-powerpoint': 'description',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'description'
    }
    return iconMap[type] || 'description'
  }

  // 支持的图片类型
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

  /**
   * 附件预览：图片用 ImagePreview，其他类型下载或新窗口打开
   * @param {Object} att 附件对象，需包含 filePath、fileType、fileName、id
   */
  const previewAttachment = att => {
    if (!att || !att.filePath) {
      showToast($t('orderDetail.previewFailed') || '预览失败')
      return
    }
    if (imageTypes.includes(att.fileType)) {
      // 多图预览，收集所有图片类型附件
      const allImages = props.progressData
        .flatMap(item => item.attachments || [])
        .filter(a => imageTypes.includes(a.fileType))
      const urls = allImages.map(a => a.filePath)
      const startIndex = allImages.findIndex(a => a.id === att.id)
      console.log(urls, 'urls')
      showImagePreview({
        images: urls,
        startPosition: startIndex >= 0 ? startIndex : 0,
        closeable: true
      })
    } else {
      // 其他类型优先下载，失败则新窗口打开
      try {
        const link = document.createElement('a')
        link.href = att.filePath
        link.download = att.fileName || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch {
        window.open(att.filePath, '_blank')
      }
    }
  }

  const canUpload = item => {
    // TODO: 根据实际业务判断当前用户是否有上传权限
    // 例如 return item.form && item.form.uploader === userRole
    console.log('canUpload:', item.canaction === authStore.user.roleName)
    return item.canaction === authStore.user.roleName
  }
  const showRoleTabbar = roleName => {
    return authStore?.user?.roleName === roleName || false
  }
  const onAttachmentUploaded = result => {
    console.log('上传成功:', result)
    // TODO: 上传成功后的处理逻辑，如刷新数据、提示等
  }

  // 文件上传
  const uploadAttachmentsCallBack = processNodeId => {
    return file => {
      const FromData = new FormData()
      FromData.append('file', file)
      FromData.append('processNodeId', processNodeId)
      FromData.append('userId', authStore.user.id)
      uploadAttachments(FromData).then(res => {
        if (res) {
          showToast($t('orderDetail.uploadSuccess'))
          setTimeout(() => {
            emit('refresh')
          }, 200)
        }
      })
    }
  }

  const handleNodeAction = (status, nodeId) => {
    const params = {
      csAction: status,
      nodeId,
      userId: authStore.user.id
    }
    completeProcessNodes(params).then(res => {
      if (res) {
        showToast($t('orderDetail.operationSuccess'))
        setTimeout(() => {
          emit('refresh')
        }, 200)
      }
    })
  }
</script>

<style scoped lang="scss">
  .order-progress-steps {
    padding: 16px;
  }

  .step-content {
    margin-top: 8px;
  }

  .desc {
    font-size: 15px;
    color: #333;
    margin-bottom: 12px;
  }

  .attachments {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
    margin-top: 8px;
  }

  .attachments.upload-area {
    background: #f0f7ff;
    border: 1px dashed #1890ff;
  }

  .attachments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .attachments-title {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin: 0;
  }

  .attachments-list {
    margin-top: 8px;
  }

  .attachment-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    padding: 10px;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .attachment-item:hover {
    background: #f0f2f5;
  }

  .attachment-item:last-child {
    margin-bottom: 0;
  }

  .attachment-item .van-icon {
    margin-right: 12px;
    margin-top: 2px;
    font-size: 20px;
    color: #1890ff;
  }

  .attachment-info {
    flex: 1;
    min-width: 0;
  }

  .attachment-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    word-break: break-all;
    line-height: 1.4;
  }

  .attachment-meta {
    font-size: 12px;
    color: #999;
    display: flex;
    gap: 12px;
    line-height: 1.4;
  }

  .upload-time,
  .upload-user {
    display: flex;
    align-items: center;
  }

  .upload-status {
    color: #1890ff;
  }

  .step-node {
    &__action {
      margin-top: 8px;
    }
  }
</style>
