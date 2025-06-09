<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-09 09:14:40
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-09 11:04:00
 * @FilePath: \car-h5-project\src\components\LanguageSwitcher\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="locale" :options="languageOptions" @change="changeLanguage" />
  </van-dropdown-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

// 语言选项
const languageOptions = computed(() => [
  { text: t('common.languages.zh'), value: 'zh-CN' },
  { text: t('common.languages.ru'), value: 'ru-RU' },
])

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)

  // 更新 Vant 语言
  // const vantLang = messages[lang]?.vant
  // if (vantLang) {
  //   Locale.use(lang, vantLang)
  // }
}
</script>