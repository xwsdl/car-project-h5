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
            title: 'route.home',
            requiresAuth: false, // 不需要登录
            keepAlive: true, // 需要缓存 ，注意：name的名称和组件名一致才生效
          },
        },
        {
          path: '/orderProcess',
          name: 'orderProcess',
          component: () => import('@/views/OrderProcess/index.vue'),
          meta: {
            title: 'route.orderProcess',
            requiresAuth: true, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/orderDetail',
          name: 'orderDetail',
          component: () => import('@/views/OrderDetail/index.vue'),
          props: true,
          meta: {
            title: 'route.orderDetail',
            requiresAuth: true,
            keepAlive: false,
          },
        },
        {
          path: '/pendingOrders',
          name: 'pendingOrders',
          component: () => import('@/views/OrderProcess/pendingOrders.vue'),
          props: true,
          meta: {
            title: 'route.pending_orders',
            requiresAuth: true,
            keepAlive: false,
          },
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/Message/index.vue'),
          meta: {
            title: 'route.message',
            requiresAuth: true, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView/index.vue'),
          meta: {
            title: 'route.profile',
            requiresAuth: true, // 需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/profileEdit',
          name: 'profileEdit',
          component: () => import('@/views/profileEdit/index.vue'),
          meta: { title: '修改信息' }
        },
        {
          path: '/car',
          name: 'carDetail',
          component: () => import('@/views/CarDetailView/index.vue'),
          props: true, // 将路由参数传递给组件
          beforeEnter: (to, from, next) => {
            if (!to.query.id) {
              next(false) // 阻止导航
            } else {
              console.log('to.params.id', to.query.id)
              next() // 允许导航
            }
          },
          meta: {
            title: 'route.carDetail',
            requiresAuth: false, //
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/list/:category',
          name: 'carList',
          component: () => import('@/views/ClassificationList/index.vue'),
          meta: {
            title: 'route.carList',
            requiresAuth: false, // 不需要登录
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/shoppingCart',
          name: 'shoppingCart',
          component: () => import('@/views/ShoppingCart/index.vue'),
          meta: {
            title: 'route.shoppingCart',
            requiresAuth: true, // 不需要登录
            keepAlive: false, // 不需要缓存
          },
        },
        {
          path: '/customerService',
          name: 'customerService',
          component: () => import('@/views/CustomerService/index.vue'),
          meta: {
            title: 'route.customerService',
            requiresAuth: true, // 不需要登录
            keepAlive: false, // 需要缓存
          },
        },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/Brand/index.vue'),
          meta: {
            title: 'route.brand',
            requiresAuth: false, // 不需要登录
            keepAlive: true, // 不需要缓存
          },
        },
        {
          path: '/filterPage',
          name: 'FilterPage',
          component: () => import('@/views/FilterPage/index.vue'),
          meta: {
            title: 'route.filterPage',
            requiresAuth: false, // 不需要登录
            keepAlive: true // 不需要缓存
          },
        },
        {
          path: '/test',
          name: 'Test',
          component: () => import('@/views/Test/index.vue'),
          meta: {
            title: '测试页面',
            requiresAuth: false, // 不需要登录
            keepAlive: true // 不需要缓存
          },
        },
        // 权限管理路由
        {
          path: '/roleManagement',
          name: 'roleManagement',
          component: () => import('@/views/ProfileView/components/RoleManagement/index.vue'),
          meta: {
            title: 'route.roleManagement',
            requiresAuth: true,
            permission: 'role_management',
            keepAlive: false,
          },
        },
        {
          path: '/userManagement',
          name: 'userManagement',
          component: () => import('@/views/ProfileView/components/UserManagement/index.vue'),
          meta: {
            title: 'route.userManagement',
            requiresAuth: true,
            permission: 'user_management',
            keepAlive: false,
          },
        },
        // 权限管理路由
        {          
          path: '/permissionManagement',
          name: 'permissionManagement',
          component: () => import('@/views/ProfileView/components/PermissionManagement/index.vue'),
          meta: {
            title: 'route.permissionManagement',
            requiresAuth: true,
            permission: 'system_config',
            keepAlive: false,
          },
        },
        // 菜单管理路由
        {          
          path: '/menuManagement',
          name: 'menuManagement',
          component: () => import('@/views/ProfileView/components/MenuManagement/index.vue'),
          meta: {
            title: 'route.menuManagement',
            requiresAuth: true,
            permission: 'system_config',
            keepAlive: false,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: 'route.login',
        requiresAuth: false, // 不需要登录
        keepAlive: false, // 不需要缓存
      },
    },
  ],
})

export default router
