import Vue from 'vue'
import vuex from 'vuex'
import home from './home.js'; //引入home store对象
import topBar from './topBar.js';
import configs from  './configs'
import wsclient from './wsclient'
import demand from './demand'
import message from './message'
import userinfo from "./userinfo"
import question from './question';
import languageMessageMap from './languageMessageMap';

Vue.use(vuex);

const store = new vuex.Store({
    modules: {
        home,
        topBar,
        configs,
        wsclient,
        demand,
        message,
        userinfo ,
        languageMessageMap,
        question,
    },
    actions:{
        userStoreInit:({commit, state}, username)=>{
            console.log("userStoreInit--------------------------------");
            // 加载站点配置
            store.dispatch("loadConfigMap");
            // 加载站点配置
            store.dispatch("loadSystemConfigMap");
            // 加载语言 map
            store.dispatch("loadLanguageMessageMap");
            // 加载问题配置
            store.dispatch('loadQuestionConfigs');
        }
    }
})

export default store;
