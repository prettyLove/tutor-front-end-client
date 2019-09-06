
// 界面语言配置
export var langCode = {
    success: "success",
    fail: "fail",
    loginFormName: "loginFormName",
    siteName: "siteName",
    userLogin: "userLogin",
    exit: "exit",
    tips: "tips",
    loginSuccess: "loginSuccess",
    loginFail: "loginFail",
    modifyPasswordSuccess: "modifyPasswordSuccess", // 修改密码成功
    rememberPassword: "rememberPassword", // 记住密码
    newUserRegistration: "newUserRegistration", // 新用户注册
    forgotPassword: "forgotPassword", // 找回密码
    login: "login", // 找回密码
    cancel: "cancel", // 取消
    enter: "enter", // 提交
    delete: "delete", // 删除
    successfulDeletion: "successfulDeletion", // 删除成功
    failedDeletion: "failedDeletion", // 删除失败
    edit: "edit", // 编辑
    update: "update", // 更新
    see: "see", // 查看
    detail: "detail", // 详情
    title: "title", // 标题
    createDate: "createDate", // 创建时间
    startDate: "startDate", // 开始时间
    operation: "operation", // 操作
    personalInformation: "personalInformation", // 个人信息
    serviceConnectionFailure: "serviceConnectionFailure", // 服务连接失败
    changePassword: "changePassword", // 修改密码
    joinLive: "joinLive", // 进入直播
    // 问题
    quetions: {
        loadQuestionError: "loadQuestionError",
    },
    status:'status',  //状态
    sure:'sure',  //确定
    loadFail:'loadFail',  //数据加载失败
    search:'search',  //搜索
    content:'content',  //内容
    notes:'notes',  //笔记
    movies:'movies',  //影片
    preview:'preview',  //预览
    remarks:'remarks',  //备注
    creator:'creator',  //创建者
    save:'save',  //保存
    newAdd:'newAdd',  //新增
    add:'add',  //添加
    audited:'audited',  //已审核
    notAudited:'notAudited',  //未审核
    type:'type',  //类型
}

export var langs = {
    zh_cn:"zh-cn",
    zh_hk:"zh-hk",
    cn_us:"en-us",
}

export var languageWebMap = {}

export function addLangItem(k, zhCn, zhHk, enUs) {
    languageWebMap[k] = {
        [langs.zh_cn]: zhCn,
        [langs.zh_hk]: zhHk,
        [langs.cn_us]: enUs,
    }
}
// 取语言内容
export var getLanguseWebMessage = function(k,lang){
    if(languageWebMap[k]){
        return languageWebMap[k][lang];
    }
    return null
}

// 添加内容
addLangItem(langCode.success,"操作成功!","操作成功!","Operation success!");
addLangItem(langCode.fail,"操作失败!","操作失败!","Operation failed!");
addLangItem(langCode.loginFormName,"顾学教育CMS管理系统","顾学教育CMS管理系统hk","GUXUE CMS");
addLangItem(langCode.siteName,"顾学科技","顧學科技","guxue technology");
addLangItem(langCode.loadQuestionError,"加载题目详情错误","加載題目詳情錯誤","load error");
addLangItem(langCode.modifyPasswordSuccess,"修改密码成功系统需要即出重新登陆","修改密码成功系统需要即出重新登陆","Successful password modification system requires immediate re-login");
addLangItem(langCode.userLogin,"用户登陆","用户登陆","Login");
addLangItem(langCode.exit,"退出","退出","Logout");
addLangItem(langCode.tips,"提示","提示","Tips");
addLangItem(langCode.loginSuccess,"登录成功","登錄成功","Login success");
addLangItem(langCode.loginFail,"登陆失败","登陸失敗","Login fail");
addLangItem(langCode.rememberPassword,"记住密码","記住密碼","Remember password");
addLangItem(langCode.newUserRegistration,"新用户注册","新用戶註冊","New user registration");
addLangItem(langCode.forgotPassword,"找回密码","找回密碼","Forgot Password");
addLangItem(langCode.login,"登陆","登陸","Login");
addLangItem(langCode.cancel,"取消","取消","Cancel");
addLangItem(langCode.enter,"提交","提交","Enter");
addLangItem(langCode.delete,"删除","删除","Delete");
addLangItem(langCode.successfulDeletion,"删除成功","删除成功","successfulDeletion");
addLangItem(langCode.failedDeletion,"删除失败","删除失败","failedDeletion");
addLangItem(langCode.edit,"编辑","编辑","Edit");
addLangItem(langCode.update,"更新","更新","Update");
addLangItem(langCode.see,"查看","查看","See");
addLangItem(langCode.detail,"详情","详情","detail");
addLangItem(langCode.title,"标题","标题","Title");
addLangItem(langCode.createDate,"创建时间","创建时间","createDate");
addLangItem(langCode.startDate,"开始时间","开始时间","Start");
addLangItem(langCode.operation,"操作","操作","Operation");
addLangItem(langCode.serviceConnectionFailure,"服务连接失败","服务连接失败","Service connection failure");
addLangItem(langCode.personalInformation,"个人信息","个人信息","Personal information");
addLangItem(langCode.changePassword,"修改密码","修改密码","Change Password");
addLangItem(langCode.joinLive,"进入直播","进入直播","Join Live");
addLangItem(langCode.status,"状态","状态","Status");
addLangItem(langCode.sure,"确定","确定","Sure");
addLangItem(langCode.loadFail,"数据加载失败啦！","数据加载失败啦！","Data loading failure");
addLangItem(langCode.search,"搜索","搜索","Search");
addLangItem(langCode.content,"内容","内容","Content");
addLangItem(langCode.notes,"笔记","笔记","Notes");
addLangItem(langCode.movies,"影片","影片","Movies");
addLangItem(langCode.preview,"预览","预览","Preview");
addLangItem(langCode.remarks,"备注","备注","remarks");
addLangItem(langCode.creator,"创建者","创建者","creator");
addLangItem(langCode.save,"保存","保存","save");
addLangItem(langCode.newAdd,"新增","新增","newAdd");
addLangItem(langCode.add,"添加","添加","Add");
addLangItem(langCode.notAudited,"未审核","未审核","NotAudited");
addLangItem(langCode.audited,"已审核","已审核","audited");
addLangItem(langCode.type,"类型","类型","Type");


export default {
    install: function(vm){
        vm.prototype.$langCode = langCode ;
    }
}
