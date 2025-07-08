<template>
  <div class="profile-header">
    <!-- 装饰元素 -->
    <div class="circle-decoration circle-1"></div>
    <div class="circle-decoration circle-2"></div>

    <!-- 内容 -->
    <div class="header-content">
      <div class="avatar-container">
        <img
          v-if="authStore.isAuthenticated"
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="用户头像"
          class="avatar"
        />
        <img
          v-else
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="默认头像"
          class="avatar"
        />
      </div>

      <div class="user-info">
        <template v-if="authStore.isAuthenticated">
          <div class="username">张先生</div>
          <div class="uid">UID: U20230815</div>
          <div class="vip-tag">{{ $t('profile.header.goldMember') }}</div>
        </template>
        <template v-else>
          <div class="username">{{ $t('profile.header.notLoggedIn') }}</div>
          <div class="login-actions">
            <van-button type="primary" size="small" @click="goLogin">
              {{ $t('profile.header.login') }}
            </van-button>
            <van-button type="default" size="small" @click="goRegister">
              {{ $t('profile.header.register') }}
            </van-button>
          </div>
        </template>
      </div>
    </div>

    <!-- 顶部操作区：多语言+退出 -->
    <div class="header-actions">
      <div class="lang-switcher-fixed">
        <LanguageSwitcher />
      </div>
      <div v-if="authStore.isAuthenticated" class="logout-button" @click="logout">
        <van-button type="danger" size="small">{{ $t('profile.header.logout') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { closeToast, showLoadingToast } from 'vant'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useI18n()

  const logout = () => {
    showLoadingToast({
      message: t('profile.header.loggingOut'),
      forbidClick: true,
      duration: 0
    })

    authStore.logout()
    setTimeout(() => {
      closeToast()
      router.push('/login')
    }, 1000)
  }

  const goLogin = () => {
    router.push('/login')
  }
  const goRegister = () => {
    router.push('/register')
  }
</script>

<style lang="scss" scoped>
  .profile-header {
    background: linear-gradient(to right, #1a365d, #2a4365);
    color: white;
    padding: 20px;
    position: relative;
    overflow: hidden;
    height: 180px;
    position: relative;

    .header-actions {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      z-index: 1001;
      pointer-events: none; // 让子元素自己决定是否可点击
    }
    .lang-switcher-fixed {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 1002;
      pointer-events: auto;
    }

    .logout-button {
      position: static;
      margin: 0;
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      flex-wrap: wrap; // 允许内容换行
      width: 100%;
    }

    .avatar-container {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      overflow: hidden;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      flex: 1;
      min-width: 0; // 防止flex子项溢出

      .username {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .uid {
        font-size: 14px;
        opacity: 0.8;
        background: rgba(0, 0, 0, 0.2);
        padding: 3px 8px;
        border-radius: 10px;
        display: inline-block;
      }

      .vip-tag {
        display: inline-block;
        background: linear-gradient(to right, #ffd700, #ffb400);
        color: #8a6d06;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 12px;
        margin-top: 8px;
        font-weight: bold;
      }

      .login-actions {
        margin-top: 8px;
        display: flex;
        flex-direction: row; // 垂直排列，按钮直接换行堆叠
        gap: 8px;
        width: 100%;
        align-items: stretch;

        .van-button {
          width: 100%; // 按钮宽度100%，堆叠展示
          min-width: 0;
          font-size: 15px;
          padding: 0 8px;
          white-space: normal; // 允许按钮内文字换行
        }
      }
    }

    .circle-decoration {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);

      &.circle-1 {
        top: -50px;
        right: -50px;
      }

      &.circle-2 {
        bottom: -30px;
        left: -30px;
        width: 100px;
        height: 100px;
      }
    }

    .lang-switcher {
      position: static;
      margin: 0;
    }
  }

  @media (max-width: 480px) {
    .profile-header {
      height: 160px;

      .avatar-container {
        width: 70px;
        height: 70px;
      }

      .username {
        font-size: 18px;
      }
      .login-actions {
        gap: 6px;
        .van-button {
          font-size: 13px;
          padding: 0 4px;
        }
      }
    }
  }
</style>
