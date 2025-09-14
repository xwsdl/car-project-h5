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
        <!-- 固定的标题头部 -->
        <div class="permission-modal-header">
          <van-nav-bar
            :title="`为角色分配权限: ${currentAssigningRole?.roleName || ''}`"
            left-arrow
            @click-left="showPermissionModal = false"
          />

          <!-- 全选按钮 -->
          <van-cell clickable @click="toggleSelectAll">
            <template #title>
              <div class="select-all-wrapper">
                <van-checkbox v-model="isAllSelected">
                  {{ t('common.selectAll') }}
                </van-checkbox>
              </div>
            </template>
          </van-cell>
        </div>

        <!-- 可滚动的权限列表 -->
        <div class="permission-list-scrollable">
          <van-checkbox-group v-model="selectedPermissions">
            <van-cell-group inset>
              <van-cell
                v-for="(permission, index) in permissions"
                :key="permission.id"
                :title="permission.permissionName"
                :label="permission.permissionKey"
                clickable
                @click="togglePermission(index)"
              >
                <template #right-icon>
                  <van-checkbox
                    :name="permission.id"
                    :ref="el => (checkboxRefs[index] = el)"
                    @click.stop
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>

        <!-- 固定的底部按钮 -->
        <div class="permission-modal-footer">
          <div class="modal-actions">
            <van-button type="default" block @click="showPermissionModal = false">
              {{ t('common.cancel') }}
            </van-button>
            <van-button type="primary" block @click="saveRolePermissions">
              {{ t('common.confirm') }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 菜单分配弹窗 -->
    <van-popup v-model:show="showMenuModal" position="bottom" :style="{ height: '70%' }">
      <div class="menu-modal">
        <!-- 固定的标题头部 -->
        <div class="menu-modal-header">
          <van-nav-bar
            :title="`${t('roleManagement.assignMenu')}: ${currentMenuAssigningRole?.roleName || ''}`"
            left-arrow
            @click-left="showMenuModal = false"
          />

          <!-- 全选按钮 -->
          <van-cell clickable @click="toggleMenuSelectAll">
            <template #title>
              <div class="select-all-wrapper">
                <van-checkbox v-model="isMenuAllSelected" @click="toggleMenuSelectAll">
                  {{ t('common.selectAll') }}
                </van-checkbox>
              </div>
            </template>
          </van-cell>
        </div>

        <!-- 可滚动的菜单树 -->
        <div class="menu-tree-scrollable">
          <div class="menu-tree">
            <div v-for="menu in menus" :key="menu.id" class="menu-item">
              <div
                class="menu-item-content"
                :style="{ paddingLeft: '0px' }"
                @click="toggleMenu(menu.id)"
              >
                <div class="menu-checkbox">
                  <div :class="['checkbox-inner', { checked: isMenuSelected(menu.id) }]"></div>
                </div>
                <div class="menu-info">
                  <div class="menu-name">{{ menu.menuName }}</div>
                  <div v-if="menu.menuType === 2" class="menu-type">{{ t('roleManagement.buttonType') }}</div>
                </div>
              </div>
              <!-- 递归渲染子菜单 -->
              <div v-if="menu.children && menu.children.length > 0" class="menu-children">
                <div v-for="subMenu in menu.children" :key="subMenu.id" class="menu-item">
                  <div
                    class="menu-item-content"
                    :style="{ paddingLeft: '20px' }"
                    @click="toggleMenu(subMenu.id)"
                  >
                    <div class="menu-checkbox">
                      <div
                        :class="['checkbox-inner', { checked: isMenuSelected(subMenu.id) }]"
                      ></div>
                    </div>
                    <div class="menu-info">
                      <div class="menu-name">{{ subMenu.menuName }}</div>
                      <div v-if="subMenu.menuType === 2" class="menu-type">{{ t('roleManagement.buttonType') }}</div>
                    </div>
                  </div>
                  <!-- 第三级菜单 -->
                  <div v-if="subMenu.children && subMenu.children.length > 0" class="menu-children">
                    <div
                      v-for="thirdMenu in subMenu.children"
                      :key="thirdMenu.id"
                      class="menu-item"
                    >
                      <div
                        class="menu-item-content"
                        :style="{ paddingLeft: '40px' }"
                        @click="toggleMenu(thirdMenu.id)"
                      >
                        <div class="menu-checkbox">
                          <div
                            :class="['checkbox-inner', { checked: isMenuSelected(thirdMenu.id) }]"
                          ></div>
                        </div>
                        <div class="menu-info">
                          <div class="menu-name">{{ thirdMenu.menuName }}</div>
                          <div v-if="thirdMenu.menuType === 2" class="menu-type">{{ t('roleManagement.buttonType') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 固定的底部按钮 -->
        <div class="menu-modal-footer">
          <div class="modal-actions">
            <van-button type="default" block @click="showMenuModal = false">
              {{ t('common.cancel') }}
            </van-button>
            <van-button type="primary" block @click="saveRoleMenus">
              {{ t('common.confirm') }}
            </van-button>
          </div>
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
  import { ref, onMounted, watch, computed } from 'vue'
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
    saveRoleMenu,
    fetchRoleById,
    fetchRoleMenu
  } from '@/api/role/index.js'
  import { fetchAllPermission, getPermissionsByRoleId } from '@/api/permission/index.js'
  import { fetchMenuTree } from '@/api/menu/index.js'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const showRoleForm = ref(false)
  const showActionSheet = ref(false)
  const showPermissionModal = ref(false)
  const showMenuModal = ref(false)
  const currentRole = ref(null) // 用于编辑的角色信息
  const selectedRole = ref(null) // 用于操作菜单的角色信息
  const currentAssigningRole = ref(null) // 用于权限分配的角色信息
  const currentMenuAssigningRole = ref(null) // 用于菜单分配的角色信息
  const roles = ref([])
  const permissions = ref([])
  const selectedPermissions = ref([])
  const checkboxRefs = ref([])
  const isAllSelected = ref(false)
  const menus = ref([])
  const selectedMenus = ref([])
  const isMenuAllSelected = ref(false)
  const actionOptions = [
    { name: t('roleManagement.editRole'), key: 'edit' },
    { name: t('roleManagement.assignPermission'), key: 'assignPermission' },
    { name: t('roleManagement.assignMenu'), key: 'assignMenu' },
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
    console.log('点击角色:', selectedRole.value)
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
      case 'assignMenu':
        assignMenuToRole(selectedRole.value)
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
      console.log('分配权限给角色:', role)

      // 保存当前正在分配权限的角色信息
      currentAssigningRole.value = { ...role }

      // 获取角色已有权限
      const roleDetail = await getPermissionsByRoleId(role.id)
      console.log('角色已有权限:', roleDetail)

      // 加载所有权限
      await loadPermissions()

      // 初始化已选中的权限
      // 确保selectedPermissions是数字数组格式
      if (roleDetail && Array.isArray(roleDetail)) {
        // 如果是对象数组，提取id
        if (roleDetail.length > 0 && typeof roleDetail[0] === 'object') {
          selectedPermissions.value = roleDetail.map(perm => perm.id)
        }
      } else {
        selectedPermissions.value = []
      }

      console.log('初始化选中的权限:', selectedPermissions.value)

      // 更新全选状态
      updateSelectAllStatus()

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
      }
    } catch (error) {
      console.error('加载权限列表失败:', error)
      showToast(error.message || '加载失败')
    }
  }

  // 切换权限选中状态
  const togglePermission = index => {
    const permission = permissions.value[index]
    const checkbox = checkboxRefs.value[index]

    if (checkbox) {
      checkbox.toggle()
    }
  }

  // 分配菜单给角色
  const assignMenuToRole = async role => {
    try {
      console.log('分配菜单给角色:', role)

      // 保存当前正在分配菜单的角色信息
      currentMenuAssigningRole.value = { ...role }

      // 获取角色已有菜单
      const roleMenus = await fetchRoleMenu(role.id)
      console.log('角色已有菜单:', roleMenus)

      // 加载角色菜单管理列表数据
      await loadMenus()

      // 初始化已选中的菜单
      if (roleMenus && Array.isArray(roleMenus)) {
        selectedMenus.value = roleMenus
      } else {
        selectedMenus.value = []
      }

      console.log('初始化选中的菜单:', selectedMenus.value)

      // 更新全选状态
      updateMenuSelectAllStatus()

      // 显示菜单分配弹窗
      showMenuModal.value = true
    } catch (error) {
      console.error('加载角色详情或角色菜单管理列表失败:', error)
      showToast(error.message || '操作失败')
    }
  }

  // 加载角色菜单管理列表数据
  const loadMenus = async () => {
    try {
      const response = await fetchMenuTree()
      if (response && Array.isArray(response)) {
        menus.value = response
      }
    } catch (error) {
      console.error('加载角色菜单管理列表失败:', error)
      showToast(error.message || '加载失败')
    }
  }

  // 切换菜单选中状态
  const toggleMenu = menuId => {
    const index = selectedMenus.value.indexOf(menuId)
    if (index > -1) {
      selectedMenus.value.splice(index, 1)
    } else {
      selectedMenus.value.push(menuId)
    }
    updateMenuSelectAllStatus()
  }

  // 全选/取消全选菜单
  const toggleMenuSelectAll = () => {
    if (isMenuAllSelected.value) {
      // 取消全选
      selectedMenus.value = []
    } else {
      // 全选，遍历整个菜单树收集所有菜单ID
      const collectAllMenuIds = menuTree => {
        let ids = []
        menuTree.forEach(menu => {
          ids.push(menu.id)
          if (menu.children && menu.children.length > 0) {
            ids = ids.concat(collectAllMenuIds(menu.children))
          }
        })
        return ids
      }
      selectedMenus.value = collectAllMenuIds(menus.value)
    }
    isMenuAllSelected.value = !isMenuAllSelected.value
  }

  // 更新菜单全选状态
  const updateMenuSelectAllStatus = () => {
    if (menus.value.length === 0) {
      isMenuAllSelected.value = false
      return
    }

    // 收集所有菜单ID
    const collectAllMenuIds = menuTree => {
      let ids = []
      menuTree.forEach(menu => {
        ids.push(menu.id)
        if (menu.children && menu.children.length > 0) {
          ids = ids.concat(collectAllMenuIds(menu.children))
        }
      })
      return ids
    }
    const allMenuIds = collectAllMenuIds(menus.value)
    isMenuAllSelected.value = selectedMenus.value.length === allMenuIds.length
  }

  // 检查菜单是否被选中
  const isMenuSelected = menuId => {
    return selectedMenus.value.includes(menuId)
  }

  // 保存角色菜单
  const saveRoleMenus = async () => {
    try {
      console.log('保存角色菜单前的currentMenuAssigningRole:', currentMenuAssigningRole.value)

      if (!currentMenuAssigningRole.value || !currentMenuAssigningRole.value.id) {
        console.error('角色ID不存在', currentMenuAssigningRole.value)
        showToast('角色信息错误，请重新选择角色')
        return
      }

      const requestData = {
        roleId: currentMenuAssigningRole.value.id,
        menuIds: selectedMenus.value // 按照API要求的格式
      }

      console.log('请求参数:', requestData)

      await saveRoleMenu(requestData)

      showToast(t('roleManagement.assignMenuSuccess'))
      showMenuModal.value = false

      // 重新加载角色列表
      await loadRoles()
    } catch (error) {
      console.error('保存角色菜单失败:', error)
      showToast(error.message || '操作失败')
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      // 取消全选
      selectedPermissions.value = []
      isAllSelected.value = false
    } else {
      // 全选
      selectedPermissions.value = permissions.value.map(perm => perm.id)
      isAllSelected.value = true
    }
  }

  // 更新全选状态
  const updateSelectAllStatus = () => {
    if (permissions.value.length === 0) {
      isAllSelected.value = false
    } else {
      isAllSelected.value = selectedPermissions.value.length === permissions.value.length
    }
  }

  // 监听selectedPermissions变化，更新全选状态
  watch(selectedPermissions, () => {
    updateSelectAllStatus()
  })

  // 保存角色权限
  const saveRolePermissions = async () => {
    try {
      console.log('保存角色权限前的currentAssigningRole:', currentAssigningRole.value)

      if (!currentAssigningRole.value || !currentAssigningRole.value.id) {
        console.error('角色ID不存在', currentAssigningRole.value)
        showToast('角色信息错误，请重新选择角色')
        return
      }

      const requestData = {
        roleId: currentAssigningRole.value.id,
        permIds: selectedPermissions.value // 使用permIds数组格式
      }

      console.log('请求参数:', requestData)

      await saveRolePermission(requestData)

      showToast(t('roleManagement.assignSuccess'))
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

  /* 权限分配弹窗样式 */
  .permission-modal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .permission-modal-header {
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  .select-all-wrapper {
    display: flex;
    align-items: center;
  }

  .permission-list-scrollable {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
  }

  .permission-modal-footer {
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 10px;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
  }

  .modal-actions .van-button {
    flex: 1;
  }

  /* 菜单分配弹窗样式 */
  .menu-modal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .menu-modal-header {
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  .menu-tree-scrollable {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
  }

  .menu-tree {
    padding: 0 10px;
  }

  .menu-item {
    margin-bottom: 5px;
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
  }

  .menu-item-content:hover {
    background-color: #f5f5f5;
  }

  .menu-checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .menu-checkbox .checkbox-inner {
    width: 12px;
    height: 12px;
    background-color: transparent;
    transition: all 0.3s;
  }

  .menu-checkbox .checkbox-inner.checked {
    background-color: #1989fa;
  }

  .menu-info {
    flex: 1;
  }

  .menu-name {
    font-size: 14px;
    color: #333;
  }

  .menu-type {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }

  .menu-children {
    margin-left: 10px;
  }

  .menu-modal-footer {
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 10px;
  }
</style>
