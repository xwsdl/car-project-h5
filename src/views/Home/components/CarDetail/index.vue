<template>
  <div class="car-detail">
    <div class="car-detail__swipe">
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="image in images" :key="image">
          <img :src="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
])
</script>

<style lang="scss" scoped>
.car-detail {
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 8px 8px 0;
}
</style>