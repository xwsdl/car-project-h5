<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-09 09:14:40
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-11 22:18:04
 * @FilePath: \car-h5-project\src\views\Login\index.vue
 * @Description: 登录注册页面
-->
<template>
  <div class="login-page">
    <div class="login-page__language">
      <LanguageSwitcher />
    </div>
    <div class="login-page__tabs">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <van-tab :title="$t('login.login')" name="login">
          <LoginForm />
        </van-tab>
        <van-tab :title="$t('login.register')" name="register">
          <RegisterForm @login="() => (activeTab = 'login')" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import LoginForm from './components/LoginForm.vue'
  import RegisterForm from './components/RegisterForm.vue'
  import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  // 定义组件名称
  defineOptions({
    name: 'LoginPage'
  })
  
  console.log(route)

  const activeTab = ref(route.query.activeTab || 'login')

  const handleTabChange = name => {
    activeTab.value = name
  }
</script>

<style lang="scss" scoped>
  .login-page {
    width: 100%;
    &__language {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
    }

    &__tabs {
      margin-top: 20px;

      :deep(.van-tabs__wrap) {
        background-color: #fff;
      }

      :deep(.van-tab) {
        color: #666;
        font-size: 16px;
      }
      :deep(.van-tab--active) {
        color: #223c61;
        font-weight: 600;
      }
      :deep(.van-tabs__line) {
        background-color: #223c61;
      }
    }
  }
</style>
