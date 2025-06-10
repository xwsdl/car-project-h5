import { get } from '@/api/request.js'

const moduleName = 'jisuapi'

const appkey = 'ab056d0c507cd969'
// 获取所有品牌车辆
export const fetchCarBrandList = (params) => {
  return get(`/${moduleName}/car/brand?appkey=${appkey}`, params)
}

// 获取所有品牌车辆
export const fetchCarHotList = (params) => {
  return get(`/${moduleName}/car/hot?appkey=${appkey}`, params)
}
