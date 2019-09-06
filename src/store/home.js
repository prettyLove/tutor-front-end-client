
// 多个 state 的操作 , 使用 mutations 会来触发会比较好维护 ,
// 那么需要执行多个 mutations 就需要用 action 了:

import {default as HTTP} from '@/utils/http'
import { api } from '@/api/api'


export default{
    state: {
        leftMenuShow:false,
        screenWidth: document.body.clientWidth ,  // 屏幕宽度改变 这里是给到了一个默认值 （这个很重要）
        screenHeight: document.body.clientHeight ,  // 屏幕宽度改变 这里是给到了一个默认值 （这个很重要）
        windowHeight: document.documentElement.clientHeight,
        windowWidth: document.documentElement.clientWidth,
        userInfo :{},  // 用户信息 email roleId roleName systemCodes userName userType
        allSystemsConfigListLoading:false,
    },
    getters:{
        getScreenWidth(state){
            return state.screenWidth;
        },
        getScreenHeight(state){
            return state.screenHeight;
        },
        getWindowWidth(state){
            return state.windowWidth;
        },
        getWindowHeight(state){
            return state.windowHeight;
        },
        leftMenuSta(state){
            return state.leftMenuShow;
        },
        leftMenuWidth(state){//这里的state对应着上面这个state
            return  state.leftMenuShow?'219px':'64px' ;
        },
        getUserInfo(state){
            return state.userInfo;
        },
        isAllSystemConfigListLoadComplete (state) {
            return state.allSystemsConfigListLoading;
        },
    },
    mutations: {
        windowSizeChange:function(state){//这里的state对应着上面这个state
            // console.log("window.onresize -----",state.screenHeight,state.windowHeight);
            window.screenWidth = document.body.clientWidth;
            state.screenWidth = window.screenWidth;
            window.screenHeight = document.body.clientHeight;
            state.screenHeight = window.screenHeight;
            state.windowHeight=document.documentElement.clientHeight;
            state.windowWidth=document.documentElement.clientWidth ;
            // console.log(state.windowHeight)
        },
        // 打开或关闭左边菜单
        switchLeftMenu:function(state){//这里的state对应着上面这个state
            state.leftMenuShow = state.leftMenuShow?false:true;
            //console.log("leftMenuShow",state.leftMenuShow);
            //你还可以在这里执行其他的操作改变state
        },
        setUserInfo:function (state,userInfo) {
            state.userInfo = userInfo;
            state.allSystemsConfigListLoading = true;
        }
    },
    actions:{

    }
}
