import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'homeIndex',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页',
            requiresAuth: true, // 不需要登录
          },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView/index.vue'),
          meta: {
            title: '个人中心',
            requiresAuth: true, // 需要登录
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
            requiresAuth: true, //
          },
        },
        {
          path: '/list/:category',
          name: 'carList',
          component: () => import('@/views/ClassificationList/index.vue'),
          meta: {
            title: '车辆列表',
            requiresAuth: true, // 不需要登录
          },
        },
        {
          path: '/shoppingCart',
          name: 'shoppingCart',
          component: () => import('@/views/ShoppingCart/index.vue'),
          meta: {
            title: '车辆列表',
            requiresAuth: true, // 不需要登录
          },
        },
        {
          path: '/customerService',
          name: 'customerService',
          component: () => import('@/views/CustomerService/index.vue'),
          meta: {
            title: '客服',
            requiresAuth: true, // 不需要登录
          },
        },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/Brand/index.vue'),
          meta: {
            title: '选择品牌',
            requiresAuth: true, // 不需要登录
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
      },
    },
  ],
})

export default router
