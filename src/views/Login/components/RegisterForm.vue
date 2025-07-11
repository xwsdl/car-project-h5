<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-27 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-11 14:03:15
 * @FilePath: \car-h5-project\src\views\Login\components\RegisterForm.vue
 * @Description: 注册表单组件
-->
<template>
  <div class="register-form">
    <div class="register-form__header">
      <span>{{ $t('login.registerAccount') }}</span>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          :label="$t('login.account')"
          :placeholder="$t('login.account')"
          :rules="usernameRules"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          :label="$t('login.password')"
          :placeholder="$t('login.password')"
          :rules="passwordRules"
        />
        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          :label="$t('login.confirmPassword')"
          :placeholder="$t('login.confirmPassword')"
          :rules="confirmPasswordRules"
        />
        <div class="register-form__options">
          <van-checkbox v-model="checked" shape="square">{{ $t('login.individual') }}</van-checkbox>
        </div>
      </van-cell-group>

      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          color="223C61"
          :loading="loading"
        >
          {{ $t('login.register') }}
        </van-button>

        <van-button
          style="margin-top: 16px"
          round
          block
          type="default"
          @click="handleGoHome"
        >
          {{ $t('login.backHome') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { register } from '@/api/base/index.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { getAccountRules, getPasswordRules, getConfirmPasswordRules } from '@/utils/validation.js'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const checked = ref(false)
const loading = ref(false)

// 账号验证规则
const usernameRules = getAccountRules(t)

// 密码验证规则
const passwordRules = getPasswordRules(t)

// 确认密码验证规则
const confirmPasswordRules = computed(() => getConfirmPasswordRules(t, password.value))

const onSubmit = async (values) => {
  if (!checked.value) {
    showToast(t('login.individual'))
    return
  }

  if (password.value !== confirmPassword.value) {
    showToast(t('login.passwordNotMatch'))
    return
  }

  loading.value = true

  try {
    await register({
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
    })

    showSuccessToast(t('login.registerSuccess'))

    // 注册成功后可以选择自动登录或跳转到登录页
    setTimeout(() => {
      // 这里可以根据业务需求决定是否自动登录
      // 目前先跳转到登录页
      router.push('/login')
    }, 1500)

  } catch (error) {
    console.error('注册失败:', error)

    // 根据错误类型显示不同的错误信息
    if (error.response?.data?.message) {
      showToast(error.response.data.message)
    } else if (error.message?.includes('already exists')) {
      showToast(t('login.accountExists'))
    } else {
      showToast(t('login.registerFail'))
    }
  } finally {
    loading.value = false
  }
}

const handleGoHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.register-form {
  background-color: #fff;
  margin-top: 20px;

  &__header {
    padding: 10px 20px;
    font-size: 16px;
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
    text-align: center;
    font-weight: 600;
  }

  &__options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 16px;
  }
}
</style>
