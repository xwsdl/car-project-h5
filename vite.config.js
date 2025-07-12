import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
import pxToViewport from 'postcss-px-to-viewport'
import remToViewport from 'postcss-rem-to-viewport'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import { DESIGN_WIDTH } from './const/index'
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())
  console.log('当前环境变量：', env) // 添加日志，方便调试

  return {
    plugins: [
      vue(),
      vueJsx(),
      // vueDevTools(),
      Components({
        // 关键配置：使用 Vant 解析器
        resolvers: [VantResolver({ importStyle: 'css' })],
        // 可选：关闭自动生成类型声明文件（避免 TS 报错）
        dts: false,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss" as *; // 加载入口文件并暴露所有成员
          `,
        },
      },
      postcss: {
        plugins: [
          // 将 px 转换为 vw（布局类单位）
          pxToViewport({
            unitToConvert: 'px', // 需要转换的单位
            viewportWidth: DESIGN_WIDTH, // 设计稿宽度（以 iPhone 6/7/8 为基准）
            unitPrecision: 5, // 转换精度
            propList: ['*', '!font*', '!line-height', '!border-radius'], // 需要转换的 CSS 属性（排除字体相关）
            viewportUnit: 'vw', // 转换后的单位
            fontViewportUnit: 'rem', // 字体使用的单位
            selectorBlackList: [
              'van-', // 忽略 Vant 组件
              'ignore-', // 自定义忽略类
              /^body$/, // 忽略 body 标签
            ], // 不转换的选择器
            minPixelValue: 2, // 2px 以下不转换（处理 1px 边框）
            mediaQuery: false, // 不转换媒体查询
            replace: true, // 直接替换原始值
            exclude: /node_modules/, // 排除 node_modules
          }),
          // 处理字体类 rem → vw（可选）
          remToViewport({
            rootValue: 16, // 根字体大小 (基准值)
            unitPrecision: 5,
            propList: ['font*', 'line-height'], // 只处理字体
            viewportWidth: DESIGN_WIDTH,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw', // 字体使用 vw 单位
            selectorBlackList: [],
          }),
        ],
      },
    },
    base: './', // 添加这一行
    build: {
      assetsInlineLimit: 4096, // 小于 4KB 的图片转 base64
      assetsDir: 'assets', // 输出目录
    },
    server: {
      host: '0.0.0.0', // 允许所有地址访问
      port: 5173, // 指定端口（可选）
      strictPort: true, // 端口被占用时直接退出
      open: false, // 禁止自动打开浏览器
      proxy: {
        // 代理所有以 /api 开头的请求
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://8.211.38.230:8084', // 添加默认值
          changeOrigin: true, // 修改请求头中的host为目标URL
          rewrite: (path) => {
            const newPath = path.replace(/^\/api/, '')
            console.log('原始请求路径:', path)
            console.log('重写后的路径:', newPath)
            console.log('目标服务器:', env.VITE_API_BASE_URL + newPath)

            return newPath
          },
          secure: false,
        },
        // 可以配置多个代理
        '/jisuapi': {
          target: 'https://api.jisuapi.com', // 添加默认值
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/jisuapi/, '')
            // console.log('原始请求路径:', path)
            // console.log('重写后的路径:', newPath)
            // console.log('目标服务器:', env.VITE_APP_BASE_API || 'http://8.211.38.230:8084')
            return newPath
          },
        },
      },
    },
  }
})
