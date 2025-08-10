/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-11 11:20:46
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-08 14:23:06
 * @FilePath: \car-project-h5\src\utils\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 获取assets静态资源
export const getFile = (url) => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}

export const getBanner = (url) => {
  return new URL(`../assets/images/banner/${url}`, import.meta.url).href
}


/**
 * 将包含多个 https 图片地址的字符串，解析为图片地址数组
 * @param {string} str
 * @returns {string[]} 图片地址数组
 */
export function extractImageUrls(str) {
  // 用正则匹配每个以 https:// 开头，直到下一个 https:// 或字符串结尾的片段
  if (!str) return [];
  // return (str.match(/https:\/\/.*?(?=https:\/\/|$)/g) || []).map(s => s.replace(/,$/, ''));
  return str.split('|')
}


// 格式化时间  格式：YYYY-MM-DD HH:MM:SS
export const formatTime = date => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
