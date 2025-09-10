<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\RoleManagement\index.vue
 * @Description: 角色管理页面
-->
<template>
  <div class="role-management">
    <van-nav-bar :title="$t('roleManagement.title')" left-arrow @click-left="goBack" />

    <div class="content">
      <van-button type="primary" block class="add-btn" @click="showRoleForm = true">
        {{ $t('roleManagement.addRole') }}
      </van-button>

      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadRoles"
      >
        <van-cell-group>
          <van-cell
            v-for="role in roles"
            :key="role.id"
            :title="role.roleName"
            :label="role.description"
            is-link
            @click="handleRoleClick(role)"
          >
            <template #right-icon>
              <div class="role-tags">
                <van-tag :type="getRoleStatusColor(role.status)" size="small">
                  {{ getRoleStatusText(role.status) }}
                </van-tag>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>

      <!-- 操作菜单 -->
      <van-action-sheet
        v-model:show="showActionSheet"
        :actions="actionOptions"
        @select="handleActionSelect"
      />
    </div>

    <!-- 角色表单弹窗 -->
    <van-popup v-model:show="showRoleForm" position="bottom" :style="{ height: '60%' }">
      <RoleForm :role="currentRole" @submit="handleRoleSubmit" @cancel="showRoleForm = false" />
    </van-popup>

    <!-- 权限分配弹窗 -->
    <van-popup v-model:show="showPermissionModal" position="bottom" :style="{ height: '70%' }">
      <div class="permission-modal">
        <van-nav-bar
          :title="`为角色分配权限: ${selectedRole?.roleName || ''}`"
          left-arrow
          @click-left="showPermissionModal = false"
        />

        <div class="permission-tree-content">
          <van-tree-select
            v-model="selectedPermissions"
            :items="permissionTree"
            :main-active-index="activeIndex"
            @click-nav="activeIndex = $event"
            @change="handlePermissionSelect"
            class="permission-tree"
          />
        </div>

        <div class="modal-actions">
          <van-button type="default" block @click="showPermissionModal = false">
            {{ t('common.cancel') }}
          </van-button>
          <van-button type="primary" block @click="saveRolePermissions">
            {{ t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  /* 权限分配弹窗样式 */
  .permission-modal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .permission-tree-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }

  .permission-tree {
    height: 100%;
  }

  .modal-actions {
    padding: 15px;
    display: flex;
    gap: 10px;
  }

  .modal-actions .van-button {
    flex: 1;
  }
</style>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast, showDialog } from 'vant'
  import RoleForm from './components/RoleForm.vue'
  import {
    fetchAllRole,
    addRole,
    updateRole,
    deleteRole,
    saveRolePermission,
    fetchRoleById
  } from '@/api/role/index.js'
  import { fetchAllPermission, getPermissionsByRoleId } from '@/api/permission/index.js'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const showRoleForm = ref(false)
  const showActionSheet = ref(false)
  const showPermissionModal = ref(false)
  const currentRole = ref(null)
  const selectedRole = ref(null)
  const roles = ref([])
  const permissions = ref([])
  const selectedPermissions = ref([])
  const permissionTree = ref([])
  const activeIndex = ref(0)
  const actionOptions = [
    { name: t('roleManagement.editRole'), key: 'edit' },
    { name: '分配权限', key: 'assignPermission' },
    { name: t('roleManagement.deleteRole'), key: 'delete' },
    { name: t('common.cancel'), key: 'cancel', color: '#999' }
  ]

  // 角色状态颜色映射
  const getRoleStatusColor = status => {
    return status === 1 ? 'success' : 'default'
  }

  // 角色状态文本映射
  const getRoleStatusText = status => {
    return status === 1
      ? t('roleManagement.statusOption.active')
      : t('roleManagement.statusOption.inactive')
  }

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 加载角色列表
  const loadRoles = async () => {
    try {
      loading.value = true

      // 调用API获取角色列表
      const response = await fetchAllRole()
      // 请求封装已处理错误拦截，成功时直接使用数据
      if (response && response.length >= 0) {
        roles.value = response
        finished.value = true
      } else {
        throw new Error('获取角色列表失败')
      }
    } catch (error) {
      console.error('加载角色列表失败:', error)
      showToast(error.message || '加载失败')
    } finally {
      loading.value = false
    }
  }

  // 角色点击处理
  const handleRoleClick = role => {
    selectedRole.value = { ...role }
    showActionSheet.value = true
  }

  // 操作菜单选择处理
  const handleActionSelect = action => {
    showActionSheet.value = false

    switch (action.key) {
      case 'edit':
        editRole(selectedRole.value)
        break
      case 'delete':
        handleDeleteRole(selectedRole.value)
        break
      case 'assignPermission':
        assignPermissionToRole(selectedRole.value)
        break
      case 'cancel':
      default:
        // 取消操作
        break
    }
  }

  // 编辑角色
  const editRole = role => {
    currentRole.value = { ...role }
    showRoleForm.value = true
  }

  // 分配权限给角色
  const assignPermissionToRole = async role => {
    try {
      // 获取角色详情，包括已有权限
      const roleDetail = await getPermissionsByRoleId(role.id)
      selectedRole.value = { ...roleDetail }

      // 加载所有权限
      await loadPermissions()

      // 初始化已选中的权限
      selectedPermissions.value = [...(roleDetail.permissions || [])]

      // 显示权限分配弹窗
      showPermissionModal.value = true
    } catch (error) {
      console.error('加载角色详情或权限列表失败:', error)
      showToast(error.message || '操作失败')
    }
  }

  // 加载权限列表
  const loadPermissions = async () => {
    try {
      const response = await fetchAllPermission()
      if (response && Array.isArray(response)) {
        permissions.value = response
        buildPermissionTree()
      }
    } catch (error) {
      console.error('加载权限列表失败:', error)
      showToast(error.message || '加载失败')
    }
  }

  // 构建权限树结构
  const buildPermissionTree = () => {
    // 构建树结构
    const tree = []
    const map = new Map()

    // 将所有权限放入map中
    permissions.value.forEach(permission => {
      map.set(permission.id, { ...permission, children: [] })
    })

    // 构建父子关系
    permissions.value.forEach(permission => {
      const parentId = permission.parentId || 0
      if (parentId === 0) {
        // 顶级权限
        tree.push(map.get(permission.id))
      } else if (map.has(parentId)) {
        // 子权限
        map.get(parentId).children.push(map.get(permission.id))
      }
    })

    permissionTree.value = tree
  }

  // 处理权限选择
  const handlePermissionSelect = values => {
    // 这里需要将选中的权限ID数组进行处理，确保是正确的格式
    // 假设values是权限ID的数组
    selectedPermissions.value = values
  }

  // 保存角色权限
  const saveRolePermissions = async () => {
    try {
      await saveRolePermission({
        roleId: selectedRole.value.id,
        permIds: selectedPermissions.value // 使用permIds数组格式
      })

      showToast('权限分配成功')
      showPermissionModal.value = false

      // 重新加载角色列表
      await loadRoles()
    } catch (error) {
      console.error('保存角色权限失败:', error)
      showToast(error.message || '操作失败')
    }
  }

  // 处理角色删除
  const handleDeleteRole = role => {
    showDialog({
      title: t('common.confirm'),
      message: t('roleManagement.confirmDeleteRole', { roleName: role.roleName }),
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    }).then(async () => {
      try {
        await deleteRole(role.id)
        showToast(t('roleManagement.deleteSuccess'))

        // 重新加载角色列表
        await loadRoles()
      } catch (error) {
        console.error('删除角色失败:', error)
        showToast(error.message || '操作失败')
      }
    })
  }

  // 处理角色提交
  const handleRoleSubmit = async roleData => {
    try {
      if (roleData.id) {
        // 编辑角色
        const updateData = {
          id: roleData.id,
          roleName: roleData.name,
          roleCode: roleData.roleCode,
          description: roleData.description || '',
          sort: roleData.sort || 0,
          status: roleData.status !== undefined ? parseInt(roleData.status, 10) : 1
        }

        await updateRole(updateData)

        // 保存角色权限
        if (roleData.permissions && roleData.permissions.length > 0) {
          await saveRolePermission({
            roleId: roleData.id,
            permIds: roleData.permissions // 改为permIds数组格式
          })
        }
      } else {
        // 新增角色
        const addData = {
          roleName: roleData.name,
          roleCode: roleData.roleCode,
          description: roleData.description || '',
          sort: roleData.sort || 0,
          status: roleData.status !== undefined ? parseInt(roleData.status, 10) : 1
        }

        const newRole = await addRole(addData)

        // 保存角色权限
        if (roleData.permissions && roleData.permissions.length > 0) {
          await saveRolePermission({
            roleId: newRole.id,
            permIds: roleData.permissions // 改为permIds数组格式
          })
        }
      }

      // 请求封装已处理错误拦截，成功时直接执行后续操作
      showToast(t('roleManagement.saveSuccess'))
      showRoleForm.value = false
      currentRole.value = null

      // 重新加载角色列表
      roles.value = []
      finished.value = false
      await loadRoles()
    } catch (error) {
      console.error('保存角色失败:', error)
      showToast(error.message || '保存失败')
    }
  }

  onMounted(() => {
    loadRoles()
  })
</script>

<style lang="scss" scoped>
  .role-management {
    background-color: #f5f7fa;
    min-height: 100vh;
  }

  .content {
    padding: 15px;
  }

  .add-btn {
    margin-bottom: 15px;
  }

  .role-tags {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  /* 角色描述文本超出显示省略号 */
  .van-cell {
    .van-cell__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
</style>
