import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import {getToken} from '@/utils/auth'
import home from '@/pages/home'
import wellcome from '@/pages/wellcome/wellcome'
import historyList from '@/pages/history/historyList'
import historyExercisesReview from '@/pages/history/historyExercisesReview'
import materialsList from '@/pages/teaching_materials/materialsList'
import notesList from '@/pages/notes/notesList'
import moviesList from '@/pages/movies/moviesList'
import demandList from '@/pages/demand/demandList'
import pairSuitedForm from '@/pages/demand/pairSuitedForm'
import login from '@/pages/login/login'
import retrievePassword from  "@/pages/retrievePassword/retrievePassword"
import forgetPassword from  "@/pages/forgetPassword/forgetPassword"
import userActive from  "@/pages/userActive/userActive"
import systemMessage from '../pages/system_message/systemMessage'
import userMessage from '../pages/user_message/userMessage'

import setting from  "../pages/setting/setting"
import userInfo from  "../pages/user/userInfo"
import collector from  "../pages/collector/collectorList"


// question
import addQuestion from '@/pages/question/addQuestion'
import questionList from '@/pages/question/questionList'
import previewQuestion from '@/pages/question/previewQuestion'
import register from "../pages/register/register";

// dashboard
import dashboardPanel from '@/pages/dashboard/panel'
import dashboardList from '@/pages/dashboard/dashboardList'
import notesManager from "../pages/notes/notesManager";
import moviesManager from "../pages/movies/moviesManager";
import testmode from "../pages/testmode/testmode";
import testmodeList from "../pages/testmode/testmodeList";
import testmodeReview from "../pages/testmode/testmodeReview";
import exerciseMode from "../pages/exerciseMode/exerciseMode";
import exerciseModeReview from "../pages/exerciseMode/exerciseModeReview";
import programmeMessage from "../pages/wellcome/programmeMessage";

Vue.use(Router)

let router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/wellcome'
        },
        {
            // name: '登陆',
            name: 'login',
            path: '/login',
            component: login
        },
        {
            // name: '忘记密码',
            name: 'Forget the password',
            path: '/forgetPassword',
            component: forgetPassword
        },
        {
            // name: '找回密码',
            name: 'retrievePassword',
            path: '/Retrieve the password',
            component: retrievePassword
        },
        {
            // name: '用户激活',
            name: 'userActive',
            path: '/userActive',
            component: userActive
        },
        {
            // name: '注册',
            name: 'register',
            path: '/register',
            component: register
        },
        {
            // name: '管理',
            name: 'Administration',
            path: '/home',
            component: home,
            meta: {
                login: true,
            },
            children: [
                {
                    name: 'wellcome',
                    path:'/wellcome',
                    component:wellcome,
                    meta: {
                        login:true
                    }
                },
                {
                    name:'dashboard',
                    path:'/dashboard/panel',
                    component:dashboardPanel,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'画板管理',
                    name:'Sketchpad management',
                    path:'/dashboard/dashboardList',
                    component:dashboardList,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'历史课程',
                    name:'History Course',
                    path:'/history/historyList',
                    component:historyList,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'习题回看',
                    name:'Review of Exercises',
                    path:'/history/historyExercisesReview',
                    component:historyExercisesReview,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'教学笔记',
                    name:'Teaching Notes',
                    path:'/notes/notesList',
                    component:notesManager,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'教学影片',
                    name:'Teaching Film',
                    path:'/movies/moviesList',
                    component:moviesManager,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'配对管理',
                    name:'Matching Management',
                    path:'/demand/demandList',
                    component:demandList,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'配对请求管理',
                    name:'Matched Request Management',
                    path:'/demand/pairSuitedForm',
                    component:pairSuitedForm,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'用户消息中心',
                    name:'User Message Center',
                    path:'/userMessage/list',
                    component:userMessage,
                    meta:{
                        login:true
                    }
                },
                {
                    // name:'日程消息中心',
                    name:'Schedule Message Center',
                    path:'/wellcome/programmeMessage',
                    component:programmeMessage,
                    meta:{
                        login:true
                    }
                },
                {
                    // name: '题库列表',
                    name: 'Topic List',
                    path:'/question/questionList',
                    component:questionList,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '题库录入',
                    name: 'Topic entry',
                    path:'/question/addQuestion',
                    component:addQuestion,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '题目预览',
                    name: 'Topic Preview',
                    path:'/question/previewQuestion',
                    component:previewQuestion,
                    meta: {
                        login:true
                    }
                },
                {
                    name: 'setting',
                    path:'/setting/setting',
                    component:setting,
                    meta: {
                        login:true
                    }
                },
                {
                    name: 'userInfo',
                    path:'/user/userInfo',
                    component:userInfo,
                    meta: {
                        login:true
                    }
                },
                {
                    name: 'collector',
                    path:'/collector/collectorList',
                    component:collector,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '测验模式',
                    name: 'Test mode',
                    path:'/testmode/testmode',
                    component:testmode,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '测验列表',
                    name: 'Test List',
                    path:'/testmode/testmodeList',
                    component:testmodeList,
                    meta: {
                        login:true
                    }
                },
                ,
                {
                    // name: '测验回看',
                    name: 'Look back on the test',
                    path:'/testmode/testmodeReview',
                    component:testmodeReview,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '练习模式',
                    name: 'Contact mode',
                    path:'/exerciseMode/exerciseMode',
                    component:exerciseMode,
                    meta: {
                        login:true
                    }
                },
                {
                    // name: '练题回看',
                    name: 'Looking back on the exercises',
                    path:'/exerciseMode/exerciseModeReview',
                    component:exerciseModeReview,
                    meta: {
                        login:true
                    }
                },
                // {
                //     name: 'convertDiagram',
                //     path:'/convertDiagram',
                //     component:convertDiagram,
                //     meta: {
                //         login:true
                //     }
                // },
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((item) => item.meta.login)) {
        let token = getToken();
        if ( token != null && token != "") {
            next();
        } else {
            router.push({
                path: '/login'
            })
        }
    } else {
        next();
    }

})

export default router
