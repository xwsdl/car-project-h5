/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-04 16:05:54
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 16:17:53
 * @FilePath: \car-project-h5\src\api\permission\index.js
 * @Description: 权限API接口
 */
import { get, post, put, deleteRequest } from '@/api/request.js'

/**
 * @description 新增权限
 * @param {Object} data
 */
export const addPermission = (data) => {
  return post(`/sys-permission/addPermission`, data)
}


/**
 * @description 根据角色ID查询权限
 * @param {string} roleId
 */
export const fetchUserOrder = (roleId) => {
  return get(`/sys-permission/by-role/${roleId}`)
}

/**
 * @description 查询所有权限
 */
export const fetchAllPermission = () => {
  return get(`/sys-permission/all`)
}


/**
 * @description 修改权限
 * @param {Object} id
 */
export const updateOrderStatus = (data) => {
  return put(`/sys-permission/updatePermission`, data)
}

/**
 * @description 删除权限
 * @param {Object} nodeId
 */
export const fetchAttachmentsNode = (id) => {
  return deleteRequest(`/sys-permission/${id}`)
}

