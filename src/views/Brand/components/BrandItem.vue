<template>
  <div class="brand-item" @click="$emit('select', source)">
    <div class="brand-item__logo">
      <img :src="source.logo" :alt="source.name" />
    </div>
    <div class="brand-item__name">{{ source.name }}</div>
  </div>
</template>

<script setup>
defineProps({
  source: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>

<style lang="scss" scoped>
.brand-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;

  &:active {
    background-color: #f5f5f5;
  }

  &__logo {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  &__name {
    font-size: 15px;
    color: #333;
    flex: 1;
  }
}
</style> 