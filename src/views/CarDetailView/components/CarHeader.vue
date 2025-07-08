<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:37:51
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-28 16:11:13
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\CarHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="car-header">
    <div class="nav-bar">
      <van-icon name="arrow-left" class="nav-icon" @click="goBack" />
      <div class="nav-title">{{ $t('detail.title') }}</div>
      <van-icon name="share-o" class="nav-icon" @click="showShare" />
    </div>
    
    <!-- 自定义分享弹窗 -->
    <ShareSheet
      v-model:visible="shareVisible"
      :share-data="shareData"
      @share="handleShareResult"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ShareSheet from './ShareSheet.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 分享弹窗状态
const shareVisible = ref(false)

// 分享数据
const shareData = computed(() => {
  const carInfo = route.params.carInfo || {}
  return {
    title: carInfo.title || t('detail.defaultTitle'),
    desc: carInfo.desc || t('detail.defaultDesc'),
    link: window.location.href,
    image: carInfo.image || carInfo.coverImage || ''
  }
})

const goBack = () => {
  router.go(-1)
}

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

<style lang="scss" scoped>
.car-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }

  .nav-title {
    font-size: 18px;
    font-weight: bold;
    color: #1a365d;
  }

  .nav-icon {
    font-size: 20px;
    color: #1a365d;
    cursor: pointer;
  }
}
</style>