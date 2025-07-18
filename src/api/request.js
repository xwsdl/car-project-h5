import axios from 'axios'
import { closeToast, showLoadingToast, showToast } from 'vant'
import { t } from '@/i18n'
// 全局请求计数器
let requestCount = 0
// 创建 Axios 实例
const service = axios.create({
  baseURL: '/api', // 使用环境变量或默认值
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    const locale = localStorage.getItem('language') || 'zh-CN'
    // 增加请求计数
    requestCount++

    if (token) {
      config.headers.Authorization = token
    }
    // 添加语言信息到请求头
    config.headers['Accept-Language'] = locale

    // 如果是 FormData，不设置 Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    // 可在此处添加 token 等
    if (requestCount === 1) {
      showLoadingToast({
        message: t('request.loading'),
        forbidClick: true,
        duration: 0,
      })
    }
    return config
  },
  (error) => {
    requestCount = Math.max(0, requestCount - 1)
    // 当没有请求时关闭Toast
    if (requestCount === 0) {
      closeToast()
    }
    showToast(t('request.sendFail'))
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 减少请求计数
    requestCount = Math.max(0, requestCount - 1);

    // 当没有请求时关闭Toast
    if (requestCount === 0) {
      closeToast();
    }

    // 根据实际 API 结构调整
    if (response.data.status === 200 || response.data.status === 0) {
      return response.data
    } else {
      showToast(response.data.msg || t('request.operateFail'))
      return Promise.reject(response.data)
    }
  },
  (error) => {
    console.log('请求失败：', error)
    requestCount = Math.max(0, requestCount - 1);

    // 当没有请求时关闭Toast
    if (requestCount === 0) {
      closeToast();
    }
    let message = t('request.fail')
    if (error.response) {
      console.log(error.response.status)
      switch (error.response.status) {
        case 400:
          message = t('request.paramError')
          break
        case 401:
          message = t('request.unauthorized')
          break
        case 403:
          message = t('request.forbidden')
          break
        case 404:
          message = t('request.notFound')
          break
        case 500:
          message = t('request.serverError')
          break
        default:
          message = t('request.connectError') + ' ' + error.response.status
      }
    } else if (error.request) {
      message = t('request.noResponse')
    } else {
      message = error.message
    }

    showToast(message)
    return Promise.reject(error)
  },
)

/**
 * 封装请求方法
 * @param {Object} options 请求配置
 * @returns {Promise} Promise 对象
 */
export function createRequest(options) {
  return new Promise((resolve, reject) => {
    service(options)
      .then((response) => {
        resolve(response.data || response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 封装常用方法
export const get = (url, params = {}, config = {}) => {
  return createRequest({
    url,
    method: 'get',
    params,
    ...config,
  })
}

export const post = (url, data = {}, config = {}) => {
  return createRequest({
    url,
    method: 'post',
    data,
    ...config,
  })
}

export const put = (url, data = {}, config = {}) => {
  return createRequest({
    url,
    method: 'put',
    data,
    ...config,
  })
}

export default service
