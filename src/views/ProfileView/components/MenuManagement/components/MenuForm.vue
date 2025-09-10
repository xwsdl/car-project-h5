<!--
 * @Author: xiaowei 2902267627@qq.com
 * @Date: 2025-09-10 16:20:00
 * @LastEditors: xiaowei 2902267627@qq.com
 * @LastEditTime: 2025-09-10 16:20:00
 * @FilePath: \car-project-h5\src\views\ProfileView\components\MenuManagement\components\MenuForm.vue
 * @Description: 菜单表单组件
-->
<template>
  <div class="menu-form">
    <van-nav-bar
      :title="menu ? $t('menuManagement.editMenu') : $t('menuManagement.addMenu')"
      left-arrow
      @click-left="handleCancel"
    />

    <div class="form-content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <!-- 菜单名称 -->
          <van-field
            v-model="formData.menuName"
            :label="$t('menuManagement.menuName')"
            :placeholder="$t('menuManagement.menuNamePlaceholder')"
            :rules="[{ required: true, message: $t('menuManagement.menuNameRequired') }]"
          />

          <!-- 上级菜单 -->
          <van-field
            :label="$t('menuManagement.parentMenu')"
            readonly
            :model-value="selectedParentMenu.label"
            is-link
            @click="openParentMenuPicker"
          />

          <!-- 路由路径 -->
          <van-field
            v-model="formData.path"
            :label="$t('menuManagement.path')"
            :placeholder="$t('menuManagement.pathPlaceholder')"
            :rules="[{ required: true, message: $t('menuManagement.pathRequired') }]"
          />

          <!-- 组件名称 -->
          <van-field
            v-model="formData.component"
            :label="$t('menuManagement.component')"
            :placeholder="$t('menuManagement.componentPlaceholder')"
          />

          <!-- 图标 -->
          <van-field
            v-model="formData.icon"
            :label="$t('menuManagement.icon')"
            :placeholder="$t('menuManagement.iconPlaceholder')"
          />

          <!-- 菜单类型 -->
          <van-field :label="$t('menuManagement.type')">
            <template #input>
              <van-radio-group v-model="formData.type" direction="horizontal">
                <van-radio :name="1">{{ $t('menuManagement.typeOptions.directory') }}</van-radio>
                <van-radio :name="2">{{ $t('menuManagement.typeOptions.menu') }}</van-radio>
                <van-radio :name="3">{{ $t('menuManagement.typeOptions.button') }}</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <!-- 排序 -->
          <van-field
            v-model.number="formData.sort"
            :label="$t('menuManagement.sort')"
            type="number"
            :placeholder="$t('menuManagement.sortPlaceholder')"
          />

          <!-- 可见性 -->
          <van-field :label="$t('menuManagement.visible')">
            <template #input>
              <van-switch
                v-model="formData.visible"
                :active-text="$t('menuManagement.visibleOptions.visible')"
                :inactive-text="$t('menuManagement.visibleOptions.hidden')"
              />
            </template>
          </van-field>

          <!-- 权限标识 -->
          <van-field
            v-model="formData.perms"
            :label="$t('menuManagement.perms')"
            :placeholder="$t('menuManagement.permsPlaceholder')"
          />
        </van-cell-group>

        <div class="form-actions">
          <van-button type="default" block @click="handleCancel">
            {{ $t('common.cancel') }}
          </van-button>
          <van-button type="primary" block native-type="submit" :loading="submitting">
            {{ $t('common.save') }}
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 上级菜单选择器 - 左右分栏单选模式 -->
    <van-popup v-model:show="showParentMenuPicker" position="bottom" :style="{ height: '70%' }">
      <div class="parent-menu-picker">
        <van-nav-bar
          :title="$t('menuManagement.parentMenu')"
          left-arrow
          @click-left="showParentMenuPicker = false"
        />

        <div class="menu-select-container">
          <!-- 左侧菜单组 -->
          <div class="menu-group-list">
            <div
              v-for="(group, index) in menuGroups"
              :key="index"
              :class="['menu-group-item', { active: selectedGroupIndex === index }]"
              @click="handleGroupClick(index)"
            >
              {{ group.name }}
            </div>
          </div>

          <!-- 右侧菜单项 -->
          <div class="menu-item-list">
            <div
              v-for="menu in currentMenuItems"
              :key="menu.id"
              :class="['menu-item', { active: selectedMenuItemId === menu.id }]"
              @click="handleMenuItemClick(menu)"
            >
              {{ menu.name }}
              <van-icon
                v-if="selectedMenuItemId === menu.id"
                name="checked"
                class="menu-check-icon"
              />
            </div>
          </div>
        </div>

        <div class="tree-actions">
          <van-button type="default" block @click="showParentMenuPicker = false">
            {{ $t('common.cancel') }}
          </van-button>
          <van-button type="primary" block @click="confirmParentMenuSelection">
            {{ $t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { showToast } from 'vant'

  const props = defineProps({
    menu: {
      type: Object,
      default: null
    },
    parentMenus: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['submit', 'cancel'])

  const { t } = useI18n()

  // 响应式数据
  const submitting = ref(false)
  const showParentMenuPicker = ref(false)
  const selectedGroupIndex = ref(0)
  const selectedMenuItemId = ref(null)
  const formData = ref({
    id: 0,
    menuName: '',
    parentId: 0,
    path: '',
    component: '',
    icon: '',
    type: 1,
    sort: 0,
    visible: 1,
    perms: '',
    children: []
  })

  // 计算属性：将菜单数据按类型分组
  const menuGroups = computed(() => {
    if (!props.parentMenus || props.parentMenus.length === 0) {
      return [{ name: '顶级菜单', menus: [{ id: 0, name: '无（顶级菜单）' }] }]
    }

    // 创建菜单组
    const groups = [
      { name: '顶级菜单', menus: [{ id: 0, name: '无（顶级菜单）' }] },
      { name: '系统管理', menus: [] },
      { name: '车源管理', menus: [] },
      { name: '订单管理', menus: [] },
      { name: '聊天管理', menus: [] }
    ]

    // 将菜单分配到对应组
    props.parentMenus.forEach(menu => {
      // 从label中提取菜单名称（移除前缀符号）
      const menuName = menu.label.replace(/^└─\s*/, '')
      const menuId = menu.value

      // 根据菜单名称判断应该放入哪个组
      if (menuName.includes('系统')) {
        groups[1].menus.push({ id: menuId, name: menuName })
      } else if (menuName.includes('车源')) {
        groups[2].menus.push({ id: menuId, name: menuName })
      } else if (menuName.includes('订单')) {
        groups[3].menus.push({ id: menuId, name: menuName })
      } else if (menuName.includes('聊天')) {
        groups[4].menus.push({ id: menuId, name: menuName })
      } else {
        // 其他菜单放入系统管理组
        groups[1].menus.push({ id: menuId, name: menuName })
      }
    })

    return groups
  })

  // 当前选中组的菜单项
  const currentMenuItems = computed(() => {
    if (!menuGroups.value || menuGroups.value.length === 0) {
      return []
    }
    return menuGroups.value[selectedGroupIndex.value]?.menus || []
  })

  // 计算选中的上级菜单
  const selectedParentMenu = computed(() => {
    if (formData.value.parentId === 0) {
      return {
        value: 0,
        label: '无（顶级菜单）'
      }
    }

    // 从菜单分组结构中查找选中的菜单信息
    for (const group of menuGroups.value) {
      const menu = group.menus.find(m => m.id === formData.value.parentId)
      if (menu) {
        return {
          value: menu.id,
          label: menu.name
        }
      }
    }

    // 如果在分组结构中找不到，则从原始props.parentMenus中查找
    return props.parentMenus.find(menu => menu.value === formData.value.parentId) || null
  })

  // 处理左侧菜单组点击
  const handleGroupClick = index => {
    selectedGroupIndex.value = index
    // 切换组时重置选中的菜单项
    selectedMenuItemId.value = null
  }

  // 处理右侧菜单项点击
  const handleMenuItemClick = menu => {
    selectedMenuItemId.value = menu.id
  }

  // 确认选择的上级菜单
  const confirmParentMenuSelection = () => {
    if (selectedMenuItemId.value !== null) {
      // 设置选中的父菜单ID
      formData.value.parentId = selectedMenuItemId.value
    } else {
      // 如果没有选中任何菜单，设置为顶级菜单
      formData.value.parentId = 0
    }
    showParentMenuPicker.value = false
  }

  // 初始化表单数据
  const initFormData = () => {
    if (props.menu) {
      // 编辑模式，填充已有数据
      formData.value = {
        id: props.menu.id || 0,
        menuName: props.menu.menuName || '',
        parentId: props.menu.parentId || 0,
        path: props.menu.path || '',
        component: props.menu.component || '',
        icon: props.menu.icon || '',
        type: props.menu.type || 1,
        sort: props.menu.sort || 0,
        visible: props.menu.visible !== undefined ? props.menu.visible : 1,
        perms: props.menu.perms || '',
        children: props.menu.children || []
      }
    } else {
      // 新增模式，重置表单
      formData.value = {
        id: 0,
        menuName: '',
        parentId: 0,
        path: '',
        component: '',
        icon: '',
        type: 1,
        sort: 0,
        visible: 1,
        perms: '',
        children: []
      }
    }
  }

  // 当打开上级菜单选择器时，初始化选中状态
  const openParentMenuPicker = () => {
    // 重置选择状态
    selectedGroupIndex.value = 0
    selectedMenuItemId.value = null

    // 如果已经有选中的父菜单，尝试找到对应的组和菜单项
    if (formData.value.parentId !== undefined && formData.value.parentId !== 0) {
      // 查找对应的菜单项
      let found = false
      for (let i = 0; i < menuGroups.value.length; i++) {
        const group = menuGroups.value[i]
        const menu = group.menus.find(m => m.id === formData.value.parentId)

        if (menu) {
          selectedGroupIndex.value = i
          selectedMenuItemId.value = menu.id
          found = true
          break
        }
      }
    }

    showParentMenuPicker.value = true
  }

  // 表单提交
  const onSubmit = async () => {
    try {
      submitting.value = true

      // 构建提交数据，确保数据结构符合API要求
      const submitData = {
        menu: {
          ...formData.value,
          visible: +formData.value.visible
        }
      }

      emit('submit', submitData)
    } catch (error) {
      console.error('提交失败:', error)
      showToast(t('common.error'))
    } finally {
      submitting.value = false
    }
  }

  // 处理取消
  const handleCancel = () => {
    emit('cancel')
  }

  // 监听菜单数据变化，初始化表单
  watch(
    () => props.menu,
    newMenu => {
      initFormData()
    },
    { immediate: true, deep: true }
  )
</script>

<style lang="scss" scoped>
  .menu-form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }

  .form-actions {
    padding: 15px;
    display: flex;
    gap: 10px;

    .van-button {
      flex: 1;
    }
  }

  .parent-menu-picker {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .menu-select-container {
    flex: 1;
    display: flex;
    height: 0;
    min-height: 300px;
  }

  // 左侧菜单组列表样式
  .menu-group-list {
    width: 100px;
    background-color: #f7f7f7;
    overflow-y: auto;
  }

  .menu-group-item {
    padding: 15px 10px;
    text-align: center;
    font-size: 14px;
    color: #333;
    border-left: 3px solid transparent;
  }

  .menu-group-item.active {
    background-color: #fff;
    border-left-color: #1989fa;
    color: #1989fa;
    font-weight: 500;
  }

  // 右侧菜单项列表样式
  .menu-item-list {
    flex: 1;
    padding: 10px;
    background-color: #fff;
    overflow-y: auto;
  }

  .menu-item {
    padding: 15px 10px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .menu-item.active {
    color: #1989fa;
  }

  .menu-check-icon {
    color: #1989fa;
  }

  .tree-actions {
    padding: 15px;
    display: flex;
    gap: 10px;

    .van-button {
      flex: 1;
    }
  }
</style>
