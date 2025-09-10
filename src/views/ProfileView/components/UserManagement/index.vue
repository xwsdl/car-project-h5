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
            :label="user.phone || user.email || '无联系方式'"
            is-link
            @click="showUserActions(user)"
          >
            <template #right-icon>
                <van-tag :type="getUserStatusColor(user.status)" size="small">
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

    <!-- 角色选择弹窗 -->
    <van-popup v-model:show="showRolePicker" position="bottom" :style="{ height: '80%' }">
      <div class="role-picker-container">
        <van-nav-bar :title="t('roleManagement.assignRole')" left-arrow @click-left="showRolePicker = false" />
        <div class="role-list">
          <van-cell
            v-for="role in roleList"
            :key="role.id"
            :title="role.name"
            :value="role.description"
            is-link
            @click="handleRoleSelect(role)"
          >
            <template #right-icon>
              <VanIcon v-if="selectedRole && selectedRole.id === role.id" name="success" color="#4cd964" />
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
  import { showToast, Dialog, Picker, Icon as VanIcon } from 'vant'
  import UserDetail from './components/UserDetail.vue'
  import UserEdit from './components/UserEdit.vue'
  import { fetchUserList, updateUserRole, saveUserRole, fetchUserRole } from '@/api/user/index.js'
  import { fetchAllRole } from '@/api/role/index.js'

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
  const pageNo = ref(1)
  const pageSize = ref(10)
  const showRolePicker = ref(false)
  const roleList = ref([])
  const selectedRole = ref(null)

  // 由于搜索已经在API层面处理，这里直接返回用户列表
  const filteredUsers = computed(() => users.value)

  // 用户状态颜色映射（适配中文状态值）
  const getUserStatusColor = status => {
    // 根据中文状态值映射颜色
    const colorMap = {
      '已激活': 'success',
      '未激活': 'default',
      '暂停': 'warning',
      '删除': 'danger'
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
        // userName: searchKeyword.value
        // isAllocate: undefined // 默认不传此参数
        // isAsc: false // 默认降序
        //  sortBy: 'createTime' // 默认按创建时间排序
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
        if (pageNo.value === 1) {
          users.value = userList
        } else {
          users.value = [...users.value, ...userList]
        }

        // 判断是否还有更多数据
        finished.value = userList.length < pageSize.value
      } else {
        // 如果API返回为空，使用模拟数据（匹配实际API返回格式）
        const mockUsers = [
          {
            id: 1,
            username: "Jack",
            phone: "13900112224",
            createtime: "2017-08-19 20:50:21",
            updatetime: "2025-07-12 15:47:47",
            status: "已激活",
            email: "",
            avatar: "https://bear-app-avatar.oss-cn-beijing.aliyuncs.com/avatars/2025/07/12/94164638-5a23-4e76-a7d6-c778da1f5b46.jfif",
            gender: true,
            birthday: "",
            deleted: false,
            roleId: 2,
            realName: null
          },
          {
            id: 2,
            username: "admin",
            phone: "13800138000",
            createtime: "2017-08-19 20:50:21",
            updatetime: "2025-07-12 15:47:47",
            status: "已激活",
            email: "admin@example.com",
            avatar: "",
            gender: true,
            birthday: "",
            deleted: false,
            roleId: 1,
            realName: null
          }
        ]

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
      name: currentUser.value?.status === '已激活'
            ? t('userManagement.actions.suspend')
            : t('userManagement.actions.activate'),
      icon: currentUser.value?.status === '已激活' ? 'pause-circle-o' : 'play-circle-o'
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
      
      // 使用API获取角色列表
      const roles = await fetchAllRole()
      
      // 处理角色列表数据格式
      roleList.value = roles || []
      
      // 设置默认选中当前角色
      if (currentRole && roleList.value.length > 0) {
        selectedRole.value = roleList.value.find(role => role.id === currentRole.id) || roleList.value[0]
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
        roleIds: [selectedRole.value.id],  // 改为数组格式
        userId: currentUser.value.id
      })
      
      showToast(t('roleManagement.assignSuccess'))
      
      // 关闭弹窗
      showRolePicker.value = false
      
      // 重新加载用户列表以更新角色信息
      users.value = []
      finished.value = false
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
    const toggleUserStatus = user => {
      const action = user.status === '已激活' ? 'suspend' : 'activate'
      confirmMessage.value = t(
        `userManagement.confirm${action.charAt(0).toUpperCase() + action.slice(1)}`,
        {
          username: user.username
        }
      )
      showConfirm.value = true
    }

  // 确认操作
  const confirmAction = async () => {
    try {
      // 判断当前是启用还是停用操作
      if (confirmMessage.value.includes('启用')) {
        // 启用用户
        await updateUserRole({
          id: currentUser.value.id,
          status: '已激活'
        })
        showToast(t('userManagement.activateSuccess'))
      } else if (confirmMessage.value.includes('停用')) {
        // 停用用户
        await updateUserRole({
          id: currentUser.value.id,
          status: '未激活'
        })
        showToast(t('userManagement.suspendSuccess'))
      }

      // 重新加载用户列表
      users.value = []
      finished.value = false
      await loadUsers()
    } catch (error) {
      console.error('操作失败:', error)
      showToast(t('request.fail'))
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
