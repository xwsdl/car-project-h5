<template>
  <div class="login">
    <div>
      <LanguageSwitcher />
    </div>
    <LoginHeader />
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from './components/LoginForm.vue'
import LoginHeader from './components/LoginHeader.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
}
</style>
