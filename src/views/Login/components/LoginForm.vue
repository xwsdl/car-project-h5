<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 11:25:52
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-12 15:31:36
 * @FilePath: \car-h5-project\src\views\Login\components\LoginForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login-form">
    <div class="login-form__header">
      <span>{{ $t('login.accountLogin') }}</span>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          :label="$t('login.account')"
          :placeholder="$t('login.account')"
          :rules="[{ required: true, message: `${$t('login.fillIn')}${$t('login.account')}` }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          :label="$t('login.password')"
          :placeholder="$t('login.password')"
          :rules="[{ required: true, message: `${$t('login.fillIn')}${$t('login.password')}` }]"
        />
        <div class="login-form__options">
          <van-checkbox v-model="checked" shape="square">{{ $t('login.individual') }}</van-checkbox>
        </div>
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" color="223C61">
          {{ $t('login.login') }}
        </van-button>

        <van-button style="margin-top: 16px" round block type="default" @click="handleGoHome">
          {{ $t('login.backHome') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
  import { login, getUserInfo } from '@/api/base/index.js'
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const username = ref('')
  const password = ref('')
  const checked = ref(false)
  const onSubmit = values => {
    login({
      username: values.username,
      password: values.password,
      rememberMe: checked.value
    }).then(async res => {
      const userInfo = await getUserInfo(res.userId)
      console.log('userInfo', userInfo)
      // 保存用户信息和token
      authStore.login(userInfo, res.token)
      // 检查是否有重定向路径
      const redirect = route.query.redirect

      setTimeout(() => {
        console.log('redirect', redirect)
        if (redirect) {
          router.push(redirect)
        } else {
          router.push('/home')
        }
      }, 800)
    })
  }

  const handleGoHome = () => {
    router.push('/')
  }
</script>

<style lang="scss" scoped>
  .login-form {
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
