<template>
  <div class="login-header">
    <div class="login-header__title">{{$t('login.welcome')}}</div>
    <div class="login-header__subtitle">{{$t('login.welcomeTip')}}</div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.login-header {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  text-align: center;
  color: #fff;
  background-color: #1989fa;
  padding: 8px;
  &__title {
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: 600;
  }
  &__subtitle {
    font-size: 16px;
  }
}
</style>