<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\UserManagement\index.vue
 * @Description: 用户管理页面
-->
<template>
  <div class="user-management">
    <van-nav-bar :title="$t('userManagement.title')" left-arrow @click-left="goBack" />

    <div class="content">
      <!-- 搜索栏 -->
      <van-search
        v-model="searchKeyword"
        :placeholder="$t('userManagement.searchPlaceholder')"
        @search="handleSearch"
        @clear="handleSearch"
      />

      <!-- 用户列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadUsers"
      >
        <van-cell-group>
          <van-cell
            v-for="user in filteredUsers"
            :key="user.id"
            :title="user.username"
            :label="`${user.phone || user.email || '无联系方式'} | ${user.roleName || '无角色'}`"
            is-link
            @click="showUserActions(user)"
          >
            <template #right-icon>
              <van-tag :type="getUserStatusColor(user.statusCode)" size="small">
                {{ user.status }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </div>

    <!-- 用户操作弹窗 -->
    <van-action-sheet
      v-model:show="showActions"
      :actions="userActions"
      @select="handleUserAction"
    />

    <!-- 用户详情弹窗 -->
    <van-popup v-model:show="showUserDetail" position="bottom" :style="{ height: '80%' }">
      <UserDetail v-if="showUserDetail" :user="currentUser" @close="showUserDetail = false" />
    </van-popup>

    <!-- 角色选择弹窗 -->
    <van-popup v-model:show="showRolePicker" position="bottom" :style="{ height: '80%' }">
      <div class="role-picker-container">
        <van-nav-bar
          :title="t('roleManagement.assignRole')"
          left-arrow
          @click-left="showRolePicker = false"
        />
        <div class="role-list">
          <van-cell
            v-for="role in roleList"
            :key="role.id"
            :title="role.roleName"
            :value="role.description"
            is-link
            @click="handleRoleSelect(role)"
          >
            <template #right-icon>
              <VanIcon
                v-if="selectedRole && selectedRole.id === role.id"
                name="success"
                color="#4cd964"
              />
            </template>
          </van-cell>
        </div>
        <div class="picker-actions">
          <van-button type="default" block @click="showRolePicker = false">
            {{ t('common.cancel') }}
          </van-button>
          <van-button type="primary" block @click="confirmRoleAssign">
            {{ t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast, showDialog, Icon as VanIcon } from 'vant'
  import UserDetail from './components/UserDetail.vue'
  import {
    fetchUserList,
    saveUserRole,
    activateUser,
    freezeUser,
    fetchUserRole
  } from '@/api/user/index.js'
  import { fetchAllRole } from '@/api/role/index.js'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const searchKeyword = ref('')
  const showActions = ref(false)
  const showUserDetail = ref(false)
  const currentUser = ref(null)
  const users = ref([])
  const pageNo = ref(1)
  const pageSize = ref(10)
  const showRolePicker = ref(false)
  const roleList = ref([])
  const selectedRole = ref(null)

  // 初始化角色列表
  const initRoleList = async () => {
    try {
      const roles = await fetchAllRole()
      roleList.value = roles || []
    } catch (error) {
      console.error('初始化角色列表失败:', error)
    }
  }

  // 由于搜索已经在API层面处理，这里直接返回用户列表
  const filteredUsers = computed(() => users.value)

  // 用户状态颜色映射（适配中文状态值）
  const getUserStatusColor = status => {
    // 用户状态颜色映射（根据statusCode）
    const colorMap = {
      1: 'success', // 正常状态
      0: 'default', // 未激活
      2: 'warning', // 暂停
      3: 'danger' // 删除
    }
    return colorMap[status] || 'default'
  }

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 搜索处理
  const handleSearch = () => {
    // 重置分页
    pageNo.value = 1
    users.value = []
    finished.value = false
    // 重新加载数据
    loadUsers()
  }

  // 加载用户列表
  const loadUsers = async () => {
    try {
      loading.value = true

      // 构建查询参数
      const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value
      }

      // 调用API获取用户列表 - request.js已经返回response.data
      const result = await fetchUserList(params)

      // 根据API返回结构处理数据
      let userList = []
      if (Array.isArray(result)) {
        userList = result
      } else if (result && result.records && Array.isArray(result.records)) {
        userList = result.records
      } else if (result && result.list && Array.isArray(result.list)) {
        userList = result.list
      }

      if (userList.length > 0) {
        // 直接使用API返回的数据，已包含roleName字段
        if (pageNo.value === 1) {
          users.value = userList
        } else {
          users.value = [...users.value, ...userList]
        }

        // 判断是否还有更多数据
        finished.value = userList.length < pageSize.value
      } else {
        // 如果API返回为空，使用模拟数据（匹配实际API返回格式）
        const mockUsers = []

        // 处理模拟数据的分页
        const startIndex = (pageNo.value - 1) * pageSize.value
        const endIndex = startIndex + pageSize.value
        const paginatedMockUsers = mockUsers.slice(startIndex, endIndex)

        if (pageNo.value === 1) {
          users.value = paginatedMockUsers
        } else {
          users.value = [...users.value, ...paginatedMockUsers]
        }

        // 判断是否还有更多数据
        finished.value = paginatedMockUsers.length < pageSize.value
      }
    } catch (error) {
      console.error('加载用户列表失败:', error)
      showToast(t('request.fail'))
    } finally {
      loading.value = false

      // 加载完成后，增加页码
      if (!finished.value) {
        pageNo.value++
      }
    }
  }

  // 显示用户操作
  const showUserActions = user => {
    currentUser.value = user
    showActions.value = true
  }

  // 用户操作列表
  const userActions = computed(() => [
    {
      name: t('userManagement.actions.view'),
      icon: 'eye-o'
    },
    {
      name: currentUser.value?.statusCode === 1 ? '停用' : '启用',
      icon: currentUser.value?.statusCode === 1 ? 'pause-circle-o' : 'play-circle-o'
    },
    {
      name: t('roleManagement.assignRole'),
      icon: 'user-o'
    }
  ])

  // 处理用户操作
  const handleUserAction = action => {
    const actionName = action.name

    switch (actionName) {
      case t('userManagement.actions.view'):
        viewUser(currentUser.value)
        break
      case t('userManagement.actions.suspend'):
      case t('userManagement.actions.activate'):
        toggleUserStatus(currentUser.value)
        break
      case t('roleManagement.assignRole'):
        assignUserRole(currentUser.value)
        break
    }
  }

  // 分配用户角色
  const assignUserRole = async user => {
    try {
      // 存储当前操作的用户
      currentUser.value = user

      // 获取用户当前角色
      const currentRole = await fetchUserRole(user.id)
      console.log('currentRole', currentRole)

      // 使用API获取角色列表
      const roles = await fetchAllRole()

      // 处理角色列表数据格式
      roleList.value = roles || []

      // 设置默认选中当前角色
      if (currentRole && roleList.value.length > 0) {
        selectedRole.value = roleList.value.find(role => role.id === currentRole[0])
      }

      // 显示角色选择弹窗
      showRolePicker.value = true
    } catch (error) {
      console.error('加载角色列表失败:', error)
      showToast(t('request.fail'))
    }
  }

  // 选择角色
  const handleRoleSelect = role => {
    selectedRole.value = role
  }

  // 确认角色分配
  const confirmRoleAssign = async () => {
    if (!selectedRole.value) {
      showToast(t('roleManagement.selectRoleFirst'))
      return
    }

    try {
      // 调用API保存角色分配
      await saveUserRole({
        roleIds: [selectedRole.value.id], // 改为数组格式
        userId: currentUser.value.id
      })

      showToast(t('roleManagement.assignSuccess'))

      // 关闭角色选择弹窗和操作弹窗
      showRolePicker.value = false
      showActions.value = false

      // 重新加载用户列表以更新角色信息
      users.value = []
      finished.value = false
      pageNo.value = 1
      await loadUsers()
    } catch (error) {
      console.error('分配角色失败:', error)
      showToast(t('roleManagement.assignFail'))
    }
  }

  // 查看用户
  const viewUser = user => {
    currentUser.value = user
    showUserDetail.value = true
  }

  // 切换用户状态
  const toggleUserStatus = async user => {
    const action = user.statusCode === 1 ? 'suspend' : 'activate'
    const successToast =
      action === 'suspend'
        ? t('userManagement.suspendSuccess')
        : t('userManagement.activateSuccess')
    const confirmKey = action === 'suspend' ? 'confirmSuspend' : 'confirmActivate'

    try {
      // 使用showDialog函数显示确认对话框
      await showDialog({
        title: t('common.confirm'),
        message: t(`userManagement.${confirmKey}`, {
          username: user.username
        }),
        showCancelButton: true,
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel')
      })

      // 用户确认后执行操作
      if (action === 'activate') {
        await activateUser({
          userId: user.id
        })
      } else {
        await freezeUser({
          userId: user.id
        })
      }

      showToast(successToast)

      // 关闭操作弹窗
      showActions.value = false

      // 重新加载用户列表
      users.value = []
      finished.value = false
      pageNo.value = 1
      await loadUsers()
    } catch (error) {
      // 用户取消操作时也会进入catch，但不需要处理
      if (error !== 'cancel') {
        console.error('操作失败:', error)
        showToast(t('request.fail'))
      }
    }
  }

  onMounted(() => {
    initRoleList().then(() => {
      loadUsers()
    })
  })
</script>

<style lang="scss" scoped>
  .user-management {
    background-color: #f5f7fa;
    min-height: 100vh;
  }

  .content {
    padding-bottom: 15px;
  }

  .role-picker-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }

  .role-list {
    flex: 1;
    overflow-y: auto;
  }

  .picker-actions {
    padding: 15px;
    display: flex;
    gap: 10px;
  }
</style>
