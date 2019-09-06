### 项目结构说明

> vue-project

#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

使用npm 国内比较慢，可以安装cnpm（淘宝镜像) ,如下 

npm install -g cnpm --registry=https://registry.npm.taobao.org 

cnpm install

项目目录结构

```
VUE
  |  - build  - > 构建
  |  - config - > 配置
      |  -  dev.env.js                           
      |  -  index.js  - >基础配置文件              
      |  -  prod.env.js                          
  |  -  node_modules  - >存放项目依赖的第三方节点包
  |  -  src
      |  -  api  - > api 相关api讲求
          |  -  api.js  - > api请求相关的地址定义
          |  -  xxx.js  - > 页面数据api 请求
      |  -  assets  - > 存放静态文件
      |  -  components  - >存放公共组件
      |  -  mock  - > mock文件夹
          |  -  mock.js  - > mock文件，命名根据实际需要命名，自动生成接口数据
      |  - pages - >页面文件
          |  -  ... 相关页面开发...
          |  -  home.vue  - >入口文件，所有请求都会经过， 
          |  -  leftMenu.vue  - > 左侧菜单
          |  -  topBar.vue  - > 顶部栏
      |  -  router  - >路由
          |  -  index.js  - >路由文件
      |  -  store  - >仓库文件夹。里面存储一些公用数据
          |  -  index.js  - >总的仓库文件，作为仓库文件的根文件
          |  -  xxx.js  - > 其它仓库文件
      |  -  theme  - > 项目主题定义
      	  |  - theme.scss -> 主题
          |  -  theme-variables.scss -> 定义样式使用的变量
      |  -  utils  - >存放工具类文件
          |  -  auth.js  - > 权限验证工具类
          |  -  const.js  - >  全局常量定义
          |  -  filters.js  - >  全局过滤器定义
          |  -  http.js  - >  ajax请求封装
          |  -  languageWebMap.js  - >  语言map 转换
          |  -  utils.js  - >  通用工具类
          |  -  validate.js  - >  全局验证器
      |  -  App.vue  - >全局根组件
      |  -  main.js  - >入口文件
  |  -  static  - >静态资源，例如json数据
  |  -  .babelrc  - >语法解析器，（es6特性浏览器还没有全部支持，因此需要解析）
  |  -  .editorconfig  - >配置编辑器的语法，默认tab = 2，项目开发时改为tab = 4
  |  -  .eslintignore  - >配置不受代码规范检测的文件夹及文件
  |  -  .eslintrc.js  - > eslint代码规范检测
  |  -  .gitignore  - > git上传相关配置
  |  -  .postcssrc.js  - > postcss的配置项
  |  -  index.html  - >默认首页模板文件
  |  -  package.json  - >第三方依赖包
  |  -  package-lock.json  - >第三方依赖包版本
  |  -  README.md  - >项目启动说明文件
```



### 项目使用的ui库

1. element-UI -> 常用UI组件库
2. echarts -> 图表

