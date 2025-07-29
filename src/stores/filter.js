import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  // 全局筛选条件对象，可根据业务扩展字段
  const filter = ref({
    modelName: null,
    price: null,
    carType: null,
    color: null,
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
      emissionStandard: null,
      energyType: null,
      // ...其他筛选项
    }
  }

  return { filter, setFilter, resetFilter }
}) 