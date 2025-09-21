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
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <van-button type="primary" @click="handleAddRootMenu">
          {{ $t('menuManagement.addDirectory') }}
        </van-button>
      </div>

      <!-- 菜单树展示区域 -->
      <div class="menu-tree-container">
        <van-loading v-if="loading" size="large" />
        <div v-else-if="!menuTree.length" class="empty-state">
          {{ $t('menuManagement.emptyMenu') }}
        </div>
        <div v-else class="tree-content">
          <!-- 目录/菜单/按钮三级树形结构 -->
          <div
            v-for="directory in menuTree"
            :key="directory.id"
            class="tree-node directory-node"
            :class="{ expanded: directory.expanded }"
          >
            <div class="node-header">
              <div class="node-info" @click="toggleExpand(directory)">
                <div class="info-main">
                  <template v-if="directory.children && directory.children.length > 0">
                    <van-icon
                      :name="directory.expanded ? 'arrow-down' : 'arrow-right'"
                      class="expand-icon"
                    />
                  </template>
                  <div v-else class="expand-icon-placeholder"></div>
                  <van-icon :name="directory.icon || 'folder-o'" class="node-icon directory-icon" />
                  <span class="node-name">{{ directory.menuName }}</span>
                </div>
                <div class="info-details">
                  <span class="node-type">{{ getTypeText(directory.type) }}</span>
                </div>
              </div>
              <div class="node-actions">
                <van-button size="mini" @click.stop="handleAddSubMenu(directory.id, 2)">
                  {{ $t('menuManagement.addMenu') }}
                </van-button>
                <van-button size="mini" type="primary" @click.stop="handleEditMenu(directory)">
                  {{ $t('common.edit') }}
                </van-button>
                <van-button size="mini" type="danger" @click.stop="handleDeleteMenu(directory.id)">
                  {{ $t('common.delete') }}
                </van-button>
              </div>
            </div>

            <!-- 二级菜单 -->
            <div
              v-if="directory.expanded && directory.children && directory.children.length > 0"
              class="sub-nodes"
            >
              <div
                v-for="menu in directory.children.filter(item => item.type === 2)"
                :key="menu.id"
                class="tree-node menu-node"
                :class="{ expanded: menu.expanded }"
              >
                <div class="node-header">
                  <div class="node-info" @click="toggleExpand(menu)">
                    <div class="info-main">
                      <template v-if="menu.children && menu.children.length > 0">
                        <van-icon
                          :name="menu.expanded ? 'arrow-down' : 'arrow-right'"
                          class="expand-icon"
                        />
                      </template>
                      <div v-else class="expand-icon-placeholder"></div>
                      <van-icon :name="menu.icon || 'document-o'" class="node-icon menu-icon" />
                      <span class="node-name">{{ menu.menuName }}</span>
                    </div>
                    <div class="info-details">
                      <span class="node-type">{{ getTypeText(menu.type) }}</span>
                    </div>
                  </div>
                  <div class="node-actions">
                    <van-button size="mini" @click.stop="handleAddSubMenu(menu.id, 3)">
                      {{ $t('menuManagement.addButton') }}
                    </van-button>
                    <van-button size="mini" type="primary" @click.stop="handleEditMenu(menu)">
                      {{ $t('common.edit') }}
                    </van-button>
                    <van-button size="mini" type="danger" @click.stop="handleDeleteMenu(menu.id)">
                      {{ $t('common.delete') }}
                    </van-button>
                  </div>
                </div>

                <!-- 三级按钮 -->
                <div
                  v-if="menu.expanded && menu.children && menu.children.length > 0"
                  class="sub-nodes"
                >
                  <div
                    v-for="button in menu.children.filter(item => item.type === 3)"
                    :key="button.id"
                    class="tree-node button-node"
                  >
                    <div class="node-header">
                      <div class="node-info">
                        <div class="info-main">
                          <div class="expand-icon-placeholder"></div>
                          <van-icon :name="button.icon || 'link'" class="node-icon button-icon" />
                          <span class="node-name">{{ button.menuName }}</span>
                        </div>
                        <div class="info-details">
                          <span class="node-type">{{ getTypeText(button.type) }}</span>
                          <span v-if="button.perms" class="node-perms">{{ button.perms }}</span>
                        </div>
                      </div>
                      <div class="node-actions">
                        <van-button size="mini" type="primary" @click.stop="handleEditMenu(button)">
                          {{ $t('common.edit') }}
                        </van-button>
                        <van-button
                          size="mini"
                          type="danger"
                          @click.stop="handleDeleteMenu(button.id)"
                        >
                          {{ $t('common.delete') }}
                        </van-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单表单弹窗 -->
    <van-popup v-model:show="showMenuForm" position="bottom" :style="{ height: '60%' }">
      <MenuForm
        :menu="currentMenu"
        :parentMenus="parentMenus"
        :currentType="currentType"
        :canChangeParentMenu="canChangeParentMenu"
        @submit="handleMenuSubmit"
        @cancel="showMenuForm = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
  import MenuForm from './components/MenuForm.vue'
  import { ref, onMounted, computed, reactive } from 'vue'
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
  const currentType = ref(null) // 当前正在添加的菜单类型
  const canChangeParentMenu = ref(true) // 是否可以更改上级菜单
  const menus = ref([])
  const menuTree = ref([]) // 带展开状态的菜单树

  // 计算属性：获取所有可用作上级菜单的菜单
  const parentMenus = computed(() => {
    // 递归获取所有菜单选项
    const getParentMenuOptions = (menuItems, level = 0, parentName = '') => {
      const options = []
      menuItems.forEach(item => {
        // 构建层级显示的菜单名称
        const displayName = level === 0 ? item.menuName : `${parentName} / ${item.menuName}`

        // 类型为1和2的菜单可以作为上级菜单（目录和菜单）
        // 只有在添加非顶级菜单时才显示这些选项
        if (currentMenu.value || (currentType.value && currentType.value > 1)) {
          options.push({
            value: item.id,
            label: displayName,
            type: item.type
          })
        }

        // 如果有子菜单，递归添加
        if (item.children && item.children.length > 0) {
          options.push(...getParentMenuOptions(item.children, level + 1, displayName))
        }
      })
      return options
    }

    // 添加顶级菜单选项
    const options = [{ value: 0, label: t('menuManagement.topLevelMenu'), type: 0 }]

    // 添加其他菜单选项
    if (menus.value.length > 0) {
      options.push(...getParentMenuOptions(menus.value))
    }

    return options
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
        // 转换为带展开状态的菜单树
        menuTree.value = convertToTreeWithState(response)
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

  // 转换为带展开状态的菜单树
  const convertToTreeWithState = menuList => {
    return menuList.map(menu => {
      const treeNode = {
        ...menu,
        expanded: false // 默认收起
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        treeNode.children = convertToTreeWithState(menu.children)
      }

      return treeNode
    })
  }

  // 切换展开状态
  const toggleExpand = node => {
    node.expanded = !node.expanded
  }

  // 获取类型文本
  const getTypeText = type => {
    switch (type) {
      case 1:
        return t('menuManagement.typeOptions.directory')
      case 2:
        return t('menuManagement.typeOptions.menu')
      case 3:
        return t('menuManagement.typeOptions.button')
      default:
        return ''
    }
  }

  // 添加根目录
  const handleAddRootMenu = () => {
    currentMenu.value = null
    currentType.value = 1 // 目录类型
    canChangeParentMenu.value = true // 根目录可以选择上级菜单（实际是顶级菜单）
    showMenuForm.value = true
  }

  // 添加子菜单
  const handleAddSubMenu = (parentId, type) => {
    currentMenu.value = {
      parentId,
      type
    }
    currentType.value = type
    canChangeParentMenu.value = false // 添加子菜单时上级菜单不可更改
    showMenuForm.value = true
  }

  // 编辑菜单
  const handleEditMenu = menu => {
    currentMenu.value = { ...menu }
    currentType.value = menu.type
    canChangeParentMenu.value = false // 编辑菜单时上级菜单不可更改
    showMenuForm.value = true
  }

  // 删除菜单确认
  const handleDeleteMenu = menuId => {
    // 查找要删除的菜单，检查是否有子菜单
    const menuToDelete = findMenuById(menuId)
    if (menuToDelete && menuToDelete.children && menuToDelete.children.length > 0) {
      showToast(t('menuManagement.hasChildrenCannotDelete'))
      return
    }

    showDialog({
      title: t('common.deleteConfirm'),
      message: t('menuManagement.deleteMenuConfirm'),
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      confirmButtonColor: '#f56c6c'
    })
      .then(async () => {
        try {
          await deleteMenu(menuId)
          showToast(t('menuManagement.deleteSuccess'))
          // 重新加载菜单树
          await loadMenuTree()
        } catch (error) {
          console.error('删除菜单失败:', error)
          showToast(error.message || '删除失败')
        }
      })
      .catch(() => {
        // 用户取消删除
      })
  }

  // 根据ID查找菜单对象
  const findMenuById = id => {
    // 递归查找菜单
    const findMenu = menuList => {
      for (const menu of menuList) {
        if (menu.id === id) {
          return menu
        }
        if (menu.children && menu.children.length > 0) {
          const found = findMenu(menu.children)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    return findMenu(menus.value)
  }

  // 处理菜单提交
  const handleMenuSubmit = async menuData => {
    try {
      // 判断是否是嵌套的menu结构
      const submitData = menuData.menu ? menuData.menu : menuData

      // 处理children字段，确保是空数组而不是undefined
      if (submitData.children === undefined) {
        submitData.children = []
      }

      // 确保type字段是数字类型
      submitData.type = parseInt(submitData.type, 10) || 1

      // 确保visible字段是数字类型
      submitData.visible = typeof submitData.visible === 'boolean' ? (submitData.visible ? 1 : 0) : (parseInt(submitData.visible, 10) || 0)

      // 确保sort字段是数字类型
      submitData.sort = parseInt(submitData.sort, 10) || 0

      if (submitData.id) {
        // 编辑菜单 - 统一使用嵌套格式
        await updateMenu(submitData)
      } else {
        // 新增菜单 - 统一使用嵌套格式
        await addMenu(submitData)
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
      max-width: 100%;
      margin: 0 auto;
    }

    .top-actions {
      margin-bottom: 15px;
      text-align: center;
    }

    .menu-tree-container {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      min-height: 400px;
      width: 100%;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 60px 0;
      font-size: 14px;
    }

    .tree-content {
      max-height: calc(100vh - 200px);
      overflow-y: auto;
      padding: 5px;
    }

    // 自定义滚动条样式
    .tree-content::-webkit-scrollbar {
      width: 6px;
    }

    .tree-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .tree-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .tree-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    .tree-node {
      margin-bottom: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .directory-node {
      background-color: #ffffff;
      border: 1px solid #e8e8e8;
      margin-bottom: 10px;
    }

    .menu-node {
      background-color: #ffffff;
      border: 1px solid #e8e8e8;
      margin-bottom: 8px;
    }

    .button-node {
      background-color: #f9f9f9;
      border: 1px solid #f0f0f0;
      margin-bottom: 6px;
    }

    // 鼠标悬停效果
    .tree-node:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    // 左右布局的节点头部
    .node-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px;
      font-size: 14px;
      width: 100%;
    }

    // 左侧内容区
    .node-info {
      flex: 1;
      cursor: pointer;
      min-width: 0;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .node-info:hover {
      opacity: 0.85;
    }

    // 主信息区域 - 包含图标和名称
    .info-main {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 4px;
    }

    // 详情信息区域 - 只包含类型信息
    .info-details {
      margin-left: 40px;
      font-size: 12px;
    }

    // 优化展开/折叠图标样式
    .expand-icon {
      font-size: 14px;
      margin-right: 8px;
      width: 16px;
      text-align: center;
      color: #666;
      transition: transform 0.2s ease;
    }

    // 展开状态下的图标旋转效果
    .tree-node.expanded .expand-icon {
      transform: rotate(90deg);
    }

    .expand-icon-placeholder {
      width: 16px;
      margin-right: 8px;
    }

    // 图标样式
    .node-icon {
      margin-right: 8px;
      font-size: 16px;
    }

    .directory-icon {
      color: #4e6ef2;
    }

    .menu-icon {
      color: #36cfc9;
    }

    .button-icon {
      color: #faad14;
    }

    // 菜单名称样式 - 单独占一行
    .node-name {
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    // 菜单类型样式 - 单独占一行
    .node-type {
      font-size: 12px;
      color: #666;
      padding: 2px 6px;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.05);
      display: inline-block;
    }

    .node-perms {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
      font-family: monospace;
    }

    // 右侧按钮组 - 垂直排列
    .node-actions {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
      width: 80px;
    }

    // 按钮样式
    .node-actions .van-button {
      font-size: 12px;
      height: 26px;
      width: 100%;
      padding: 0;
      border-radius: 4px;
    }

    // 优化子节点缩进
    .sub-nodes {
      margin-left: 20px;
      padding-left: 20px;
      border-left: 2px dashed #e0e0e0;
      margin-top: -4px;
    }

    // 三级按钮的节点样式
    .button-node .node-header {
      padding: 8px 12px;
    }

    // 响应式设计
    @media (max-width: 768px) {
      .node-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .node-actions {
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 8px;
      }
      
      .node-actions .van-button {
        width: auto;
        min-width: 60px;
      }
      
      .sub-nodes {
        margin-left: 10px;
        padding-left: 10px;
      }
    }

    @media (max-width: 480px) {
      .content {
        padding: 10px 8px;
      }
      
      .node-header {
        padding: 8px;
      }
      
      .node-actions {
        flex-wrap: wrap;
        gap: 3px;
      }
      
      .node-actions .van-button {
        font-size: 11px;
        height: 24px;
        min-width: 50px;
      }
    }
  }
</style>
