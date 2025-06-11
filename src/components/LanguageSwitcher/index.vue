<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="locale" :options="languageOptions" @change="changeLanguage" />
  </van-dropdown-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getCurrentLanguage } from '@/i18n/index.js'
const { locale, t } = useI18n()

// 语言选项
const languageOptions = computed(() => [
  { text: t('common.languages.zh'), value: 'zh-CN' },
  { text: t('common.languages.ru'), value: 'ru-RU' },
])

const changeLanguage = (lang) => {
  setLanguage(lang)
}
</script>
