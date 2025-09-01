<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\RoleManagement\components\RoleForm.vue
 * @Description: 角色表单组件
-->
<template>
  <div class="role-form">
    <van-nav-bar
      :title="isEdit ? $t('roleManagement.editRole') : $t('roleManagement.addRole')"
      left-arrow
      @click-left="$emit('cancel')"
    />

    <div class="form-content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formData.name"
            :label="$t('roleManagement.roleName')"
            :placeholder="$t('roleManagement.roleNamePlaceholder')"
            :rules="[{ required: true, message: $t('roleManagement.roleNameRequired') }]"
          />

          <van-field
            v-model="formData.description"
            :label="$t('roleManagement.roleDescription')"
            :placeholder="$t('roleManagement.roleDescriptionPlaceholder')"
            type="textarea"
            rows="3"
          />

          <van-field
            :label="$t('roleManagement.roleType')"
            readonly
            is-link
            @click="showTypePicker = true"
          >
            <template #input>
              <span>{{ getRoleTypeText(formData.type) }}</span>
            </template>
          </van-field>
        </van-cell-group>

        <!-- 权限配置 -->
        <van-cell-group inset :title="$t('roleManagement.permissions')">
          <van-checkbox-group v-model="formData.permissions">
            <van-cell
              v-for="permission in availablePermissions"
              :key="permission.value"
              :title="permission.label"
              clickable
              @click="togglePermission(permission.value)"
            >
              <template #right-icon>
                <van-checkbox :name="permission.value" />
              </template>
            </van-cell>
          </van-checkbox-group>
        </van-cell-group>

        <div class="form-actions">
          <van-button type="default" block @click="$emit('cancel')">
            {{ $t('common.cancel') }}
          </van-button>
          <van-button type="primary" block native-type="submit" :loading="submitting">
            {{ $t('common.save') }}
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 角色类型选择器 -->
    <van-popup v-model:show="showTypePicker" position="bottom">
      <van-picker
        :columns="roleTypeColumns"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    role: {
      type: Object,
      default: null
    }
  })

  const emit = defineEmits(['submit', 'cancel'])

  // 响应式数据
  const submitting = ref(false)
  const showTypePicker = ref(false)
  const formData = ref({
    name: '',
    description: '',
    type: 'normal',
    permissions: []
  })

  // 是否为编辑模式
  const isEdit = computed(() => !!props.role)

  // 角色类型选项
  const roleTypeColumns = [
    { text: t('roleManagement.roleTypes.normal'), value: 'normal' },
    { text: t('roleManagement.roleTypes.customerService'), value: 'customerService' },
    { text: t('roleManagement.roleTypes.admin'), value: 'admin' },
    { text: t('roleManagement.roleTypes.superAdmin'), value: 'superAdmin' }
  ]

  // 可用权限列表
  const availablePermissions = [
    { label: t('roleManagement.permissions.basicAccess'), value: 'basic_access' },
    { label: t('roleManagement.permissions.customerService'), value: 'customer_service' },
    { label: t('roleManagement.permissions.roleManagement'), value: 'role_management' },
    { label: t('roleManagement.permissions.userManagement'), value: 'user_management' },
    { label: t('roleManagement.permissions.orderManagement'), value: 'order_management' },
    { label: t('roleManagement.permissions.systemConfig'), value: 'system_config' }
  ]

  // 获取角色类型文本
  const getRoleTypeText = type => {
    const typeItem = roleTypeColumns.find(item => item.value === type)
    return typeItem ? typeItem.text : ''
  }

  // 切换权限
  const togglePermission = permission => {
    const index = formData.value.permissions.indexOf(permission)
    if (index > -1) {
      formData.value.permissions.splice(index, 1)
    } else {
      formData.value.permissions.push(permission)
    }
  }

  // 角色类型确认
  const onTypeConfirm = value => {
    formData.value.type = value.value
    showTypePicker.value = false
  }

  // 表单提交
  const onSubmit = async () => {
    try {
      submitting.value = true

      const submitData = {
        ...formData.value,
        id: props.role?.id
      }

      emit('submit', submitData)
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitting.value = false
    }
  }

  // 监听角色数据变化，初始化表单
  watch(
    () => props.role,
    newRole => {
      if (newRole) {
        formData.value = {
          name: newRole.name || '',
          description: newRole.description || '',
          type: newRole.type || 'normal',
          permissions: [...(newRole.permissions || [])]
        }
      } else {
        // 重置表单
        formData.value = {
          name: '',
          description: '',
          type: 'normal',
          permissions: []
        }
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .role-form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }

  .form-actions {
    padding: 15px;
    display: flex;
    gap: 10px;

    .van-button {
      flex: 1;
    }
  }
</style>
