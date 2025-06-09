import { get, post } from '@/api/request.js'

// 获取车辆列表
export const fetchCarList = (params) => {
  return get('/carinform/page', params)
}

// 获取车辆详情
export const fetchCarDetail = (id) => {
  return get(`/carinform/getById?id=${id}`)
}

// 搜索车辆
export const searchCars = (keyword) => {
  return post('/cars/search', { keyword })
}

// 登录接口
export const login = (data) => {
  return post('/users/login', data)
}
