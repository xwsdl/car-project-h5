import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import ruRU from './ru-RU'
import { Locale } from 'vant'
import zhCNVant from 'vant/es/locale/lang/zh-CN'
import ruRUVant from 'vant/es/locale/lang/ru-RU'

export const messages = {
  'zh-CN': { ...zhCN, vant: zhCNVant },
  'ru-RU': { ...ruRU, vant: ruRUVant },
}

// 从本地存储获取语言设置，默认为中文
const savedLocale = localStorage.getItem('locale') || 'zh-CN'
// 初始化时设置 Vant 语言
Locale.use(savedLocale, messages[savedLocale].vant)

export default createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages,
})
