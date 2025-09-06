<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\UserManagement\components\UserDetail.vue
 * @Description: 用户详情页面
-->
<template>
  <div class="user-detail">
    <van-nav-bar :title="$t('userManagement.userDetail')" left-arrow @click-left="$emit('close')" />

    <div class="content">
      <van-cell-group inset :title="$t('userManagement.basicInfo')">
        <van-cell :title="$t('userManagement.username')" :value="user.username" />
        <van-cell :title="$t('userManagement.email')" :value="user.email" />
        <van-cell :title="$t('userManagement.phone')" :value="user.phone || '-'" />
        <van-cell :title="$t('userManagement.status')">
          <template #value>
            <van-tag :type="getUserStatusColor(user.status)" size="small">
              {{ $t(`userManagement.status.${user.status}`) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell
          :title="$t('userManagement.role')"
          :value="$t(`roleManagement.roleTypes.${user.role}`)"
        />
        <van-cell :title="$t('userManagement.createTime')" :value="formatDate(user.createTime)" />
        <van-cell
          :title="$t('userManagement.lastLoginTime')"
          :value="formatDate(user.lastLoginTime) || '-'"
        />
      </van-cell-group>

      <van-cell-group inset :title="$t('userManagement.permissions')">
        <van-cell v-for="permission in userPermissions" :key="permission" :title="permission" />
      </van-cell-group>

      <van-cell-group inset :title="$t('userManagement.operationHistory')">
        <van-cell
          v-for="operation in userOperations"
          :key="operation.id"
          :title="operation.action"
          :label="operation.description"
        >
          <template #value>
            <span class="operation-time">{{ formatDate(operation.time) }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['close'])

  // 用户状态颜色映射
  const getUserStatusColor = status => {
    const colorMap = {
      active: 'success',
      inactive: 'default',
      suspended: 'warning',
      deleted: 'danger'
    }
    return colorMap[status] || 'default'
  }

  // 格式化日期
  const formatDate = dateStr => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString()
  }

  // 用户权限列表（模拟数据）
  const userPermissions = computed(() => {
    const permissionMap = {
      normal: ['basic_access'],
      customerService: ['basic_access', 'customer_service'],
      admin: ['basic_access', 'role_management', 'user_management'],
      superAdmin: [
        'basic_access',
        'customer_service',
        'role_management',
        'user_management',
        'order_management',
        'system_config'
      ]
    }
    return permissionMap[props.user.role] || []
  })

  // 用户操作历史（模拟数据）
  const userOperations = computed(() => [
    {
      id: 1,
      action: t('userManagement.operations.login'),
      description: t('userManagement.operationDescriptions.login'),
      time: '2025-01-20 10:30:00'
    },
    {
      id: 2,
      action: t('userManagement.operations.updateProfile'),
      description: t('userManagement.operationDescriptions.updateProfile'),
      time: '2025-01-19 15:20:00'
    },
    {
      id: 3,
      action: t('userManagement.operations.resetPassword'),
      description: t('userManagement.operationDescriptions.resetPassword'),
      time: '2025-01-18 09:15:00'
    }
  ])
</script>

<style lang="scss" scoped>
  .user-detail {
    background-color: #f5f7fa;
    min-height: 100vh;
  }

  .content {
    padding: 15px;
  }

  .operation-time {
    font-size: 12px;
    color: #999;
  }
</style>


