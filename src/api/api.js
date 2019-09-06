import {$get, $patch} from "../utils/http";

const apiBasePath = ""
export const api = {
    //主页路由
    homeRouter: {
        login: apiBasePath + "/signin", /*登录*/
        logout: apiBasePath + "/signup", /*登出*/
        register: apiBasePath + "/user/register",/*注册*/
        index: apiBasePath + "home/index", /*主页面*/
        updateUserCookie: apiBasePath + "/home/updateUserCookie",//根据cookie查询用户

    },
    // site config
    siteConfigRouter: {
        config: apiBasePath + "/config/config", //
        systemConfig: apiBasePath + "/config/systemConfig", //
        getLanguageMessage: apiBasePath + "/config/getLanguageMessage", //
    },

    //用户
    userRouter: {
        updateUserInfo: apiBasePath + "/user/updateUserInfo", // 用户自己更新信息
        getAuthByUsername: apiBasePath + "/user/getAuthByUsername",
        updatePasswordById: apiBasePath + "/user/updatePasswordById",
        queryUserByToken: apiBasePath + "/user/queryUserByToken",//根据cookie查询用户
        getUserById: apiBasePath + "/user/getUserById",//根据id查询用户
        getCountByName: apiBasePath + "/user/getCountByName",
        // getUploadFile: apiBasePath + "/upload/uploadFile", //上传文件
        getUploadFile: apiBasePath + "/upload/upload", //上传文件     接口变更
        getActivated: apiBasePath + "/user/activated", //用户激活
        findPasswordEmail: apiBasePath + "/user/findPasswordEmail", //找回密码
        basicComentSave: apiBasePath + "/user/save", //基本信息保存
        basicComentgetUser: apiBasePath + "/user/getUser", //基本信息保存
        saveUserStudent: apiBasePath + "/user/saveUserStudent", //学生信息保存
        getUserStudent: apiBasePath + "/user/getUserStudent", //学生信息获取
        getCountByEmail: apiBasePath + "/user/getCountByEmail", //注册邮箱验证(一个邮箱只能注册一个账户)
        getCountByPhone: apiBasePath + "/user/getCountByPhone", //手机号码验证
    },

    //导师
    tutorRouter:{
        tutorAdd: apiBasePath + "/tutorCheck/add", //添加文件
        tutorGetListByUser: apiBasePath + "/tutorCheck/getListByUser", //获取列表
        tutorUpdate: apiBasePath + "/tutorCheck/update", //修改文件
        tutorDelete: apiBasePath + "/tutorCheck/delete", //删除文件
        saveUserTutor: apiBasePath + "/user/saveUserTutor", //导师信息保存
        getUserTutor: apiBasePath + "/user/getUserTutor", //导师信息获取
    },
    //会员管理
    memberRouter: {

    },

    // 问题路由
    questionRouter:{
        getConfig: apiBasePath + "/question/getConfig",
        listPage: apiBasePath + "/question/getDisplayQuestions",
        save: apiBasePath + "/question/editQuestion",
        delete: apiBasePath + "/question/delete",
        getOriginalQuestion: apiBasePath + "/question/getOriginalQuestion", // 根据id 请求
        getTotalQuestion: apiBasePath + "/question/getTotalQuestion", // 请求全部信息
        approveSelfQuestion: apiBasePath + "/question/approveSelfQuestion", // 审核题目
        getMathjaxPreview: apiBasePath + "/question/getMathjaxPreview", // 预览题目
        createQuestion: apiBasePath + "/question/createQuestion", //
        getQuestionDiagramList: apiBasePath + "/question/getQuestionDiagramList", //
        saveQuestionDiagramXml: apiBasePath + "/question/saveQuestionDiagramXml", //
        getAssessQuestion: apiBasePath + "/question/getAssessQuestion", //课后习题
        answerQuestion: apiBasePath + "/question/answerQuestion", //课后习题
        getExerciseQuestion: apiBasePath + "/question/getExerciseQuestion", //课后练习
        submitExercise: apiBasePath + "/question/submitExercise", //课后练习提交
        getAssessQuestionResult: apiBasePath + "/question/getAssessQuestionResult", //课后习题(history)结果查看
        getExerciseGrade: apiBasePath + "/question/getExerciseGrade", //课后习题(history)对错题结果查看
        exerciseListPage: apiBasePath + "/question/exerciseListPage", //课后练习(exercise)结果查看
    },
    //公告管理
    systemNoticeRouter: {
        list: apiBasePath + "/systemNotice/list",//分页查询列表
    },
    // message管理
    userMessageRouter: {
        listPage: apiBasePath + "/userMessage/listPage",//查询个人所有需求
        read: apiBasePath + "/userMessage/read",//查询个人所有需求
        getCount: apiBasePath + "/userMessage/getCountNotRead",//查询个人所有需求
    },
    // 需求管理
    demandRouter: {
        listPage: apiBasePath + "/demand/getList",//查询个人所有需求
        insert: apiBasePath + "/demand/add",//添加需求
        update: apiBasePath + "/demand/update",//更改需求
        delete: apiBasePath + "/demand/delete",//删除需求
        getDemand: apiBasePath + "/demand/listDemands",//获得匹配的需求通过需求id
        getSendDemandList: apiBasePath + "/demand/getSendDemandList",//获得发送的需求
        getAcceptDemandList: apiBasePath + "/demand/getAcceptDemandList",//获得接收的需求
        listPageChild: apiBasePath + "/demand/listPage",//查询个人所有需求
    },
    // 配对 管理
    pairRouter: {
        list: apiBasePath + "/pair/getPairSuited",//查询需求所有匹配的人
        send: apiBasePath + "/pair/sendPair",//发送配对请求
        accept: apiBasePath + "/pair/accept",//确认配对
        decline: apiBasePath + "/pair/decline",//拒绝配对
        getPairList:apiBasePath + "/pair/getPairList",//获得所有配对成功的人
        getRequestNum:apiBasePath + "/pair/getRequestNum",//查询收到未处理请求数量
    },
    // 画板管理
    dashboardRouter:{
        listPage:apiBasePath + "/dashboard/listPage",
        add:apiBasePath + "/dashboard/add",
        get:apiBasePath + "/dashboard/get",
        save:apiBasePath + "/dashboard/save",
        delete:apiBasePath + "/dashboard/delete",
    },
    // room
    roomRouter:{
        listPage : apiBasePath + "/room/listPage" ,
        topList : apiBasePath + "/room/topList" ,
        get :  apiBasePath + "/room/get" ,
        assessRoom :  apiBasePath + "/room/assessRoom" , //提交评分接口
        getAssessRoomByRoomId:  apiBasePath + "/room/getAssessRoomByRoomId" , //查看评分接口
        getAssessList:  apiBasePath + "/room/getAssessList" , //获取id信息
    },

    // feedback
    feedbackRouter:{
        add: apiBasePath + "/feedback/add",//用户反馈
    },

    // 资源问题反馈
    resourceFeedbacRouter:{
        add: apiBasePath + "/resourceFeedback/add",
    },
    //教学笔记
    notesRouter:{
        listPage:apiBasePath + "/notes/listPage",
        add:apiBasePath + "/notes/add",
        get:apiBasePath + "/notes/get",
        save:apiBasePath + "/notes/save",
        delete:apiBasePath + "/notes/delete",
        listPageCommon:apiBasePath + "/notes/listPageCommon", //教学笔记列表(全部)
    },
    //教学影片
    moviesRouter:{
        listPage:apiBasePath + "/movies/listPage",
        add:apiBasePath + "/movies/add",
        get:apiBasePath + "/movies/get",
        save:apiBasePath + "/movies/save",
        delete:apiBasePath + "/movies/delete",
        listPageCommon:apiBasePath + "/movies/listPageCommon", //教学笔记列表(全部)
    },
    //添加收藏
    collectionRouter:{
        add:apiBasePath + "/myFavor/add",
        delete:apiBasePath + "/myFavor/delete",
        listPage:apiBasePath + "/myFavor/listPage",
    },
    // 日程安排
    schedulePlanRouter:{
        listPage:apiBasePath + "/schedulePlan/listPage",
        list:apiBasePath + "/schedulePlan/list",
        add:apiBasePath + "/schedulePlan/add",
        get:apiBasePath + "/schedulePlan/get",
        save:apiBasePath + "/schedulePlan/save",
        delete:apiBasePath + "/schedulePlan/delete",
        addAppointment:apiBasePath + "/schedulePlan/addAppointment",
        getAppointment:apiBasePath + "/schedulePlan/getAppointment",
        deleteAppointment:apiBasePath + "/schedulePlan/deleteAppointment",
        cancelUpdate:apiBasePath + "/schedulePlan/cancelUpdate", //取消约会
    },
    //日程变化通知
    scheduleNoticeRouter:{
        listPage:apiBasePath + "/inform/listPage",
        getCount:apiBasePath + "/inform/getCount", //通知数
        confirm:apiBasePath + "/inform/confirm", //是否同意日程变更
        getOperatingConfirm:apiBasePath + "/inform/getOperatingConfirm", //是否同意日程变更
    },
    //测验管理
    examRouter:{
        listPage:apiBasePath+"/exam/listPage", //测验列表获取
        createExam:apiBasePath+"/exam/createExam",//创建测验
        startExam:apiBasePath+"/exam/startExam",//进入测验
        skipQuestion:apiBasePath+"/exam/skipQuestion",//下一题跳转
        submitExam:apiBasePath+"/exam/submitExam", //提交题目
        getExam:apiBasePath+"/exam/getExam", //答题后回看题目

    }
}

export default {
    install: function(vm){
        vm.prototype.$api = api ; // 管理api
    }
}
