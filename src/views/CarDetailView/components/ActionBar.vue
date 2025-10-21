<!--
 * @Author: 肖蔚 xiaowei@yw105.wecom.work
 * @Date: 2025-06-01 14:40:06
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-10-21 15:00:26
 * @FilePath: \car-h5-project\src\views\CarDetailView\components\ActionBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="action-bar">
    <div class="action-btn message-btn" @click="sendMessage">
      <van-icon name="chat-o" size="20" />
      <span>{{ $t('detail.sendMessage') }}</span>
    </div>
    <div class="action-btn buy-btn" @click="buyNow">
      <van-icon name="shopping-cart-o" size="20" />
      <span>{{ $t('detail.buyNow') }}</span>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['buy', 'sendMessage'])

  const sendMessage = () => {
    emit('sendMessage')
  }

  const buyNow = () => {
    emit('buy')
  }
</script>

<style lang="scss" scoped>
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    background: #fff;
    display: flex;
    padding: 10px 15px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .action-btn {
      flex: 1;
      height: 50px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;

      span {
        margin-left: 8px;
      }
    }

    .message-btn {
      background: #f0f7ff;
      color: #3498db;
      margin-right: 10px;

      &:hover {
        background: #e0efff;
      }
    }

    .buy-btn {
      background: linear-gradient(to right, #3498db, #1a365d);
      color: #fff;
      box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);

      &:hover {
        opacity: 0.9;
      }
    }
  }
</style>
