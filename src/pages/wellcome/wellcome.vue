<template>
    <div class="table_box page_wellcome">

        <!-- 用户反馈弹窗 -->
        <el-dialog :title="getLang(pageLang.feedback)" :visible.sync="userFeedbackVisible"  :close-on-click-modal="false" style="text-align: center" >
            <el-form class="clearfix" :model="feedbackForm">
                <el-row :gutter="10">
                    <el-col :span="18" >
                        <el-form-item label="反馈标题" :label-width="formLabelWidth" >
                            <el-input  v-model="feedbackForm.title" placeholder="请输入反馈标题"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="18">
                        <el-form-item label="问题类型" :label-width="formLabelWidth">
                            <el-select v-model="feedbackForm.type" placeholder="请选择问题类型" style="width: 100%;">
                                <el-option
                                    v-for="item in feedTypeList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12" >
                        <el-form-item label="内容" :label-width="formLabelWidth" >
                            <el-input type="textarea" :rows='10' v-model="feedbackForm.message" placeholder="请输入要反馈的内容" style="width: 200%"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12" >
                        <el-form-item label="联系方式" :label-width="formLabelWidth" >
                            <el-input  v-model="feedbackForm.phone" placeholder="请输入联系方式" style="width: 200%"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                <el-button @click="userFeedbackVisible=false">取消</el-button>
                <el-button type="primary" @click="userFeedback()">反馈</el-button>
            </div>
        </el-dialog>

        <el-dialog title="详细信息" :visible.sync="userFormVisible" width="40%" :close-on-click-modal="false">
           <div>
               <pair-user :userId="form.id" :stateNumUser="stateNumUser" />

           </div>
            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                <el-button @click="userFormVisible=false">关闭</el-button>

            </div>
        </el-dialog>

        <div>
            <div style="font-size: 18px;">
                <span class="cont">
                    <!--我是导师-->
                    <span v-if="$store.getters.getUserInfo.role==roles.TUTOR">{{getLang(pageLang.roleTutor)}}</span>
                    <!--我是学生-->
                    <span v-if="$store.getters.getUserInfo.role==roles.STUDENT">{{getLang(pageLang.roleStudent)}}</span>
                </span>
                <i class="el-icon-info"></i>
                <i class="el-icon-location"></i>
                <!--用户反馈-->
                <el-button size="small" round @click="showDialog" style="margin-left: 10px">{{getLang(pageLang.feedback)}}</el-button>
                <el-badge :value="value" class="item">
                    <!--日程通知-->
                    <el-button size="small" round @click="jumbProgrammeMessage">{{getLang(pageLang.programmeNotice)}}</el-button>
                </el-badge>
            </div>

            <div style="height: 20px;"></div>
        </div>

        <div>
            <el-row>
                <el-col>
                    <el-container >

                        <el-main style="padding: 0 20px 0 0;">
                            <!-- wellcom页面嵌入日程组件-->
                            <programme />
                        </el-main>

                        <el-aside width="280px" class="addPadding">
                            <system-notice/>

                            <lg-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <div class="cont" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
                                        <!--我的学生-->
                                        <div>{{getLang(pageLang.myStudent)}}</div>
                                    </div>
                                    <div class="cont" v-if="$store.getters.getUserInfo.role==roles.STUDENT">
                                        <!--我的导师-->
                                        <div>{{getLang(pageLang.myTutor)}}</div>
                                    </div>
                                </div>
                                <div>
                                    <user-of-pair @userDetails="onUserDetails"/>
                                </div>
                            </lg-card>

                            <div style="height: 20px"></div>

                            <lg-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <!--课程历史-->
                                    {{getLang(pageLang.courseHistory)}}
                                    <span style="float: right; margin-bottom: 5px">
                                <!--   详情-->
                                <el-button style="padding: 6px 10px"><router-link to="/history/historyList">{{getLang(langCode.detail)}}</router-link></el-button>
                            </span>
                                </div>
                                <div class="lesson_list">
                                    <table>
                                        <tr>
                                            <!--<th>課程名称</th>-->
                                            <th>{{getLang(langCode.courseName)}}</th>
                                            <!--<th>开始时间</th>-->
                                            <th>{{getLang(langCode.startDate)}}</th>
                                            <!--<th>结束时间</th>-->
                                        </tr>
                                        <tr v-for="(item,index) in topLessonList" :key="index" class="text item">
                                            <td>{{item.title}}</td>
                                            <td>{{item.startDate?item.startDate.substr(5,11):""}}</td>
                                            <!--<td>{{item.endDate}}</td>-->
                                        </tr>
                                    </table>
                                </div>
                            </lg-card>
                        </el-aside>
                    </el-container>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-row :gutter="10">
                <el-row :gutter="10">
                    <el-col :span="8">

                    </el-col>

                    <el-col :span="16">

                    </el-col>

                </el-row>
            </el-row>
        </div>

        <div class="clearfix"></div>
    </div>
</template>


