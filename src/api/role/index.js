/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\api\role\index.js
 * @Description: 角色管理API接口
 */
import request from '../request'

// 获取角色列表
export const getRoleList = (params) => {
    return request({
        url: '/role/list',
        method: 'get',
        params
    })
}

// 获取角色详情
export const getRoleDetail = (id) => {
    return request({
        url: `/role/${id}`,
        method: 'get'
    })
}

// 创建角色
export const createRole = (data) => {
    return request({
        url: '/role/create',
        method: 'post',
        data
    })
}

// 更新角色
export const updateRole = (id, data) => {
    return request({
        url: `/role/${id}`,
        method: 'put',
        data
    })
}

// 删除角色
export const deleteRole = (id) => {
    return request({
        url: `/role/${id}`,
        method: 'delete'
    })
}

// 获取权限列表
export const getPermissionList = () => {
    return request({
        url: '/permission/list',
        method: 'get'
    })
}

// 分配角色权限
export const assignRolePermissions = (roleId, permissions) => {
    return request({
        url: `/role/${roleId}/permissions`,
        method: 'post',
        data: { permissions }
    })
}
