<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-04 16:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 16:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\PermissionManagement\components\PermissionForm.vue
 * @Description: 权限表单组件
-->
<template>
  <div class="permission-form">
    <van-nav-bar
      :title="
        permission
          ? $t('permissionManagement.editPermission')
          : $t('permissionManagement.addPermission')
      "
      left-arrow
      @click-left="handleCancel"
    />

    <div class="form-content">
      <!-- 权限名称 -->
      <van-field
        v-model="formData.permissionName"
        :label="$t('permissionManagement.permissionName')"
        :placeholder="$t('permissionManagement.permissionNamePlaceholder')"
        :rules="[{ required: true, message: $t('permissionManagement.permissionNamePlaceholder') }]"
      />

      <!-- 权限标识 -->
      <van-field
        v-model="formData.permissionKey"
        :label="$t('permissionManagement.permissionKey')"
        placeholder="请输入权限标识（格式：模块:资源:操作）"
        :rules="[{ required: true, message: t('permissionManagement.permissionKey') + '不能为空' }]"
      />

      <!-- API路径 -->
      <van-field
        v-model="formData.apiPath"
        :label="$t('permissionManagement.apiPath')"
        placeholder="请输入接口路径"
      />

      <!-- HTTP方法 -->
      <van-field
        v-model="formData.method"
        :label="$t('permissionManagement.httpMethod')"
        placeholder="GET/POST/PUT/DELETE等"
      />

      <!-- 权限描述 -->
      <van-field
        v-model="formData.description"
        :label="$t('permissionManagement.permissionDescription')"
        :placeholder="$t('permissionManagement.permissionDescriptionPlaceholder')"
        type="textarea"
        :rows="3"
      />

      <!-- 上级权限选择 -->
      <van-field
        :label="$t('permissionManagement.parentPermission')"
        :placeholder="$t('permissionManagement.noParentPermission')"
        readonly
      />

      <!-- 排序号 -->
      <van-field
        v-model.number="formData.sort"
        :label="$t('permissionManagement.sortNumber')"
        placeholder="请输入排序号"
        type="number"
      />
    </div>

    <!-- 底部操作按钮 -->
    <div class="form-actions">
      <van-button type="default" @click="handleCancel">
        {{ $t('common.cancel') }}
      </van-button>
      <van-button type="primary" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </van-button>
    </div>

    <!-- 上级权限选择器 -->
    <van-popup
      v-model:show="showParentPermissionPicker"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="parent-permission-picker">
        <van-nav-bar
          :title="$t('permissionManagement.parentPermission')"
          left-arrow
          @click-left="showParentPermissionPicker = false"
        />
        <van-tree-select
          v-model="selectedParentId"
          :items="permissionTree"
          :main-active-index="activeIndex"
          @click-nav="handleClickNav"
          @click-item="handleClickItem"
          class="permission-tree-select"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { showToast } from 'vant'
  import { fetchAllPermission } from '@/api/permission/index.js'

  const props = defineProps({
    // 权限数据，有值表示编辑，无值表示新增
    permission: {
      type: Object,
      default: null
    }
  })

  const emit = defineEmits(['submit', 'cancel'])

  const { t } = useI18n()

  // 响应式数据
  const formData = ref({
    id: 0,
    permissionName: '',
    permissionKey: '',
    description: '',
    parentId: 0,
    apiPath: '',
    method: '',
    sort: 0,
    status: 1 // 1表示启用，0表示禁用
  })

  const permissionList = ref([])
  const permissionTree = ref([])
  const showParentPermissionPicker = ref(false)
  const selectedParentId = ref(null)
  const activeIndex = ref(0)

  // 计算属性：根据selectedParentId获取选中的上级权限
  const selectedParentPermission = computed(() => {
    return permissionList.value.find(p => p.id === selectedParentId.value)
  })

  // 初始化表单数据
  const initFormData = () => {
    if (props.permission) {
      // 编辑模式，填充已有数据
      formData.value = {
        id: props.permission.id || 0,
        permissionName: props.permission.name || props.permission.permissionName || '',
        permissionKey: props.permission.permissionCode || props.permission.permissionKey || '',
        description: props.permission.description || '',
        parentId: props.permission.parentId || 0,
        apiPath: props.permission.apiPath || '',
        method: props.permission.method || '',
        sort: props.permission.sort || 0,
        status: props.permission.status !== undefined ? props.permission.status : 1
      }
      selectedParentId.value = props.permission.parentId || 0
    } else {
      // 新增模式，重置表单
      formData.value = {
        id: 0,
        permissionName: '',
        permissionKey: '',
        description: '',
        parentId: 0,
        apiPath: '',
        method: '',
        sort: 0,
        status: 1
      }
      selectedParentId.value = 0
    }
  }

  // 加载权限列表，用于构建权限树
  const loadPermissionList = async () => {
    try {
      const response = await fetchAllPermission()
      if (response && Array.isArray(response)) {
        permissionList.value = response
        buildPermissionTree()
      }
    } catch (error) {
      console.error('加载权限列表失败:', error)
      showToast(error.message || '加载失败')
    }
  }

  // 构建权限树结构
  const buildPermissionTree = () => {
    // 过滤掉当前编辑的权限（防止自己作为上级权限）
    const filteredPermissions = props.permission
      ? permissionList.value.filter(p => p.id !== props.permission.id)
      : permissionList.value

    // 构建树结构
    const tree = []
    const map = new Map()

    // 将所有权限放入map中
    filteredPermissions.forEach(permission => {
      map.set(permission.id, { ...permission, children: [] })
    })

    // 构建树结构
    filteredPermissions.forEach(permission => {
      if (permission.parentId && map.has(permission.parentId)) {
        map.get(permission.parentId).children.push(map.get(permission.id))
      } else if (!permission.parentId) {
        tree.push(map.get(permission.id))
      }
    })

    // 转换为TreeSelect所需的格式
    permissionTree.value = tree.map(item => ({
      text: item.name,
      id: item.id,
      children: item.children.map(child => ({
        text: child.name,
        id: child.id
      }))
    }))
  }

  // 导航点击事件
  const handleClickNav = index => {
    activeIndex.value = index
  }

  // 节点点击事件
  const handleClickItem = data => {
    selectedParentId.value = data.id
    showParentPermissionPicker.value = false
    showToast(t('permissionManagement.parentPermissionSelected'))
  }

  // 取消操作
  const handleCancel = () => {
    emit('cancel')
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证表单
    if (!formData.value.permissionName.trim()) {
      showToast(t('permissionManagement.permissionNamePlaceholder'))
      return
    }

    if (!formData.value.permissionKey.trim()) {
      showToast(t('permissionManagement.permissionKey') + '不能为空')
      return
    }

    // 提交数据 - 隐式添加status字段并设为启用(1)，即使它不在表单中显示
    const submitData = {
      ...formData.value,
      parentId: selectedParentId.value === 0 ? 0 : selectedParentId.value,
      status: 1 // 始终提交为启用状态
    }

    // 确保新增权限时默认是顶层权限
    if (!props.permission && submitData.parentId === null) {
      submitData.parentId = 0
    }

    emit('submit', submitData)
  }

  // 监听props.permission变化，重新初始化表单
  watch(
    () => props.permission,
    () => {
      initFormData()
      loadPermissionList()
    },
    { immediate: true }
  )

  // 组件挂载时加载权限列表
  onMounted(() => {
    loadPermissionList()
  })
</script>

<style lang="scss" scoped>
  .permission-form {
    .form-content {
      padding: 15px;
      padding-bottom: 100px; /* 添加足够的底部内边距，确保内容不被底部按钮覆盖 */
      background-color: #fff;
    }

    .form-actions {
      padding: 15px;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      z-index: 10;
      display: flex;
      gap: 10px;
    }

    .form-actions .van-button {
      flex: 1;
      margin-bottom: 0;
    }

    .parent-permission-picker {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .permission-tree-select {
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
