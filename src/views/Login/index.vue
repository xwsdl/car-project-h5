<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-09 09:14:40
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-20 10:36:57
 * @FilePath: \car-h5-project\src\views\Login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login">
    <div v-if="false">
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
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
}
</style>
