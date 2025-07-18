<template>
  <div class="order-progress-steps">
    <van-steps
      direction="vertical"
      :active="activeStep"
      active-color="#1890ff"
      inactive-color="#bbb"
    >
      <van-step
        v-for="(item, idx) in progressData"
        :key="item.id"
        :title="item.title"
        :description="item.time"
      >
        <template #icon>
          <div
            class="custom-step-icon"
            :class="{
              active: idx === activeStep,
              completed: item.status === 'completed'
            }"
          >
            <template v-if="item.status === 'completed'">
              <van-icon name="success" />
            </template>
            <template v-else>
              {{ idx + 1 }}
            </template>
          </div>
        </template>
        <div class="step-content">
          <div class="desc">{{ item.description }}</div>
          <div v-if="item.status === 'processing' && canUpload(item)" class="upload-area">
            <AttachmentUploader
              v-model="item.attachments"
              :accept="'image/*,application/pdf'"
              :max-count="3"
              :button-text="$t('orderDetail.uploadAttachment')"
              @uploaded="onAttachmentUploaded"
            />
          </div>
          <div v-else-if="item.attachments && item.attachments.length" class="attachments">
            <div class="attachments-title">{{ $t('orderDetail.attachments') }}</div>
            <div class="attachments-list">
              <div
                v-for="att in item.attachments"
                :key="att.id"
                class="attachment-item"
                @click="previewAttachment(att)"
              >
                <van-icon :name="getAttachmentIcon(att.type)" :class="att.type" />
                <span>{{ att.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-step>
    </van-steps>
  </div>
</template>

<script setup>
  import { Steps as VanSteps, Step as VanStep, Icon as VanIcon, showToast } from 'vant'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AttachmentUploader from './AttachmentUploader.vue'
  const { t: $t } = useI18n()

  const props = defineProps({
    progressData: {
      type: Array,
      default: () => []
    }
  })

  const activeStep = computed(() => {
    const idx = props.progressData.findIndex(i => i.status !== 'completed')
    return idx === -1 ? props.progressData.length - 1 : idx
  })

  const getAttachmentIcon = type => {
    const iconMap = {
      pdf: 'description',
      image: 'photo-o',
      doc: 'description',
      xls: 'description',
      txt: 'description'
    }
    return iconMap[type] || 'description'
  }

  const previewAttachment = att => {
    showToast('预览/下载功能')
  }

  const canUpload = (item) => {
    // TODO: 根据实际业务判断当前用户是否有上传权限
    // 例如 return item.form && item.form.uploader === userRole
    return true
  }
  const onAttachmentUploaded = (result) => {
    // TODO: 上传成功后的处理逻辑，如刷新数据、提示等
  }
</script>

<style scoped>
  .order-progress-steps {
    padding: 16px;
  }
  .custom-step-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #bbb;
    background: #fff;
    color: #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s;
  }
  .custom-step-icon.active {
    border-color: #1890ff;
    color: #1890ff;
    background: #fff;
  }
  .custom-step-icon.completed {
    border-color: #52c41a;
    color: #52c41a;
    background: #fff;
  }
  .custom-step-icon .van-icon {
    font-size: 18px;
  }
  .step-content {
    margin-top: 8px;
  }
  .attachments-title {
    font-size: 14px;
    font-weight: 500;
    margin: 8px 0 4px 0;
  }
  .attachment-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    cursor: pointer;
  }
  .attachment-item .van-icon {
    margin-right: 6px;
  }
</style>
