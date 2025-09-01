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
            :label="user.email"
            is-link
            @click="showUserActions(user)"
          >
            <template #right-icon>
              <van-tag :type="getUserStatusColor(user.status)" size="small">
                {{ $t(`userManagement.status.${user.status}`) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </div>

    <!-- 用户操作弹窗 -->
    <van-action-sheet
      v-model:show="showActions"
      :title="$t('userManagement.actions')"
      :actions="userActions"
      @select="handleUserAction"
    />

    <!-- 确认弹窗 -->
    <van-dialog
      v-model:show="showConfirm"
      :title="$t('common.confirm')"
      :message="confirmMessage"
      show-cancel-button
      @confirm="confirmAction"
    />

    <!-- 用户详情弹窗 -->
    <van-popup v-model:show="showUserDetail" position="bottom" :style="{ height: '80%' }">
      <UserDetail v-if="showUserDetail" :user="currentUser" @close="showUserDetail = false" />
    </van-popup>

    <!-- 用户编辑弹窗 -->
    <van-popup v-model:show="showUserEdit" position="bottom" :style="{ height: '80%' }">
      <UserEdit
        v-if="showUserEdit"
        :user="currentUser"
        @close="showUserEdit = false"
        @save="handleUserSave"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast } from 'vant'
  import UserDetail from './components/UserDetail.vue'
  import UserEdit from './components/UserEdit.vue'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const searchKeyword = ref('')
  const showActions = ref(false)
  const showConfirm = ref(false)
  const showUserDetail = ref(false)
  const showUserEdit = ref(false)
  const confirmMessage = ref('')
  const currentUser = ref(null)
  const users = ref([])

  // 过滤后的用户列表
  const filteredUsers = computed(() => {
    if (!searchKeyword.value) {
      return users.value
    }

    return users.value.filter(
      user =>
        user.username.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  })

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

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 搜索处理
  const handleSearch = () => {
    // 搜索逻辑已在 computed 中处理
  }

  // 加载用户列表
  const loadUsers = async () => {
    try {
      loading.value = true
      // TODO: 调用API获取用户列表
      // const response = await getUserList()

      // 模拟数据
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active',
          role: 'superAdmin',
          createTime: '2025-01-01',
          lastLoginTime: '2025-01-20 10:30:00'
        },
        {
          id: 2,
          username: 'user001',
          email: 'user001@example.com',
          phone: '13800138001',
          status: 'active',
          role: 'normal',
          createTime: '2025-01-02',
          lastLoginTime: '2025-01-19 15:20:00'
        },
        {
          id: 3,
          username: 'service001',
          email: 'service001@example.com',
          phone: '13800138002',
          status: 'active',
          role: 'customerService',
          createTime: '2025-01-03',
          lastLoginTime: '2025-01-18 09:15:00'
        },
        {
          id: 4,
          username: 'manager001',
          email: 'manager001@example.com',
          phone: '13800138003',
          status: 'inactive',
          role: 'admin',
          createTime: '2025-01-04',
          lastLoginTime: '2025-01-17 14:30:00'
        }
      ]

      users.value = mockUsers
      finished.value = true
    } catch (error) {
      console.error('加载用户列表失败:', error)
      showToast('加载失败')
    } finally {
      loading.value = false
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
      name: t('userManagement.actions.edit'),
      icon: 'edit'
    },
    {
      name: t('userManagement.actions.resetPassword'),
      icon: 'lock'
    },
    {
      name:
        currentUser.value?.status === 'active'
          ? t('userManagement.actions.suspend')
          : t('userManagement.actions.activate'),
      icon: currentUser.value?.status === 'active' ? 'pause-circle-o' : 'play-circle-o'
    },
    {
      name: t('userManagement.actions.delete'),
      icon: 'delete-o',
      color: '#ee0a24'
    }
  ])

  // 处理用户操作
  const handleUserAction = action => {
    const actionName = action.name

    switch (actionName) {
      case t('userManagement.actions.view'):
        viewUser(currentUser.value)
        break
      case t('userManagement.actions.edit'):
        editUser(currentUser.value)
        break
      case t('userManagement.actions.resetPassword'):
        resetPassword(currentUser.value)
        break
      case t('userManagement.actions.suspend'):
      case t('userManagement.actions.activate'):
        toggleUserStatus(currentUser.value)
        break
      case t('userManagement.actions.delete'):
        deleteUser(currentUser.value)
        break
    }
  }

  // 查看用户
  const viewUser = user => {
    currentUser.value = user
    showUserDetail.value = true
  }

  // 编辑用户
  const editUser = user => {
    currentUser.value = user
    showUserEdit.value = true
  }

  // 处理用户保存
  const handleUserSave = async userData => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新本地数据
      const index = users.value.findIndex(u => u.id === userData.id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData }
      }

      showToast('保存成功')
      showUserEdit.value = false
    } catch (error) {
      console.error('保存失败:', error)
      showToast('保存失败')
    }
  }

  // 重置密码
  const resetPassword = user => {
    confirmMessage.value = t('userManagement.confirmResetPassword', { username: user.username })
    showConfirm.value = true
  }

  // 切换用户状态
  const toggleUserStatus = user => {
    const action = user.status === 'active' ? 'suspend' : 'activate'
    confirmMessage.value = t(
      `userManagement.confirm${action.charAt(0).toUpperCase() + action.slice(1)}`,
      {
        username: user.username
      }
    )
    showConfirm.value = true
  }

  // 删除用户
  const deleteUser = user => {
    confirmMessage.value = t('userManagement.confirmDelete', { username: user.username })
    showConfirm.value = true
  }

  // 确认操作
  const confirmAction = async () => {
    try {
      // TODO: 调用相应的API
      showToast('操作成功')

      // 重新加载用户列表
      users.value = []
      finished.value = false
      await loadUsers()
    } catch (error) {
      console.error('操作失败:', error)
      showToast('操作失败')
    }
  }

  onMounted(() => {
    loadUsers()
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
</style>
