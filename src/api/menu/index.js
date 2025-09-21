/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-04 16:05:54
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-04 17:05:40
 * @FilePath: \car-project-h5\src\api\permission\index.js
 * @Description: 菜单API接口
 */
import { get, post, put, deleteRequest } from '@/api/request.js'

/**
 * @description 新增菜单
 * @param {Object} data
 */
export const addMenu = (data) => {
  return post(`/sys-menu/addMenu`, data)
}

/**
 * @description 获取树形菜单结构
 * @param {string} roleId
 */
export const fetchMenuTree = () => {
  return get(`/sys-menu/all`)
}

/**
 * @description 修改菜单
 * @param {Object} id
 */
export const updateMenu = (data) => {
  return put(`/sys-menu/updateMenu`, data)
}

/**
 * @description 获取用户菜单
 */
export const fetchUserMenus = () => {
  return get(`sys-menu/user-menus`)
}

/**
 * @description 根据菜单id查询菜单
 * @param {string} id
 */
export const fetchMenuById = (id) => {
  return get(`/sys-menu/${id}`)
}

/**
 * @description 删除菜单
 * @param {string} id
 */
export const deleteMenu = (id) => {
  return deleteRequest(`/sys-menu/${id}`)
}

