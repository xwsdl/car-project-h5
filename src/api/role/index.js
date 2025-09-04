/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 16:58:36
 * @FilePath: \car-project-h5\src\api\role\index.js
 * @Description: 角色管理API接口
 */
import { get, post, put, deleteRequest } from '@/api/request.js'

/**
 * @description 给角色分配权限
 * @param {Object} data
 */
export const saveRolePermission = (data) => {
  return post(`/sys-role-permission/assign`, data)
}

/**
 * @description 给角色分配菜单
 * @param {Object} data
 */
export const saveRoleMenu = (data) => {
  return post(`/sys-role-menu/assign`, data)
}

/**
 * @description 根据角色ID查询关联的菜单ID
 * @param {string} roleId
 */
export const fetchRoleMenu = (roleId) => {
  return get(`/sys-role-menu/by-role/${roleId}
`)
}

/**
 * @description 角色新增
 * @param {Object} data
 */
export const addRole = (data) => {
  return post(`/sys-role`, data)
}

/**
 * @description 修改角色
 * @param {Object} data
 */
export const updateRole = (data) => {
  return put(`/sys-role`, data)
}

/**
 * @description 查询所有角色
 * @param
 */
export const fetchAllRole = () => {
  return get(`/sys-role/all`)
}

/**
 * @description 批量删除角色
 * @param {Object} data
 */
export const deleteBatchRole = (data) => {
  return deleteRequest(`/sys-role/batch`, data)
}

/**
 * @description 分页查询角色
 * @param {Object} query
 */
export const fetchRolePage = (query) => {
  return get(`/sys-role/page`, query)
}

/**
 * @description 修改角色状态
 * @param {Object} data
 */
export const updateRoleStatus = (data) => {
  return put(`/sys-role/status`, data)
}

/**
 * @description 根据ID查询角色
 * @param {Object} id
 */
export const fetchRoleById = (id) => {
  return get(`/sys-role/${id}`)
}

/**
 * @description 删除角色
 * @param {Object} id
 */
export const deleteRole = (id) => {
  return deleteRequest(`/sys-role/${id}`)
}







