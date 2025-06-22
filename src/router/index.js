import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'homeIndex',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页',
            requiresAuth: false, // 不需要登录
            keepAlive: true, // 需要缓存 ，注意：name的名称和组件名一致才生效
          },
        },
        {
          path: '/orderProcess',
          name: 'orderProcess',
          component: () => import('@/views/OrderProcess/index.vue'),
          meta: {
            title: '订单进程',
            requiresAuth: false, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/Message/index.vue'),
          meta: {
            title: '消息',
            requiresAuth: false, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView/index.vue'),
          meta: {
            title: '个人中心',
            requiresAuth: false, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/car/:id',
          name: 'car-detail',
          component: () => import('@/views/CarDetailView/index.vue'),
          props: true, // 将路由参数传递给组件
          beforeEnter: (to, from, next) => {
            if (!to.params.id) {
              next(false) // 阻止导航
            } else {
              next() // 允许导航
            }
          },
          meta: {
            title: '车辆详情',
            requiresAuth: false, //
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/list/:category',
          name: 'carList',
          component: () => import('@/views/ClassificationList/index.vue'),
          meta: {
            title: '车辆列表',
            requiresAuth: false, // 不需要登录
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/shoppingCart',
          name: 'shoppingCart',
          component: () => import('@/views/ShoppingCart/index.vue'),
          meta: {
            title: '车辆列表',
            requiresAuth: true, // 不需要登录
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/customerService',
          name: 'customerService',
          component: () => import('@/views/CustomerService/index.vue'),
          meta: {
            title: '客服',
            requiresAuth: true, // 不需要登录
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/Brand/index.vue'),
          meta: {
            title: '选择品牌',
            requiresAuth: false, // 不需要登录
            keepAlive: true, // 不需要缓存
          },
        },
        {
          path: '/filterPage',
          name: 'FilterPage',
          component: () => import('@/views/FilterPage/index.vue'),
          meta: {
            title: '高级筛选',
            requiresAuth: false, // 不需要登录
            keepAlive: true // 不需要缓存
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: '登录',
        requiresAuth: false, // 不需要登录
        keepAlive: false, // 不需要缓存
      },
    },
  ],
})

export default router