<script>

    import systemNotice from './components/systemNotice'
    import userOfPair from './components/userOfPair'
    import viewBase from '../common/viewBase'
    import {roles} from '@/utils/const'
    import lgCard from '../../components/lgCard'
    import {roomApi} from '@/api/room';
    import {feedbackApi} from '@/api/feedback';
    import notesSearch from  "./components/notesSearch"
    import pairUser from  "../demand/components/pairUser"
    import {scheduleNoticeApi} from "@/api/scheduleNotice";

    import programme from './programme'
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "welcome";
    // 多语言显示
    export const pageLang= {
        feedback:lang_prefix + "feedback",
        title:lang_prefix + "title",
        roleTutor:lang_prefix + "roleTutor",
        roleStudent:lang_prefix + "roleStudent",
        programmeNotice:lang_prefix + "programmeNotice",
        myStudent:lang_prefix + "myStudent",
        myTutor:lang_prefix + "myTutor",
        systemNotice:lang_prefix + "systemNotice",
        courseHistory:lang_prefix + "courseHistory",
        courseName:lang_prefix + "courseName",
    }
    addLangItem(pageLang.feedback,'用户反馈','用戶反饋','feedback');
    addLangItem(pageLang.title,'用户反馈','用戶反饋','feedback');
    addLangItem(pageLang.roleTutor,'我是导师','我是導師','I am a tutor');
    addLangItem(pageLang.roleStudent,'我是学生','我是学生','I am a student');
    addLangItem(pageLang.programmeNotice,'日程通知','日程通知','Calendar Notice');
    addLangItem(pageLang.myStudent,'我的学生','我的学生','My student');
    addLangItem(pageLang.myTutor,'我的导师','我的导师','My tutor');
    addLangItem(pageLang.systemNotice,'系统公告','系统公告','System Notice');
    addLangItem(pageLang.courseHistory,'课程历史','课程历史','Course History');
    addLangItem(pageLang.courseName,'课程名称','課程名称','Course Name');


    export default {
        extends: viewBase,
        name: "wellcome",
        components: {systemNotice, userOfPair, lgCard, notesSearch,programme,pairUser},
        data() {
            return {
                pageLang,
                roles,
                topLessonList: [],
                formLabelWidth:'120px',
                userFeedbackVisible: false,
                form:{},
                // title:'',
                // message: '',
                // contact_info: '',
                feedTypeList:[],
                // questionList:[],
                feedbackForm:{},
                userFormVisible:false,
                stateNumUser:0,
                stateNum:0,
                value:'',

            }
        },
        created() {
            this.getTopLesson();
        },
        mounted() {
            // let vm = this;
            this.feedTypeList = this.$store.getters.getSystemConfigMapByKey("FEEDBACK_TYPE_LIST").split(',');
            console.log("this.feedTypeList ",this.feedTypeList );
            this.loadNotice();

        },
        methods: {
            //加载日程通知数
            loadNotice:function(){
                scheduleNoticeApi.getCount().then((result)=>{
                    if(result.code==this.$success){
                       console.log('getCount==result',result);
                       this.value=result.data;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            //user详细信息组件点击
            onUserDetails:function(item){
                this.userFormVisible = true;
                // console.log('onUser-item',item);
                // this.editBefore(item);
                // item 为空的object 则是添加
                this.form.id = item.id;
                this.stateNumUser += 1;
                // this.showUserDialog();
            },
            showDialog:function(){
                this.feedbackForm = {};
                this.userFeedbackVisible=true;
            },
            showUserDialog: function () {
                this.stateNumUser += 1;
                this.stateNum += 1;
                this.userFormVisible = true;
            },

            userFeedback:function(){
                // let params = {
                //     title:this.title,
                //     message:this.message,
                //     contact_info:this.contact_info,
                //     questionList:this.questionList,
                // }
                feedbackApi.add(this.feedbackForm).then(result => {
                    if (result.code == this.$success) {
                        console.log('result',result);
                        this.$message("操作成功");
                        this.userFeedbackVisible = false;
                        return;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '操作失败'
                        });
                    }

                }).catch((err)=>{console.log(err)})
            },
            getTopLesson: function () {
                roomApi.getTopList({}).then((result) => {
                    if (result.code == this.$success) {
                        this.topLessonList = result.data;
                        console.log("result==================", this.topLessonList);
                    }
                }).catch((err) => {
                    // console.log('err',err)
                })
            },
            //日程消息通知页面跳转
            jumbProgrammeMessage:function () {
                this.$router.push({  //核心语句
                    path:'/wellcome/programmeMessage',   //跳转的路径
                    query:{//路由传参时push和query搭配使用 ，作用时传递参数
                       /* value:this.value,*/
                    }
                })
            }


        }
    }
</script>

<style lang="scss">



    .page_wellcome {
        min-height: 350px;
        padding-top: 20px;


        .lesson_list {
            table {
                width: 100%;

                td, th {
                    border-bottom: 1px solid #e3e5e8;
                    line-height: 18px;
                    padding: 6px 8px;
                    text-align: left;
                }

                tr:last-child td {
                    border: none;
                }
            }
        }
    }
</style>
