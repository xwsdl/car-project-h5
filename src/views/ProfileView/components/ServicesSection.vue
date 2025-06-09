<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 13:57:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-05 23:08:32
 * @FilePath: \car-h5-project\src\views\ProfileView\components\ServicesSection.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <SectionCard class="services-section">
    <template #header>
      <div class="section-title">
        <span>{{ $t('profile.services.title') }}</span>
      </div>
    </template>

    <div class="services-grid">
      <div v-for="service in services" :key="service.id" class="service-item">
        <div class="service-icon" @click="handleGoPage(service.icon)">
          <van-icon :name="service.icon" />
        </div>
        <div class="service-label">{{ $t(`profile.services.${service.label}`) }}</div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup>
import { ref } from 'vue'
import SectionCard from '../common/SectionCard.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// 服务数据
const services = ref([
  { id: 1, icon: 'service', label: 'customerService' },
  { id: 2, icon: 'chat', label: 'message' },
  { id: 3, icon: 'friends', label: 'partners' },
  { id: 4, icon: 'location', label: 'address' },
  { id: 5, icon: 'star', label: 'favorite' },
  { id: 6, icon: 'coupon', label: 'coupon' },
  { id: 7, icon: 'balance', label: 'balance' },
  { id: 8, icon: 'setting', label: 'settings' },
])

const handleGoPage = (icon) => {
  console.log('handleGoPage', icon)
  switch (icon) {
    case 'service':
      router.push('/customerService')
      break
    case 'chat':
      break
    case 'friends':
      break
  }
}
</script>

<style lang="scss" scoped>
.services-section {
  margin-top: 20px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  text-align: center;

  .service-item {
    padding: 10px 0;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-3px);
    }

    .service-icon {
      width: 40px;
      height: 40px;
      background: #f0f7ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px;
      color: #3498db;
      font-size: 18px;
    }

    .service-label {
      font-size: 13px;
    }
  }
}
</style>