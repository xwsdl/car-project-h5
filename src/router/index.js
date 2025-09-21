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
            requiresAuth: false,
            keepAlive: true
          }
        },
        {
          path: '/car',
          name: 'carDetail',
          component: () => import('@/views/CarDetailView/index.vue'),
          props: true,
          beforeEnter: (to, from, next) => {
            if (!to.query.id) {
              next(false)
            } else {
              console.log('to.params.id', to.query.id)
              next()
            }
          },
          meta: {
            title: 'route.carDetail',
            requiresAuth: false,
            keepAlive: false
          }
        },
        {
          path: '/list/:category',
          name: 'carList',
          component: () => import('@/views/ClassificationList/index.vue'),
          meta: {
            title: 'route.carList',
            requiresAuth: false,
            keepAlive: false
          }
        },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/Brand/index.vue'),
          meta: {
            title: 'route.brand',
            requiresAuth: false,
            keepAlive: true
          }
        },
        {
          path: '/filterPage',
          name: 'FilterPage',
          component: () => import('@/views/FilterPage/index.vue'),
          meta: {
            title: 'route.filterPage',
            requiresAuth: false,
            keepAlive: true
          }
        },
        {
          path: '/orderProcess',
          name: 'orderProcess',
          component: () => import('@/views/OrderProcess/index.vue'),
          meta: {
            title: 'route.orderProcess',
            requiresAuth: true,
            permission: 'route.orderProcess',
            keepAlive: false
          }
        },
        {
          path: '/orderDetail',
          name: 'orderDetail',
          component: () => import('@/views/OrderDetail/index.vue'),
          props: true,
          meta: {
            title: 'route.orderDetail',
            requiresAuth: true,
            permission: 'route.orderDetail',
            keepAlive: false
          }
        },
        {
          path: '/pendingOrders',
          name: 'pendingOrders',
          component: () => import('@/views/OrderProcess/pendingOrders.vue'),
          props: true,
          meta: {
            title: 'route.pending_orders',
            requiresAuth: true,
            permission: 'route.pending_orders',
            keepAlive: false
          }
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/Message/index.vue'),
          meta: {
            title: 'route.message',
            requiresAuth: true,
            permission: 'route.message',
            keepAlive: false
          }
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView/index.vue'),
          meta: {
            title: 'route.profile',
            requiresAuth: true,
            permission: 'route.profile',
            keepAlive: false
          }
        },
        {
          path: '/profileEdit',
          name: 'profileEdit',
          component: () => import('@/views/profileEdit/index.vue'),
          meta: {
            title: 'route.profileEdit',
            permission: 'route.profileEdit',
            requiresAuth: true,
            keepAlive: false
          }
        },
        {
          path: '/customerService',
          name: 'customerService',
          component: () => import('@/views/CustomerService/index.vue'),
          meta: {
            title: 'route.customerService',
            requiresAuth: true,
            permission: 'route.customerService',
            keepAlive: false
          }
        },
        {
          path: '/roleManagement',
          name: 'roleManagement',
          component: () => import('@/views/ProfileView/components/RoleManagement/index.vue'),
          meta: {
            title: 'route.roleManagement',
            requiresAuth: true,
            permission: 'route.roleManagement',
            keepAlive: false
          }
        },
        {
          path: '/userManagement',
          name: 'userManagement',
          component: () => import('@/views/ProfileView/components/UserManagement/index.vue'),
          meta: {
            title: 'route.userManagement',
            requiresAuth: true,
            permission: 'route.userManagement',
            keepAlive: false
          }
        },
        {
          path: '/permissionManagement',
          name: 'permissionManagement',
          component: () => import('@/views/ProfileView/components/PermissionManagement/index.vue'),
          meta: {
            title: 'route.permissionManagement',
            requiresAuth: true,
            permission: 'route.permissionManagement',
            keepAlive: false
          }
        },
        {
          path: '/menuManagement',
          name: 'menuManagement',
          component: () => import('@/views/ProfileView/components/MenuManagement/index.vue'),
          meta: {
            title: 'route.menuManagement',
            requiresAuth: true,
            permission: 'route.menuManagement',
            keepAlive: false
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: 'route.login',
        requiresAuth: false,
        keepAlive: false
      }
    }
  ]
})

export default router