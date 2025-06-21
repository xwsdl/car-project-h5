# 汽车 H5 项目

基于 Vue 3 + Vite 的汽车相关 H5 移动端项目

## 🚀 快速开始

### 环境要求

- Node.js: 20.9.0+
- npm: 10.1.0+
- Git

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 🛠️ 开发环境配置

### 必需插件

为了获得最佳的开发体验，请安装以下 VSCode 插件：

#### 核心插件

- **Vue Language Features (Volar)** - Vue 3 语法支持
- **TypeScript Vue Plugin (Volar)** - Vue 3 TypeScript 支持
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **i18n Ally** - 国际化支持

#### 推荐插件

- **Auto Rename Tag** - 自动重命名标签
- **Path Intellisense** - 路径自动补全
- **CSS Peek** - CSS 类名跳转
- **SCSS IntelliSense** - SCSS 语法支持

### 自动安装插件

项目已配置 `.vscode/extensions.json`，当新同事打开项目时，VSCode 会自动提示安装推荐的插件。

### 手动安装插件

如果自动安装失败，可以手动安装：

1. 打开 VSCode
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索并安装上述插件

## 📁 项目结构

```
src/
├── api/           # API 接口
├── assets/        # 静态资源
├── components/    # 公共组件
├── directives/    # 自定义指令
├── hooks/         # 组合式函数
├── i18n/          # 国际化配置
├── router/        # 路由配置
├── stores/        # 状态管理
├── utils/         # 工具函数
└── views/         # 页面组件
```

## 🎨 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Vant 4
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: SCSS
- **国际化**: Vue I18n
- **代码规范**: ESLint + Prettier

## 📱 移动端适配

- 设计稿基准宽度：375px
- 使用 pxToViewport 插件自动转换
- 支持 1px 边框处理

## 🌍 多语言支持

- 中文简体 (zh-CN)
- 俄语 (ru-RU)

## 🔧 开发规范

- 使用 Vue 3 Composition API
- 遵循 BEM 命名规范
- 组件化开发
- 移动端优先设计

## 📞 技术支持

如有问题，请联系开发团队。
