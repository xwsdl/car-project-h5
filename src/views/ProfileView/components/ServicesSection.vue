<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 13:57:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-20 00:41:24
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

    <!-- 权限管理服务 -->
    <div class="services-grid">
      <PermissionGuard permission="role_management">
        <div class="service-item">
          <div class="service-icon" @click="handleGoPage('roleManagement')">
            <van-icon name="manager" />
          </div>
          <div class="service-label">{{ $t('profile.services.roleManagement') }}</div>
        </div>
      </PermissionGuard>

      <PermissionGuard permission="user_management">
        <div class="service-item">
          <div class="service-icon" @click="handleGoPage('userManagement')">
            <van-icon name="friends" />
          </div>
          <div class="service-label">{{ $t('profile.services.userManagement') }}</div>
        </div>
      </PermissionGuard>
    </div>

    <!-- 系统配置服务 -->
    <div class="services-grid">
      <PermissionGuard permission="system_config">
        <div class="service-item">
          <div class="service-icon" @click="handleGoPage('permissionManagement')">
            <van-icon name="setting" />
          </div>
          <div class="service-label">{{ $t('permissionManagement.title') }}</div>
        </div>
        <div class="service-item">
          <div class="service-icon" @click="handleGoPage('menuManagement')">
            <van-icon name="menu" />
          </div>
          <div class="service-label">{{ $t('menuManagement.title') }}</div>
        </div>
      </PermissionGuard>
    </div>
  </SectionCard>
</template>

<script setup>
  import { ref } from 'vue'
  import SectionCard from '../common/SectionCard.vue'
  import PermissionGuard from '@/components/PermissionGuard/index.vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()

  // 服务数据
  const services = ref([
    { id: 1, icon: 'service', label: 'customerService' },
    { id: 2, icon: 'description', label: 'myContract' },
    { id: 3, icon: 'records', label: 'relatedData' },
    { id: 4, icon: 'orders-o', label: 'myOrders' },
    { id: 5, icon: 'star-o', label: 'favorite' },
    { id: 6, icon: 'clock-o', label: 'history' }
  ])

  const handleGoPage = icon => {
    console.log('handleGoPage', icon)
    switch (icon) {
      case 'service':
        router.push('/customerService')
        break
      case 'roleManagement':
        router.push('/roleManagement')
        break
      case 'userManagement':
        router.push('/userManagement')
        break
      case 'permissionManagement':
        router.push('/permissionManagement')
        break
      case 'menuManagement':
        router.push('/menuManagement')
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
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

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
