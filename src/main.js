
import Vue from 'vue';

// 引入http工具
import {default as HTTP} from './utils/http'
Vue.prototype.$http = HTTP

import querystring from 'querystring';
Vue.prototype.$qs = querystring;

import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store/index.js'

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './theme/element-variables.scss'
Vue.use(ElementUI);

import App from './App';
import router from './router';

Vue.config.productionTip = false

// 全局过虑器
import filters from './utils/filters'
Vue.use(filters)
// 工具类
import Utils from './utils/utils'
Vue.use(Utils)
// api 接口定义
import Api from './api/api'
Vue.use(Api)
// 常量定义
import Cnost from './utils/const'
Vue.use(Cnost)

// 语言
import languageWebMap from "./utils/languageWebMap";
Vue.use(languageWebMap)

// 验证权限
import { isAuth } from '@/utils/auth'
Vue.prototype.isAuth  = isAuth;

import './assets/styles/reset.css'
import './assets/styles/common.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

import lgHr from '@/components/lgHr'
Vue.component('LgHr', lgHr)

//FullCalendar


new Vue({
    el: '#app',
    router,
    store,//使用store
    components: {App},
    template: '<App/>'
})


