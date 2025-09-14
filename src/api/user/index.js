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

/**
 * @description 查询用户列表（支持分页和搜索）
 * @param {Object} params 查询参数
 * @param {number} params.pageNo 页码
 * @param {number} params.pageSize 每页条数
 * @param {string} params.userName 用户名搜索
 * @param {string} params.email 邮箱搜索
 * @param {string} params.phone 手机号搜索
 * @param {number} params.isAllocate 是否分配客服
 * @param {string} params.sortBy 排序字段
 * @param {boolean} params.isAsc 是否升序
 */
export const fetchUserList = (params = {}) => {
  // 移除不必要的multipart/form-data设置，因为传递的是普通对象
  return post(`/users/getAllUser`, params)
}

/**
 * @description 用户信息修改
 * @param {Object} data
 */
export const updateUserRole = (data) => {
  return post(`/users/updateUser`, data)
}

/**
 * @description 激活用户
 * @param {Object} data
 * @param {string} data.userId 用户ID
 */
export const activateUser = (data) => {
  return post(`/users/activate`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * @description 停用用户
 * @param {Object} data
 * @param {string} data.userId 用户ID
 */
export const freezeUser = (data) => {
  return post(`/users/freeze`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}