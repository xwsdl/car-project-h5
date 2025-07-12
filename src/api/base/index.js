/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-07-12 14:28:56
 * @FilePath: \car-project-h5\src\api\base\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from '@/api/request.js'
// 获取车辆列表
export const fetchCarList = (params) => {
  return get(`/carinform/page`, params)
}

// 获取车辆详情
export const fetchCarDetail = (id) => {
  return get(`/carinform/getById?id=${id}`)
}

// 搜索车辆
export const searchCars = (keyword) => {
  return post(`/cars/search`, { keyword })
}

// 登录接口
export const login = (data) => {
  return post(`/users/login`, data)
}

// 获取用户信息接口
export const getUserInfo = (id) => {
  return get(`/users/getUserById?id=${id}`)
}

// 注册接口
export const register = (params) => {
  return post(`/users/register`, {}, { params: params })
}

// 获取车辆列表
export const fetchCarBrandList = (params) => {
  return get(`/carinform/getCarBrand`, params)
}


/**
 * @description: 获取推荐车辆列表
 * @param {Object} params 请求参数 brand: 品牌描述
 * @returns
 */
export const fetchRecommend = (params) => {
  return get(`/carinform/ramRecommend`, params)
}

/**
 * @description: 修改用户信息
 * @param {Object|FormData} data 用户信息对象或FormData
 * @returns {Promise}
 */
export const updateUserInfo = (data) => {
  // 如果是 FormData，需要特殊处理
  if (data instanceof FormData) {
    return post('/users/updateUser', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  return post('/users/updateUser', data)
}
