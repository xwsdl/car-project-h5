/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-01-20 10:00:00
 * @FilePath: \car-project-h5\src\api\user\index.js
 * @Description: 用户管理API接口
 */
import request from '../request'

// 获取用户列表
export const getUserList = (params) => {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

// 获取用户详情
export const getUserDetail = (id) => {
    return request({
        url: `/user/${id}`,
        method: 'get'
    })
}

// 创建用户
export const createUser = (data) => {
    return request({
        url: '/user/create',
        method: 'post',
        data
    })
}

// 更新用户
export const updateUser = (id, data) => {
    return request({
        url: `/user/${id}`,
        method: 'put',
        data
    })
}

// 删除用户
export const deleteUser = (id) => {
    return request({
        url: `/user/${id}`,
        method: 'delete'
    })
}

// 重置用户密码
export const resetUserPassword = (id) => {
    return request({
        url: `/user/${id}/reset-password`,
        method: 'post'
    })
}

// 启用用户
export const activateUser = (id) => {
    return request({
        url: `/user/${id}/activate`,
        method: 'post'
    })
}

// 停用用户
export const suspendUser = (id) => {
    return request({
        url: `/user/${id}/suspend`,
        method: 'post'
    })
}

// 分配用户角色
export const assignUserRole = (userId, roleId) => {
    return request({
        url: `/user/${userId}/role`,
        method: 'post',
        data: { roleId }
    })
}

// 获取用户权限
export const getUserPermissions = (id) => {
    return request({
        url: `/user/${id}/permissions`,
        method: 'get'
    })
}
