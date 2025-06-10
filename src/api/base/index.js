/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 20:54:50
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-09 21:04:46
 * @FilePath: \car-project-h5\src\api\base\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from '@/api/request.js'
const moduleName = 'base'
// 获取车辆列表
export const fetchCarList = (params) => {
  return get(`/${moduleName}/carinform/page`, params)
}

// 获取车辆详情
export const fetchCarDetail = (id) => {
  return get(`/${moduleName}/carinform/getById?id=${id}`)
}

// 搜索车辆
export const searchCars = (keyword) => {
  return post(`/${moduleName}/cars/search`, { keyword })
}

// 登录接口
export const login = (data) => {
  return post(`/${moduleName}/users/login`, data)
}
