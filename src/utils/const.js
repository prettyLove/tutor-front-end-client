/**
 * 常用常量
 *
 */

let success = 0;
let responseSuccess = 200;
let fail = -1;

export const $success = success
export const $fail = fail

let zh_cn = "zh-cn"
let zh_hk = "zh-hk"
let en_us = "en-us"

export const LANG_LIST = [zh_cn,zh_hk,en_us]

//语言类型
export const langSelectList = [
    {name:"中文-简体",value:zh_cn,},
    {name:"中文-繁体",value:zh_hk,},
    {name:"英文",value:en_us,},
]

//星期
export const weekType=[
    {name:"星期一",value:"Monday"},
    {name:"星期二",value:"Tuesday"},
    {name:"星期三",value:"Wednesday"},
    {name:"星期四",value:"Thursday"},
    {name:"星期五",value:"Friday"},
    {name:"星期六",value:"Saturday"},
    {name:"星期天",value:"Sunday"},
    {name:"工作日",value:"workday"},
    {name:"双休日",value:"weekday"},
    {name:"每天",value:"everyday"},
    {name:"每周",value:"everyweek"},
    {name:"每月",value:"everymonth"},
]
//证件类型
export const documentType=[
    {name:"中国身份证",value:"zh_id",},
    {name:"香港身份证",value:"kg_id",},
    {name:"护照",value:"passport",},
]
//国籍类型
export const nationalityType=[
    {name:"中国",value:"CN",},
    {name:"美国",value:"US",},
    {name:"英国",value:"GB",},
    {name:"德国",value:"DE",}
]

// 问题类型
export const questionTypeList = [
    {name: "是非题", value: "TF"},
    {name: "选择题", value: "MC"},
    {name: "填充题", value: "FILL_IN_THE_BLANKS"},
    {name: "直接答题", value: "DIRECT_QUESTION"},
]


const ROLE_TUTOR = "TUTOR"
const ROLE_STUDENT = "STUDENT"
const ROLE_PARENT = "PARENT"
const ROLE_ADMIN = "ADMIN"

export const roles  = {
    TUTOR :ROLE_TUTOR,
    STUDENT :ROLE_STUDENT,
    PARENT :ROLE_PARENT,
    ADMIN :ROLE_ADMIN,
}

// 消息发送对象
export const memberMessageSenderList = [
    {name: "会员", value: "USER"},
    {name: "学生", value: "STUDENT"},
    {name: "老师", value: "TUTOR"},
    {name: "家长", value: "PARENT"},
    {name: "所有人", value: "ALL"},
]

//身份信息列表
export const memberRoleList = [
    {name: "学生", value: "STUDENT"},
    {name: "老师", value: "TUTOR"},
    // {name: "家长", value: "PARENT"},
]

//学历信息列表
export const educationalList = [
    {name: "高中", value: "高中"},
    {name: "大专", value: "大专"},
    {name: "学士", value: "学士"},
    {name: "硕士", value: "硕士"},
    {name: "博士", value: "博士"},
]

//成绩信息列表
export const gradeList = [
    {name: "A", value: "A"},
    {name: "B", value: "B"},
    {name: "C", value: "C"},
    {name: "D", value: "D"},
    {name: "E", value: "E"},
]
//学科信息列表
export const subjectList = [
    {name: "数学", value: "Math"},
    {name: "英语", value: "English"},
    {name: "物理", value: "Physics"},
    {name: "语文", value: "Chinese"},
    {name: "化学", value: "Chemistry"},
    {name: "历史", value: "History"},
]
//补习时长
export const lengthOfTutoring=[
    {name:"1个小时",value:"oneHour"},
    {name:"1.5个小时",value:"onePointFive"},
    {name:"2个小时",value:"twoHour"},
    {name:"2.5个小时",value:"twoPointFive"},
    {name:"3个小时",value:"threeHour"},
    {name:"3.5个小时",value:"threePointFive"},
    {name:"4个小时",value:"fourHour"},
    {name:"4.5个小时",value:"fourPointFive"},
    {name:"5个小时",value:"fiveHour"},
    {name:"5.5个小时",value:"fivePointFive"},
    {name:"6个小时",value:"sixHour"},
    {name:"6.5个小时",value:"sixPointSix"},
    {name:"7个小时",value:"sevenHour"},
    {name:"7.5个小时",value:"sevenPoinFive"},
    {name:"8个小时",value:"eightHour"},
    {name:"8.5个小时",value:"eightPointFive"},
    {name:"9个小时",value:"nineHour"},
    {name:"9.5个小时",value:"ninePointFive"},
]

//笔记,影片问题反馈类型
export const teachingResultType=[
    {name:"电影",value:"MOVIE"},
    {name:"笔记",value:"NOTES"},
    {name:"其它",value:"OTHERS"},
]

//
export const WS_MSG_TYPE = {
    CREATE_LIVE_ROOM:"CREATE_LIVE_ROOM", // 创建直播间
    QUERY_LIVE_ROOM:"QUERY_LIVE_ROOM", // 查阅当前已存的直播间
    JOIN_LIVE_ROOM:"JOIN_LIVE_ROOM", // 查阅当前已存的直播间
    QUERY_MY_ACTIVE_LIVE_ROOM:"QUERY_MY_ACTIVE_LIVE_ROOM", // 查阅当前已存的直播间
}

export const editMathFag= {
    beginMath:"\\\\begin\{math\}",
    endMath:"\\\\end\{math\}",
}

export const TUTOR_TYPE_LIST = [
    {name: "身份证-正面", value: "ID_CARD_PROS"},
    {name: "身份证-反面", value: "ID_CARD_CONS"},
    {name: "导师资格证", value: "TUTOR_QUALIFICATION_CERTIFICATE"},
    {name: "学历证书", value: "CERTIFICATE_OF_UEDUCATION"},
    {name: "其他证书", value: "OTHER_CERTIFICATE"},
]

export default {
    install: function(vm){
        vm.prototype.$success = success ;
        vm.prototype.$responseSuccess = responseSuccess ;
        vm.prototype.$fail = fail ;
    }
}



