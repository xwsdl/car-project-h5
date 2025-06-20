<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-06-20 10:38:49
 * @FilePath: \car-project-h5\src\components\LanguageSwitcher\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="lang-switch-btn" @click="toggleLanguage">
    {{ currentLangText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '@/i18n/index.js'
const { locale, t } = useI18n()

const langMap = {
  'zh-CN': () => t('common.languages.zh'),
  'ru-RU': () => t('common.languages.ru'),
}

const currentLangText = computed(() => {
  return langMap[locale.value] ? langMap[locale.value]() : locale.value
})

const toggleLanguage = () => {
  const nextLang = locale.value === 'zh-CN' ? 'ru-RU' : 'zh-CN'
  setLanguage(nextLang)
}
</script>

<style scoped lang="scss">
.lang-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-size: 14px;
  font-weight: 600;
  color: #1989fa;
  cursor: pointer;
  user-select: none;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s;
  padding: 0 5px;
  &:active {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}
</style>

<script>
export default {
  name: 'LanguageSwitcher',
}
</script>
