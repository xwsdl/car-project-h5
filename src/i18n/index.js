
import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import ruRU from './locales/ru-RU.json'
import { Locale } from 'vant'
import vantZhCN from 'vant/es/locale/lang/zh-CN'
import vantRuRU from 'vant/es/locale/lang/ru-RU'
import { clearAllPageCache } from '@/utils/cache.js'
import eventBus, { EVENT_TYPES } from '@/utils/eventBus.js'
// 检查语言文件是否正确加载
console.log('加载的语言文件:', { zhCN, ruRU })
console.log('加载的语言文件22:', { vantZhCN, vantRuRU })

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('language') || 'ru-RU', // 从 localStorage 获取语言设置，默认
  fallbackLocale: 'zh-CN', // 回退语言
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
  missingWarn: false, // 关闭缺失警告
  fallbackWarn: false, // 关闭回退警告
  messages: {
    'zh-CN': zhCN,
    'ru-RU': ruRU,
  },
  globalInjection: true, // 全局注入 $t 函数
})

Locale.use(i18n.global.locale.value === 'zh-CN' ? vantZhCN : vantRuRU)

// 导出切换语言的方法
export const setLanguage = (lang) => {
  try {
    // 如果语言没有变化，直接返回
    if (i18n.global.locale.value === lang) {
      return
    }

    // 设置新语言
    i18n.global.locale.value = lang
    localStorage.setItem('language', lang)
    document.querySelector('html').setAttribute('lang', lang)
    Locale.use(lang === 'zh-CN' ? vantZhCN : vantRuRU)

    // 清除所有页面缓存
    clearAllPageCache()
    console.log('已清除所有页面缓存')

    // 触发语言切换事件，通知所有页面重新获取数据
    eventBus.emit(EVENT_TYPES.LANGUAGE_CHANGED, {
      newLanguage: lang,
      oldLanguage: i18n.global.locale.value,
      timestamp: Date.now()
    })

    // 触发数据刷新事件
    eventBus.emit(EVENT_TYPES.DATA_REFRESH_NEEDED, {
      reason: 'language_changed',
      language: lang,
      timestamp: Date.now()
    })

    console.log('语言切换成功:', lang)
  } catch (error) {
    console.error('语言切换失败:', error)
  }
}

// 导出获取当前语言的方法
export const getCurrentLanguage = () => {
  return i18n.global.locale.value
}

// 导出获取所有支持的语言的方法
export const getSupportedLanguages = () => {
  return Object.keys(i18n.global.messages.value)
}

export const t = i18n.global.t

export default i18n
