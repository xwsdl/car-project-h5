<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\UserManagement\components\UserEdit.vue
 * @Description: 用户编辑页面
-->
<template>
  <div class="user-edit">
    <van-nav-bar :title="$t('userManagement.editUser')" left-arrow @click-left="$emit('close')" />

    <div class="form-content">
      <van-form @submit="onSubmit">
        <van-cell-group inset :title="$t('userManagement.basicInfo')">
          <van-field
            v-model="formData.username"
            :label="$t('userManagement.username')"
            :placeholder="$t('userManagement.usernamePlaceholder')"
            :rules="[{ required: true, message: $t('userManagement.usernameRequired') }]"
          />

          <van-field
            v-model="formData.email"
            :label="$t('userManagement.email')"
            :placeholder="$t('userManagement.emailPlaceholder')"
            :rules="[
              { required: true, message: $t('userManagement.emailRequired') },
              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: $t('userManagement.emailInvalid') }
            ]"
          />

          <van-field
            v-model="formData.phone"
            :label="$t('userManagement.phone')"
            :placeholder="$t('userManagement.phonePlaceholder')"
            :rules="[{ pattern: /^1[3-9]\d{9}$/, message: $t('userManagement.phoneInvalid') }]"
          />

          <van-field
            :label="$t('userManagement.role')"
            readonly
            is-link
            @click="showRolePicker = true"
          >
            <template #input>
              <span>{{ $t(`roleManagement.roleTypes.${formData.role}`) }}</span>
            </template>
          </van-field>
        </van-cell-group>

        <van-cell-group inset :title="$t('userManagement.passwordSettings')">
          <van-field
            v-model="formData.newPassword"
            :label="$t('userManagement.newPassword')"
            :placeholder="$t('userManagement.newPasswordPlaceholder')"
            type="password"
            :rules="[{ min: 6, message: $t('userManagement.passwordMinLength') }]"
          />

          <van-field
            v-model="formData.confirmPassword"
            :label="$t('userManagement.confirmPassword')"
            :placeholder="$t('userManagement.confirmPasswordPlaceholder')"
            type="password"
            :rules="[
              { validator: validatePassword, message: $t('userManagement.passwordNotMatch') }
            ]"
          />
        </van-cell-group>

        <div class="form-actions">
          <van-button type="default" block @click="$emit('close')">
            {{ $t('common.cancel') }}
          </van-button>
          <van-button type="primary" block native-type="submit" :loading="submitting">
            {{ $t('common.save') }}
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 角色选择器 -->
    <van-popup v-model:show="showRolePicker" position="bottom">
      <van-picker
        :columns="roleColumns"
        @confirm="onRoleConfirm"
        @cancel="showRolePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { showToast } from 'vant'

  const { t } = useI18n()

  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['close', 'save'])

  // 响应式数据
  const submitting = ref(false)
  const showRolePicker = ref(false)
  const formData = ref({
    username: '',
    email: '',
    phone: '',
    status: '已激活', // 保留但不允许编辑
    role: 'normal',
    newPassword: '',
    confirmPassword: ''
  })

  // 角色选项
  const roleColumns = [
    { text: t('roleManagement.roleTypes.normal'), value: 'normal' },
    { text: t('roleManagement.roleTypes.customerService'), value: 'customerService' },
    { text: t('roleManagement.roleTypes.admin'), value: 'admin' },
    { text: t('roleManagement.roleTypes.superAdmin'), value: 'superAdmin' }
  ]

  // 密码验证
  const validatePassword = () => {
    if (
      formData.value.newPassword &&
      formData.value.newPassword !== formData.value.confirmPassword
    ) {
      return false
    }
    return true
  }

  // 角色确认
  const onRoleConfirm = value => {
    formData.value.role = value.value
    showRolePicker.value = false
  }

  // 表单提交
  const onSubmit = async () => {
    try {
      submitting.value = true

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      const submitData = {
        ...formData.value,
        id: props.user.id
      }

      showToast('保存成功')
      emit('save', submitData)
    } catch (error) {
      console.error('保存失败:', error)
      showToast('保存失败')
    } finally {
      submitting.value = false
    }
  }

  // 监听用户数据变化，初始化表单
  watch(
    () => props.user,
    newUser => {
      if (newUser) {
        // 适配新的数据结构
        formData.value = {
          username: newUser.username || '',
          email: newUser.email || '',
          phone: newUser.phone || '',
          status: newUser.status || '已激活',
          role: newUser.role || 'normal',
          newPassword: '',
          confirmPassword: ''
        }
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .user-edit {
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
