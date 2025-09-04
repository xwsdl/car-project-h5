<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\components\PermissionGuard\index.vue
 * @Description: 权限控制组件
-->
<template>
  <div v-if="hasPermission">
    <slot />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const props = defineProps({
    // 单个权限
    permission: {
      type: String,
      default: ''
    },
    // 权限列表（任意一个权限满足即可）
    permissions: {
      type: Array,
      default: () => []
    },
    // 是否要求所有权限都满足
    requireAll: {
      type: Boolean,
      default: false
    }
  })

  const authStore = useAuthStore()

  // 权限检查逻辑
  const hasPermission = computed(() => {
    if (props.permission) {
      return authStore.hasPermission(props.permission)
    }

    if (props.permissions && props.permissions.length > 0) {
      if (props.requireAll) {
        return authStore.hasAllPermissions(props.permissions)
      } else {
        return authStore.hasAnyPermission(props.permissions)
      }
    }

    return false
  })
</script>




