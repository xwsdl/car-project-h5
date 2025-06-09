<template>
  <div>{{ t('shoppingCart.developing') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineOptions({
  name: 'ShoppingCartView'
})
</script>

<style>
</style>