<template>
  <SectionCard class="orders-section">
    <template #header>
      <div class="section-title">
        <span>{{ $t('profile.orders.title') }}</span>
        <span class="view-all">{{ $t('profile.orders.viewAll') }} ></span>
      </div>
    </template>
    
    <div class="order-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="order-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ $t(`profile.orders.tabs.${tab.id}`) }}
      </div>
    </div>
    
    <div class="order-stats">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="order-stat-item"
      >
        <div class="stat-count">{{ stat.count }}</div>
        <div class="stat-label">{{ $t(`profile.orders.stats.${stat.label}`) }}</div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup>
import { ref } from 'vue'
import SectionCard from '../common/SectionCard.vue'



// 订单标签数据
const tabs = ref([
  { id: 'car', label: 'car' },
  { id: 'parts', label: 'parts' }
])

// 当前激活的标签
const activeTab = ref('car')

// 订单统计数据
const stats = ref([
  { count: 2, label: 'unpaid' },
  { count: 1, label: 'unshipped' },
  { count: 3, label: 'unreceived' },
  { count: 12, label: 'completed' }
])
</script>

<style lang="scss" scoped>
.orders-section {
  margin-top: -30px;
  position: relative;
  z-index: 10;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .view-all {
    font-size: 14px;
    color: #3498db;
    cursor: pointer;
  }
}

.order-tabs {
  margin-bottom: 15px;
  
  .order-tab {
    padding: 8px 16px;
    border-radius: 20px;
    background: #f5f7fa;
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    
    &.active {
      background: #3498db;
      color: white;
    }
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.order-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: center;
  
  .order-stat-item {
    padding: 10px;
    
    .stat-count {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1a365d;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>