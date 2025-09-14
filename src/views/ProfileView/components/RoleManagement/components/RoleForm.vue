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

          <van-field :label="$t('roleManagement.status')">
            <template #input>
              <van-radio-group v-model="formData.status" direction="horizontal">
                <van-radio :name="1">{{ t('roleManagement.statusOption.active') }}</van-radio>
                <van-radio :name="0">{{ t('roleManagement.statusOption.inactive') }}</van-radio>
              </van-radio-group>
            </template>
          </van-field>
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
  const formData = ref({
    name: '',
    description: '',
    status: '1'
  })

  // 是否为编辑模式
  const isEdit = computed(() => !!props.role)

  // 表单提交
  const onSubmit = async () => {
    try {
      submitting.value = true

      // 确保status被转换为数字类型后提交
      const submitData = {
        ...formData.value,
        id: props.role?.id,
        status: +formData.value.status // 转换为数字类型
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
          id: newRole.id,
          name: newRole.roleName || '',
          description: newRole.description || '',
          status: +newRole.status
        }
      } else {
        // 重置表单
        formData.value = {
          name: '',
          description: '',
          status: 1
        }
      }
    },
    { immediate: true, deep: true }
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
