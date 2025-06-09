<template>
  <div class="car-models">
    <h3>🔥 热门车型推荐</h3>
    <div class="car-list">
      <div 
        class="car-item" 
        v-for="(car, index) in cars" 
        :key="index"
        @click="$emit('car-selected', car)"
      >
        <div class="car-image">
          {{ car.emoji }}
        </div>
        <div class="car-name">{{ car.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cars: {
    type: Array,
    required: true
  }
})

defineEmits(['car-selected'])
</script>

<style scoped>
.car-models {
  padding: 15px;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
}

.car-models h3 {
  text-align: center;
  margin-bottom: 15px;
  color: var(--primary);
}

.car-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.car-item {
  background: var(--light-bg);
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.car-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.car-image {
  height: 80px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
}

.car-name {
  padding: 8px 5px;
  font-size: 13px;
  font-weight: 500;
}
</style>