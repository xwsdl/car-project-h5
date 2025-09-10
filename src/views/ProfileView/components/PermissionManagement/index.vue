<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-04 16:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 16:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\PermissionManagement\index.vue
 * @Description: 权限管理页面
-->
<template>
  <div class="permission-management">
    <van-nav-bar :title="$t('permissionManagement.title')" left-arrow @click-left="goBack" />

    <div class="content">
      <van-button type="primary" block class="add-btn" @click="handleAddPermission">
        {{ $t('permissionManagement.addPermission') }}
      </van-button>

      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadPermissions"
      >
        <van-cell-group>
          <van-cell
            v-for="permission in permissions"
            :key="permission.id"
            :title="permission.permissionName || permission.name"
            :label="permission.description"
            is-link
            @click="handlePermissionClick(permission)"
          />
          
        </van-cell-group>
      </van-list>

      <!-- 操作菜单 -->
      <van-action-sheet
        v-model:show="showActionSheet"
        :actions="actionOptions"
        @select="handleActionSelect"
      />
    </div>

    <!-- 权限表单弹窗 -->
    <van-popup v-model:show="showPermissionForm" position="bottom" :style="{ height: '60%' }">
      <PermissionForm
        :permission="currentPermission"
        @submit="handlePermissionSubmit"
        @cancel="showPermissionForm = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast, showDialog } from 'vant'
  import {
    fetchAllPermission,
    addPermission,
    updatePermission,
    deletePermission
  } from '@/api/permission/index.js'
  import PermissionForm from './components/PermissionForm.vue'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const showPermissionForm = ref(false)
  const showActionSheet = ref(false)
  const currentPermission = ref(null)
  const selectedPermission = ref(null)
  const permissions = ref([])
  const actionOptions = [
    { name: t('permissionManagement.editPermission'), key: 'edit' },
    { name: t('permissionManagement.deletePermission'), key: 'delete' },
    { name: t('common.cancel'), key: 'cancel', color: '#999' }
  ]

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 加载权限列表
  const loadPermissions = async () => {
    try {
      loading.value = true

      // 调用API获取权限列表
      const response = await fetchAllPermission()
      // 请求封装已处理错误拦截，成功时直接使用数据
      if (response && response.length >= 0) {
        permissions.value = response
        finished.value = true
      } else {
        throw new Error('获取权限列表失败')
      }
    } catch (error) {
      console.error('加载权限列表失败:', error)
      showToast(error.message || '加载失败')
    } finally {
      loading.value = false
    }
  }

  // 权限点击处理
  const handlePermissionClick = permission => {
    selectedPermission.value = { ...permission }
    showActionSheet.value = true
  }

  // 操作菜单选择处理
  const handleActionSelect = action => {
    showActionSheet.value = false

    switch (action.key) {
      case 'edit':
        editPermission(selectedPermission.value)
        break
      case 'delete':
        handleDeletePermission(selectedPermission.value)
        break
      case 'cancel':
      default:
        // 取消操作
        break
    }
  }

  // 编辑权限
  const editPermission = permission => {
    currentPermission.value = { ...permission }
    showPermissionForm.value = true
  }

  // 添加权限
  const handleAddPermission = () => {
    currentPermission.value = null
    showPermissionForm.value = true
  }

  // 处理权限删除
  const handleDeletePermission = permission => {
    // 兼容新旧字段名
    const permissionName = permission.permissionName || permission.name || '该权限'
    showDialog({
      title: t('common.confirm'),
      message: t('permissionManagement.confirmDeletePermission', { permissionName }),
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    }).then(async () => {
      try {
        await deletePermission(permission.id)
        showToast(t('permissionManagement.deleteSuccess'))

        // 重置列表状态，确保重新加载数据
        finished.value = false
        // 重新加载权限列表
        await loadPermissions()
      } catch (error) {
        console.error('删除权限失败:', error)
        showToast(error.message || '操作失败')
      }
    })
  }

  // 处理权限提交
  const handlePermissionSubmit = async permissionData => {
    try {
      // 构建提交数据，根据API要求的参数结构
      const submitData = {
        id: permissionData.id || 0,
        permissionName: permissionData.permissionName,
        permissionKey: permissionData.permissionKey,
        description: permissionData.description || '',
        parentId: permissionData.parentId || 0,
        apiPath: permissionData.apiPath || '',
        method: permissionData.method || '',
        sort: permissionData.sort || 0,
        status: permissionData.status !== undefined ? parseInt(permissionData.status, 10) : 1
      }

      if (permissionData.id) {
        // 编辑权限
        await updatePermission(submitData)
      } else {
        // 新增权限
        await addPermission(submitData)
      }

      showToast(t('permissionManagement.saveSuccess'))
      showPermissionForm.value = false

      // 重置列表状态，确保重新加载数据
      finished.value = false
      // 重新加载权限列表
      await loadPermissions()
    } catch (error) {
      console.error('保存权限失败:', error)
      showToast(error.message || '操作失败')
    }
  }

  // 组件挂载时加载权限列表
  onMounted(() => {
    loadPermissions()
  })
</script>

<style lang="scss" scoped>
  .permission-management {
    background-color: #f5f7fa;
    min-height: 100vh;

    .content {
      padding: 15px;
      max-width: 480px;
      margin: 0 auto;
    }

    .add-btn {
      margin-bottom: 15px;
    }

    .permission-tags {
      display: flex;
      align-items: center;
    }
  }
</style>
