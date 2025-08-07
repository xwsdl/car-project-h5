import { get, post, put } from '@/api/request.js'

/**
 * @description 获取对话列表
 * @param
 */
export const fetchConversationList = () => {
  return get(`/api/chat/conversations`)
}
/**
 * @description 创建对话
 * @param {Object} data
 */
export const createConversation = (data) => {
  return post(`/api/chat/conversations`, data)
}

/**
 * @description 关闭对话
 * @param {Object} data
 */
export const closeConversation = (data) => {
  const { conversationId } = data
  return put(`/api/chat/conversations/${conversationId}/close`, data)
}

/**
 * @description 获取会话消息
 * @param {Object} data
 */
export const fetchConversationDetail = (data) => {
  return get(`/api/chat/conversations/{conversationId}/messages`, data)
}

/**
 * @description 标记消息为已读
 * @param {Object} data
 */
export const readConversation = (data) => {
  const { conversationId } = data
  return put(`/api/chat/conversations/${conversationId}/read`, data)
}

/**
 * @description 发送消息（HTTP方式，备用
 * @param {Object} data
 */
export const sendConversation = (data) => {
  return post(`/api/chat/messages`, data)
}

/**
 * @description 客服下线
 * @param {Object} data
 */
export const offline = (data) => {
  return post(`/api/chat/service/offline`, data)
}


/**
 * @description 客服上线
 * @param {Object} data
 */
export const online = (data) => {
  return post(`/api/chat/service/online`, data)
}

/**
 * @description 获取未读消息数量
 * @param {Object} data
 */
export const getUnreadCount = (data) => {
  return get(`/api/chat/unread/count`, data)
}



