// 获取assets静态资源
export const getFile = (url) => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}

export const getBanner = (url) => {
  return new URL(`../assets/images/banner/${url}`, import.meta.url).href
}

