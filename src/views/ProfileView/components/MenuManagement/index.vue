<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-10 16:15:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-10 16:15:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\MenuManagement\index.vue
 * @Description: 菜单管理页面
-->
<template>
  <div class="menu-management">
    <van-nav-bar :title="$t('menuManagement.title')" left-arrow @click-left="goBack" />

    <div class="content">
      <van-button type="primary" block class="add-btn" @click="handleAddMenu">
        {{ $t('menuManagement.addMenu') }}
      </van-button>

      <div class="menu-tree-container">
        <van-tree-select
          v-model="selectedMenuIds"
          :items="menuTree"
          :main-active-index="activeIndex"
          @click-nav="handleClickNav"
          @change="handleMenuSelect"
          class="menu-tree"
        />
      </div>
    </div>

    <!-- 菜单表单弹窗 -->
    <van-popup v-model:show="showMenuForm" position="bottom" :style="{ height: '60%' }">
      <MenuForm
        :menu="currentMenu"
        :parentMenus="parentMenus"
        @submit="handleMenuSubmit"
        @cancel="showMenuForm = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import MenuForm from './components/MenuForm.vue'
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { showToast, showDialog } from 'vant'
  import { fetchMenuTree, addMenu, updateMenu, deleteMenu } from '@/api/menu/index.js'

  const { t } = useI18n()
  const router = useRouter()

  // 响应式数据
  const loading = ref(false)
  const showMenuForm = ref(false)
  const currentMenu = ref(null)
  const menuTree = ref([])
  const selectedMenuIds = ref([])
  const activeIndex = ref(0)
  const menus = ref([])

  // 计算属性：获取所有可用作上级菜单的菜单（排除按钮类型的菜单）
  const parentMenus = computed(() => {
    // 递归获取所有非按钮类型的菜单
    const getParentMenuOptions = (menuItems, parentId = 0) => {
      const options = []
      menuItems.forEach(item => {
        // 类型为1和2的菜单可以作为上级菜单（不包括按钮类型）
        if (item.type === 1 || item.type === 2) {
          options.push({
            value: item.id,
            label: parentId === 0 ? item.menuName : `└─ ${item.menuName}`
          })

          // 如果有子菜单，递归添加
          if (item.children && item.children.length > 0) {
            options.push(...getParentMenuOptions(item.children, item.id))
          }
        }
      })
      return options
    }

    return getParentMenuOptions(menus.value)
  })

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 加载菜单树
  const loadMenuTree = async () => {
    try {
      loading.value = true
      const response = await fetchMenuTree()

      if (response && Array.isArray(response)) {
        menus.value = response
        // 格式化菜单树以适应van-tree-select组件
        menuTree.value = formatMenuTree(response)
      } else {
        throw new Error('获取菜单树失败')
      }
    } catch (error) {
      console.error('加载菜单树失败:', error)
      showToast(error.message || '加载失败')
    } finally {
      loading.value = false
    }
  }

  // 格式化菜单树以适应van-tree-select组件
  const formatMenuTree = menuList => {
    return menuList.map(menu => {
      const formattedMenu = {
        text: menu.menuName,
        id: menu.id,
        icon: menu.icon,
        type: menu.type,
        sort: menu.sort,
        visible: menu.visible
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        formattedMenu.children = formatMenuTree(menu.children)
      }

      return formattedMenu
    })
  }

  // 处理导航点击
  const handleClickNav = index => {
    activeIndex.value = index
  }

  // 处理菜单选择
  const handleMenuSelect = values => {
    selectedMenuIds.value = values
  }

  // 处理添加菜单
  const handleAddMenu = () => {
    currentMenu.value = null
    showMenuForm.value = true
  }

  // 处理菜单提交
  const handleMenuSubmit = async menuData => {
    try {
      // 判断是否是嵌套的menu结构（表单提交的新格式）
      const submitData = menuData.menu ? menuData.menu : menuData
      
      // 处理children字段，确保是空数组而不是undefined
      if (submitData.children === undefined) {
        submitData.children = []
      }
      
      // 确保type字段是数字类型
      submitData.type = parseInt(submitData.type, 10) || 1
      
      // 确保visible字段是数字类型
      submitData.visible = parseInt(submitData.visible, 10) || 1
      
      // 确保sort字段是数字类型
      submitData.sort = parseInt(submitData.sort, 10) || 0

      if (submitData.id) {
        // 编辑菜单 - 统一使用嵌套格式
        await updateMenu({
          menu: submitData
        })
      } else {
        // 新增菜单 - 统一使用嵌套格式
        await addMenu({
          menu: submitData
        })
      }

      showToast(t('menuManagement.saveSuccess'))
      showMenuForm.value = false

      // 重新加载菜单树
      await loadMenuTree()
    } catch (error) {
      console.error('保存菜单失败:', error)
      showToast(error.message || '保存失败')
    }
  }

  // 组件挂载时加载菜单树
  onMounted(() => {
    loadMenuTree()
  })
</script>

<style lang="scss" scoped>
  .menu-management {
    background-color: #f5f7fa;
    min-height: 100vh;

    .content {
      padding: 15px;
      max-width: 480px;
      margin: 0 auto;
    }

    .add-btn {
      margin-bottom: 15px;
    }

    .menu-tree-container {
      background: white;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .menu-tree {
      height: 400px;
    }
  }
</style>
