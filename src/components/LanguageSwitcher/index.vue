<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="locale" :options="languageOptions" @change="changeLanguage" />
  </van-dropdown-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'vant'
import { messages } from '@/locales'

const { locale, t } = useI18n()


// 语言选项
const languageOptions = computed(() => [
  { text: t('common.languages.zh'), value: 'zh-CN' },
  { text: t('common.languages.ru'), value: 'ru-RU' },
])

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)

  // 更新 Vant 语言
  const vantLang = messages[lang]?.vant
  if (vantLang) {
    Locale.use(lang, vantLang)
  }
}
</script>