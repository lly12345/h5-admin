import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from "path";
import fs from 'fs'
import lessToJS from 'less-vars-to-js'
import config from './config'

// 按需加载
import vitePluginImp from 'vite-plugin-imp'


console.log('process:::env', process.argv);
// 获取环境变量
const env = process.argv[process.argv.length-1]
const base = config[env]

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './config/variables.less'), 'utf8')
)

// https://vitejs.dev/config/
export default defineConfig({
  base: base.cdn,
  resolve:{
    alias:{
      "@": path.resolve(__dirname,"src"),
      "components":path.resolve(__dirname,"src/components"),
      "pages":path.resolve(__dirname,"src/pages"),
      "utils": path.resolve(__dirname, "src/utils"),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://admin.cjj.x',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  plugins: [
    reactRefresh(),
    vitePluginImp({
      libList:[{
        libName:"zarm",
        style:(name) => `zarm/lib/${name}/style/index.css` 
      }]
    })
  ],
  css:{
    preprocessorOptions:{
      less:{
        // 支持内联JavaScript
        javascriptEnabled:true,
        // 重写less变量，定制样式
        modifyVars:themeVariables
      }
    }
  }
})
