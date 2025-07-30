/*
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-06-24 13:57:39
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-07-30 17:41:20
 * @FilePath: \car-project-h5\src\stores\filter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  // 全局筛选条件对象，可根据业务扩展字段
  const filter = ref({
    modelName: null,
    price: null,
    carType: null,
    color: null,
    carBegin: null,
    carEnd: null,
    emissionStandard: null,
    energyType: null,
    displacement: null,
    brand: null,//汽车品牌
    // ...其他筛选项
  })

  // 合并设置筛选条件
  function setFilter(newFilter) {
    const displacement = newFilter.displacement ? `${newFilter.displacement}T` : null
    filter.value = { ...filter.value, ...newFilter, displacement }
  }

  // 重置所有筛选条件
  function resetFilter() {
    filter.value = {
      modelName: null,
      price: null,
      carType: null,
      color: null,
      carBegin: null,
      carEnd: null,
      emissionStandard: null,
      energyType: null,
      displacement: null,
      brand: null,//汽车品牌
      // ...其他筛选项
    }
  }

  return { filter, setFilter, resetFilter }
})
