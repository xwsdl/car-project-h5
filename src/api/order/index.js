import { get, post, put } from '@/api/request.js'


/**
 * @description 创建订单
 * @param {Object} data
 */
export const createOrder = (data) => {
  return post(`/orders`, data)
}


/**
 * @description 查询用户订单列表
 * @param {string} userId
 */
export const fetchUserOrder = (userId) => {
  return get(`/orders/user/${userId}`)
}


/**
 * @description 获取订单详情
 * @param {Object} id
 */
export const fetchOrderDetail = (id) => {
  return get(`/orders/${id}`)
}

/**
 * @description 更新订单状态
 * @param {Object} id
 */
export const updateOrderStatus = (id, data) => {
  return put(`/orders/${id}/status`, data)
}

/**
 * @description 取消订单
 * @param {Object} orderId
 */
export const cancelOrderStatus = (orderId) => {
  return put(`/orders/${orderId}/cancel`)
}



/**
 * @description 获取订单的所有流程节点
 * @param {Object} orderId
 */
export const fetchOrderAllProcessNodes = (orderId) => {
  return get(`/processNodes/order/${orderId}`)
}


/**
 * @description 获取订单的下一个待处理节点
 * @param {Object} orderId
 */
export const fetchOrderNextProcessNodes = (orderId) => {
  return get(`/processNodes/order/${orderId}/next`)
}


/**
 * @description 完成流程节点
 * @param {Object} data
 */
export const completeProcessNodes = (data) => {
  return post(`/processNodes/{id}/complete`, data)
}


/**
 * @description: 上传附件
 * @param {FormData} data FormData格式
 * @returns {Promise}
 */
export const uploadAttachments = (data, userId) => {
  // 如果是 FormData，需要特殊处理
  if (data instanceof FormData) {
    return post('/attachments/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-User-Id': userId
      }
    })
  }
  return post('/attachments/upload', data)
}


/**
 * @description 获取节点的所有附件
 * @param {Object} nodeId
 */
export const fetchAttachmentsNode = (nodeId) => {
  return get(`/attachments/node/${nodeId}
`)
}

