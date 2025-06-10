import axios from 'axios'
import { closeToast, showLoadingToast, showFailToast } from 'vant'
// 创建 Axios 实例
const service = axios.create({
  // baseURL: '/api', // 使用环境变量或默认值
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

console.log(import.meta.env.VITE_APP_BASE_API)
console.log('service-----', service)

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    const locale = localStorage.getItem('language') || 'zh-CN'

    if (token) {
      config.headers.Authorization = token
    }
    // 添加语言信息到请求头
    config.headers['Accept-Language'] = locale
    // 可在此处添加 token 等
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    })
    return config
  },
  (error) => {
    closeToast()
    showFailToast('请求发送失败')
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('响应数据:', response)
    closeToast()
    // 根据实际 API 结构调整
    if (response.data.status === 200||response.data.status === 0) {
    
      return response.data
    } else {
      showFailToast(response.data.message || '操作失败')
      return Promise.reject(response.data)
    }
  },
  (error) => {
    closeToast()
    let message = '请求失败'
    console.log('响应数据:', error)
    if (error.response) {
      console.log(error.response.status)
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误 ${error.response.status}`
      }
    } else if (error.request) {
      message = '服务器无响应'
    } else {
      message = error.message
    }

    showFailToast(message)
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

export default service
