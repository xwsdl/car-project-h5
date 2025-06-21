# 新同事入职指南

欢迎加入汽车 H5 项目团队！本指南将帮助你快速搭建开发环境并开始工作。

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <项目地址>
cd car-project-h5
```

### 2. 一键环境配置

```bash
npm run setup
```

这个命令会自动：
- 安装项目依赖
- 检查开发环境配置
- 验证必需工具

### 3. 启动开发服务器

```bash
npm run dev
```

## 🛠️ 必需工具安装

### Node.js 和 npm

- **Node.js**: 20.9.0+ 
- **npm**: 10.1.0+

下载地址：https://nodejs.org/

### VSCode 编辑器

下载地址：https://code.visualstudio.com/

### 必需插件

项目已配置自动插件推荐，打开项目时会自动提示安装。如果未自动提示，请手动安装：

#### 核心插件（必需）
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

## 📋 环境检查

运行以下命令检查环境是否正确配置：

```bash
npm run check-env
```

## 🎯 开发规范

### 代码风格
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 Vue 3 官方风格指南
- 使用 Composition API 的 setup 语法糖

### 组件开发
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 页面组件放在 `src/views/` 目录
- 公共组件放在 `src/components/` 目录

### 样式开发
- 使用 SCSS 预处理器
- 遵循 BEM 命名规范
- 移动端优先设计

### 国际化
- 所有用户界面文本必须使用 i18n 函数包装
- 支持中文简体 (zh-CN) 和俄语 (ru-RU)

## 🔧 常用命令

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format

# 环境检查
npm run check-env
```

## 📱 移动端调试

### 浏览器调试
1. 打开浏览器开发者工具
2. 切换到移动设备模式
3. 选择目标设备尺寸

### 真机调试
1. 确保手机和电脑在同一网络
2. 运行 `npm run dev` 获取本地 IP
3. 在手机浏览器访问该 IP 地址

## 🌍 多语言开发

### 添加新语言文本
1. 在 `src/i18n/locales/zh-CN.json` 添加中文文本
2. 在 `src/i18n/locales/ru-RU.json` 添加俄语文本
3. 在组件中使用 `$t('key')` 引用

### 切换语言
使用 `LanguageSwitcher` 组件或调用 `i18n.global.locale = 'ru-RU'`

## 🐛 常见问题

### Q: 依赖安装失败
A: 检查 Node.js 版本，确保使用 20.9.0+

### Q: VSCode 插件不生效
A: 重启 VSCode，确保安装了所有推荐插件

### Q: 移动端样式异常
A: 检查 pxToViewport 配置，确保设计稿基准宽度为 375px

### Q: 国际化文本不显示
A: 检查语言包文件格式，确保 JSON 格式正确

## 📞 技术支持

- 项目文档：查看 README.md
- 技术问题：联系团队技术负责人
- 环境问题：运行 `npm run check-env` 诊断

## 🎉 开始开发

环境配置完成后，你可以：

1. 查看 `src/views/` 了解页面结构
2. 查看 `src/components/` 了解组件库
3. 运行 `npm run dev` 启动开发服务器
4. 开始你的第一个功能开发！

祝开发愉快！ 🚀 