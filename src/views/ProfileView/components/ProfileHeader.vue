<template>
  <div class="profile-header">
    <!-- 装饰元素 -->
    <div class="circle-decoration circle-1"></div>
    <div class="circle-decoration circle-2"></div>

    <!-- 顶部操作区：多语言+退出 -->
    <div class="header-actions">
      <div class="lang-switcher-fixed">
        <LanguageSwitcher />
      </div>
      <div v-if="authStore.isAuthenticated" class="logout-button">
        <van-button type="danger" size="small" @click="logout">
          {{ $t('profile.header.logout') }}
        </van-button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="header-content">
      <div
        class="avatar-container"
        :class="{ clickable: authStore.isAuthenticated }"
        @click="handleAvatarClick"
      >
        <img
          v-if="authStore.isAuthenticated"
          :src="authStore.user && authStore.user.avatar"
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
          <div class="username">{{ authStore.user && authStore.user.username }}</div>
          <div class="uid">{{ authStore.user && authStore.user.phone }}</div>
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
  </div>
</template>

<script setup>
  import { closeToast, showLoadingToast } from 'vant'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue'
  import { offline } from '@/api'
  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useI18n()

  const logout = async () => {
    showLoadingToast({
      message: t('profile.header.loggingOut'),
      forbidClick: true,
      duration: 0
    })
    // 判断当前登录账户是否为客服(调用客服下线接口)
    if (authStore.user.roleName === 'customer_service') {
      await offline()
    }

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
    router.push({
      path: '/login',
      query: {
        activeTab: 'register'
      }
    })
  }

  // 登录状态下点击头像跳转到 profileEdit
  const handleAvatarClick = () => {
    if (authStore.isAuthenticated) {
      router.push('/profileEdit')
    }
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

    .header-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      width: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1001;
      pointer-events: auto;
      gap: 12px; // 按钮间距
    }
    .lang-switcher-fixed {
      position: static;
      margin: 0;
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
      // 增加点击手势提示
      &.clickable {
        cursor: pointer;
        box-shadow: 0 0 0 2px #ffd700;
        transition: box-shadow 0.2s;
      }
      &.clickable:active {
        box-shadow: 0 0 0 4px #ffd700;
      }
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
      .header-actions {
        gap: 8px;
      }
    }
  }
</style>
