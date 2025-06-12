/*
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-09 21:07:38
 * @LastEditors: 肖蔚 xiaowei@yw105.wecom.work
 * @LastEditTime: 2025-06-13 00:38:37
 * @FilePath: \car-project-h5\src\api\jiSuApi\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get } from '@/api/request.js'

const moduleName = 'jisuapi'

const appkey = 'ab056d0c507cd969'
// 获取所有品牌车辆
export const fetchCarBrandList = (params) => {
  return get(`/car/brand?appkey=${appkey}`, params)
}

// 获取所有品牌车辆
export const fetchCarHotList = (params) => {
  return get(`/car/hot?appkey=${appkey}`, params)
}
