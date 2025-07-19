<template>
  <van-uploader
    v-model="fileList"
    :accept="accept"
    :max-count="maxCount"
    :disabled="disabled"
    :after-read="handleAfterRead"
    :show-upload="showUpload"
  >
    <template #default>
      <div class="custom-upload-btn">
        <van-icon name="plus" size="48" />
        <div class="upload-text">{{ buttonText || $t('orderDetail.uploadAttachment') }}</div>
      </div>
    </template>
  </van-uploader>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Uploader as VanUploader, Icon as VanIcon } from 'vant'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  accept: { type: String, default: 'image/*' },
  maxCount: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  buttonText: { type: String, default: '' },
  showUpload: { type: Boolean, default: true },
  onUpload: { type: Function }
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

const fileList = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (val) => { fileList.value = [...val] }
)

const handleAfterRead = async (file) => {
  if (props.onUpload) {
    const result = await props.onUpload(file)
    emit('uploaded', result)
  }
  emit('update:modelValue', fileList.value)
}
</script>

<style scoped>
.custom-upload-btn {
  width: 88px;
  height: 88px;
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  margin: 8px 0;
}
.custom-upload-btn:active {
  box-shadow: 0 4px 12px rgba(24,144,255,0.08);
  border-color: #1890ff;
}
.custom-upload-btn .van-icon {
  color: #bfc4cc;
  font-size: 36px;
  margin-bottom: 8px;
}
.upload-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
