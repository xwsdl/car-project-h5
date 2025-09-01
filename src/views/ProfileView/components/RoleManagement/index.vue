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
            :title="role.name"
            :label="role.description"
            is-link
            @click="editRole(role)"
          >
            <template #right-icon>
              <van-tag :type="getRoleTypeColor(role.type)" size="small">
                {{ $t(`roleManagement.roleTypes.${role.type}`) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </div>

    <!-- 角色表单弹窗 -->
    <van-popup v-model:show="showRoleForm" position="bottom" :style="{ height: '60%' }">
      <RoleForm :role="currentRole" @submit="handleRoleSubmit" @cancel="showRoleForm = false" />
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast } from 'vant'
  import RoleForm from './components/RoleForm.vue'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const finished = ref(false)
  const showRoleForm = ref(false)
  const currentRole = ref(null)
  const roles = ref([])

  // 角色类型颜色映射
  const getRoleTypeColor = type => {
    const colorMap = {
      normal: 'default',
      customerService: 'primary',
      admin: 'warning',
      superAdmin: 'danger'
    }
    return colorMap[type] || 'default'
  }

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 加载角色列表
  const loadRoles = async () => {
    try {
      loading.value = true
      // TODO: 调用API获取角色列表
      // const response = await getRoleList()

      // 模拟数据
      const mockRoles = [
        {
          id: 1,
          name: '普通用户',
          description: '基础功能访问权限',
          type: 'normal',
          permissions: ['basic_access']
        },
        {
          id: 2,
          name: '客服',
          description: '客服相关功能权限',
          type: 'customerService',
          permissions: ['basic_access', 'customer_service']
        },
        {
          id: 3,
          name: '管理员',
          description: '系统管理权限',
          type: 'admin',
          permissions: ['basic_access', 'role_management', 'user_management']
        },
        {
          id: 4,
          name: '超级管理员',
          description: '所有权限',
          type: 'superAdmin',
          permissions: ['*']
        }
      ]

      roles.value = mockRoles
      finished.value = true
    } catch (error) {
      console.error('加载角色列表失败:', error)
      showToast('加载失败')
    } finally {
      loading.value = false
    }
  }

  // 编辑角色
  const editRole = role => {
    currentRole.value = { ...role }
    showRoleForm.value = true
  }

  // 处理角色提交
  const handleRoleSubmit = async roleData => {
    try {
      // TODO: 调用API保存角色
      // const response = await saveRole(roleData)

      showToast('保存成功')
      showRoleForm.value = false
      currentRole.value = null

      // 重新加载角色列表
      roles.value = []
      finished.value = false
      await loadRoles()
    } catch (error) {
      console.error('保存角色失败:', error)
      showToast('保存失败')
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
</style>
