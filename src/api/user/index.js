/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 16:26:42
 * @FilePath: \car-project-h5\src\api\user\index.js
 * @Description: 用户管理API接口
 */
import { get, post, put, deleteRequest } from '@/api/request.js'

/**
 * @description 给用户分配角色
 * @param {Object} data
 */
export const saveUserRole = (data) => {
  return post(`/sys-user-role/assign`, data)
}


/**
 * @description 根据用户ID查询角色
 * @param {string} userId
 */
export const fetchUserRole = (userId) => {
  return get(`/sys-user-role/by-user/${userId}`)
}
