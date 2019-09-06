<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths" @pageChange="setPage" class="page_history_list">
        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="item of pageInfo.list" :key="item.id">
                <td>{{item.title}}</td>
                <td>{{item.startDate}}</td>
                <td>{{item.endDate}}</td>
                <td style="width: 400px">
                    <template v-if="$store.getters.getUserInfo.role==roles.STUDENT">
                        <el-button size="small" @click="answerExercises(item)" v-if="item.isAnswer<1">答题</el-button>
                        <div class="answertf" v-else>
                            总共<span class="fontSize"> {{item.rightNum+item.errorNum}} </span>题,
                            答对<span class="fontSize"> {{item.rightNum}} </span>题,
                            答错<span class="fontErr"> {{item.errorNum}} </span>题
                            <el-button size="small" @click="reviewExercises(item)" style="margin-left: 10px">查看</el-button>
                        </div>
                    </template>
                </td>
                <td class="control_btns">
                    <!-- 编辑按钮 -->
                    <!--<el-button size="small" @click="edit(item)" plain  v-if="item.status != 1" disabled>编辑</el-button>-->
                    <!-- 删除按钮 -->
                    <!--<el-button size="small" @click="del(item.id)" plain type="danger"  v-if="item.status != 1" disabled>删除</el-button>-->

                    <el-button class="btn_score" size="small" @click="starScore(item)" plain v-if="item.assessNum==0 ">
                        评分
                    </el-button>
                    <el-button class="btn_see" size="small" @click="checkScore(item)" plain v-else>查看评分</el-button>
                    <el-button class="btn_see" size="small" @click="checkDashboard(item)" plain>查看画板</el-button>
                </td>
            </tr>
            <!-- ==============================答题弹出框========================================-->
            <el-dialog :title="'题目预览  '+(questionIndex+1)+'/'+ (questionList.length?questionList.length:0)"
                       :visible.sync="subjectDialogVisible" :close-on-click-modal="false">
                <div class="card-body">
                    <!--  题目内容   -->
                    <QuestionDisplayBlock v-bind:question="question" ref="questionDisplay" v-bind:displayAnswer="true" class="preview_box"/>
                    <div style="height: 20px;"></div>
                    <el-row>
                        <el-col :span="3">
                            <!--                            v-bind:disabled="editIndex <= 0" 索引小于0禁用按钮-->
                            <el-button size="middle" @click="onPrevQuestion(-1)" v-bind:disabled="questionIndex <= 0">
                                上一题
                            </el-button>
                        </el-col>
                        <el-col :span="18">
                            <div style="text-align: center;">
                                <el-button size="middle" plain type="primary" @click="submitExercises">提交</el-button>
                                <!--<el-button v-bind:disabled="editIndex <= listTotal-1" size="middle"  @click="$emit('close')">返回</el-button>-->
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div style="text-align: right;">
                                <!--                                v-bind:disabled="editIndex >= listTotal-1" 禁用按钮-->
                                <el-button size="middle" @click="onNextQuestion(1)"
                                           v-bind:disabled="questionIndex >= (questionList.length?questionList.length:0)-1">
                                    下一题
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <div style="height: 70px;"></div>
                </div>
            </el-dialog>
            <!--========================            评分弹出框=============================-->
            <el-dialog title="评分" :visible.sync="scoreDialogVisible" :close-on-click-modal="false" class="score">
                <el-form class="clearfix" :model="scoreForm">
                    <el-row :gutter="4">
                        <!--具体要添加的内容-->
                        <el-col :span="24" v-for="(item,index) in scoreList" :key="index">
                            <el-form-item :label="item.name" :label-width="formLabelWidth">
                                <el-rate v-model="item.level" :colors="colors"></el-rate>
                                <el-input v-model="item.content" placeholder="请输入评语"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                    <el-button @click="scoreDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="confirmScore()">提交</el-button>
                </div>
            </el-dialog>
            <!-- ===================================  查看评分弹出框===============================-->
            <el-dialog title="评分详情" :visible.sync="seeScoreDialogVisible" :close-on-click-modal="false" class="score">
                <el-form class="clearfix" :model="seeScoreForm">
                    <el-row :gutter="4">
<!--                        具体要添加的内容-->
                        <el-col :span="6" style="text-align: left" v-if="$store.getters.getUserInfo.role==roles.TUTOR">老师对学生的评价：</el-col>
                        <el-col :span="6" style="text-align: left" v-if="$store.getters.getUserInfo.role==roles.STUDENT">学生对老师的评价：</el-col>
                        <el-col :span="24" v-for="(item,index) in listByMe" :key="index">
                            <el-form-item :label="item.name" :label-width="formLabelWidth">
                                <el-rate v-model="item.level" disabled show-score text-color="#ff9900"
                                         :score-template="item.content||''">
                                </el-rate>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="4">
                        <el-col :span="6" style="text-align: left" v-if="$store.getters.getUserInfo.role==roles.TUTOR">学生对老师的评价：</el-col>
                        <el-col :span="6" style="text-align: left" v-if="$store.getters.getUserInfo.role==roles.STUDENT">老师对学生的评价：</el-col>
                        <!--具体要添加的内容-->
                        <el-col :span="24" v-for="(item,index) in listByOther" :key="index">
                            <el-form-item :label="item.name" :label-width="formLabelWidth">
                                <el-rate v-model="item.level" disabled show-score text-color="#ff9900"
                                         :score-template="item.content||''">
                                </el-rate>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </template>
    </lg-body>
</template>

<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import {roomApi} from '@/api/room';
    import {questionApi} from '@/api/question';
    import {roles} from "@/utils/const";
    import QuestionDisplayBlock from "../../components/QuestionDisplayBlock/QuestionDisplayBlock";
    import {getToken} from "@/utils/auth";
    import qs from 'qs';

    export default {
        components: {QuestionDisplayBlock, lgTable, lgBody},
        extends: tablePageBase,
        name: "historyList",
        data() {
            return {
                roles,
                QuestionDisplayBlock,
                scoreForm: {},
                seeScoreForm: {},
                listPage: [],
                topLessonList: {},
                scoreDialogVisible: false,
                seeScoreDialogVisible: false,
                subjectDialogVisible: false,
                formLabelWidth: "120",
                editIndex: 0,
                level: null,
                isScore: true,
                scoreList: '',
                checkScoreList: '',
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                questionList: [],
                question: {},
                questionIndex: 0,
                answerList: [],
                roomInfo: '',
                listByOther: [],
                listByMe: [],
                isScoreList:[],


            }
        },
        mounted() {
            let vm = this;
            vm.ths = ['课程', '课程开始时间', '课程结束时间', '课后习题', {name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.roomRouter.listPage;
            // 加载列表
            vm.getPageList();

        },
        methods: {
            //开始评分
            starScore: function (item) {
                let roomid = item.id;
                this.scoreDialogVisible = true;
                console.log('item', item);
                roomApi.getAssessList({roomId: item.id}).then((result) => {
                    if (result.code == this.$success) {
                        console.log('result', result.data);
                        this.scoreList = result.data;
                        console.log('this.scoreList', this.scoreList);
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //查看评分
            checkScore: function (item) {
                this.seeScoreDialogVisible = true;
                roomApi.getAssessRoomByRoomId({roomId: item.id}).then((result) => {
                    if (result.code == this.$success) {
                        this.listByMe = result.data.listByMe || [];
                        this.listByOther = result.data.listByOther || [];
                        this.isScoreList=JSON.stringify(this.listByMe);
                        console.log('isScoreList',this.isScoreList);
                        console.log('this.checkScoreList', result);
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //查看画板
            checkDashboard: function (item) {
                console.log("watch dashboard", item);
                let dashboardUrl = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_HOST");
                let dashboardView = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_VIEW");
                let webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
                let imApi = this.$store.getters.getSystemConfigMapByKey("IMAPI_HOST");
                let charServer = this.$store.getters.getSystemConfigMapByKey("CHART_SERVER_HOST");
                var ishttps = 'https:' == document.location.protocol ? true : false;
                // 处理 http 和 https
                // if(ishttps) {
                //     webApi = webApi.replace("http:", "https:");
                //     webApi = webApi.replace("http:", "https:");
                // }
                let params = {
                    token: getToken(),
                    userId: this.$store.getters.getUserInfo.id,
                    roomId: item.id,
                    dashboardId: item.dashboardId,
                    webApi: webApi,
                    imApi: imApi,
                    charServer: charServer,
                    dashboardName: this.dashboardName,
                };
                // window.open(dashboardUrl + "?token=" + getToken() + "&userId=" + this.$store.getters.getUserInfo.id + "&roomId=" + item.id + "&dashboardId=" + item.dashboardId + '_blank');
                // window.open(dashboardUrl + "?" + qs.stringify(params), '_blank');
                window.open(dashboardView + "?" + qs.stringify(params), '_blank');
                this.$store.commit("cancelJoinLive")
            },
            //评分提交
            confirmScore: function () {
                console.log('scoreList', this.scoreList);
                let scoreList = this.scoreList;
                for (let i = 0; i < scoreList.length; i++) {
                    let level = scoreList[i].level;
                    console.log('level', level);
                    if (level <= 0) {
                        alert("请评分");
                        return;
                    } else {
                        roomApi.assessRoom(this.scoreList).then((result) => {
                            if (result.code == this.$success) {
                                console.log('result', result);
                                this.$message({
                                    type: 'success',
                                    // message: "提交成功",
                                    message: this.getLangServerMess(result.messageCode) || "提交成功"
                                });
                                this.scoreDialogVisible = false;
                                this.isScore = false;
                                this.getPageList();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: this.getLangServerMess(result.messageCode) || "提交失败",
                                });
                            }
                        }).catch((err) => {
                            console.log('err', err);
                        })
                    }
                }
            },
            reviewExercises:function(item){
                console.log('item',item);
                this.$router.push({  //核心语句
                    path:'/history/historyExercisesReview',   //跳转的路径
                    query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                        id:item.id,
                    }
                })
            },
            //答题
            answerExercises: function (item) {
                this.questionIndex = 0;
                this.roomInfo = item;
                this.subjectDialogVisible = true;
                console.log('exer',item);
                questionApi.getAssessQuestion({roomId:item.id}).then((result) => {
                    if (result.code == this.$success) {
                        console.log('result', result);
                        this.questionList = result.data || [];
                        // 解决 qustion 和 displayQuestion 字段不一致问题
                        this.questionList.map(item => {
                            if (item.displaySubQuestions) {
                                item.subQuestions = item.displaySubQuestions;
                                item.subQuestions.map(sub=>{
                                    if(sub.type=="FILL_IN_THE_BLANKS")
                                        sub.answer.input = [];
                                })
                            }
                        })
                        this.questionIndex = 0;
                        this.question = this.questionList[this.questionIndex];
                        console.log('this.question', this.question);
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //问题下标切换
            changeQuestionIndex:function(num){
                let answer = this.$refs.questionDisplay.getAnswer();
                this.answerList[this.questionIndex] = answer;

                this.questionIndex = num;
                let curanswer = this.answerList[this.questionIndex];
                if (curanswer) {
                    this.$refs.questionDisplay.setSubQuestionSelected(curanswer.subQuestionSelected);
                } else {
                    this.$refs.questionDisplay.setSubQuestionSelected("");
                }
                this.question = this.questionList[this.questionIndex];
            },
            // 上一题目
            onPrevQuestion: function () {
                this.changeQuestionIndex(this.questionIndex -1);
                // 保存答案
                // let answer = this.$refs.questionDisplay.getAnswer();
                // this.answerList[this.questionIndex] = answer;
                // console.log("answer", answer);
                //
                // this.questionIndex -= 1;
                // let curanswer = this.answerList[this.questionIndex];
                // if (curanswer) {
                //     this.$refs.questionDisplay.setSubQuestionSelected(curanswer.subQuestionSelected);
                // } else {
                //     this.$refs.questionDisplay.setSubQuestionSelected("");
                // }
                // this.question = this.questionList[this.questionIndex];

            },
            // 下一题目
            onNextQuestion: function () {
                this.changeQuestionIndex(this.questionIndex +1);
                // 保存答案
                // let answer = this.$refs.questionDisplay.getAnswer();
                // this.answerList[this.questionIndex] = answer;
                // console.log("answer", answer);
                //
                // this.questionIndex += 1;
                // let curanswer = this.answerList[this.questionIndex];
                // if (curanswer) {
                //     this.$refs.questionDisplay.setSubQuestionSelected(curanswer.subQuestionSelected);
                // } else {
                //     this.$refs.questionDisplay.setSubQuestionSelected("");
                // }
                // this.question = this.questionList[this.questionIndex];
            },
            //提交题目
            submitExercises: function () {
                let answer = this.$refs.questionDisplay.getAnswer();
                console.log('answer', answer);
                this.answerList[this.questionIndex] = answer;
                // let getAnswer=this.$refs.questionDisplay.getAnswer();
                // console.log('answerList',this.answerList);
                // let resetAnswer=this.$refs.questionDisplay.resetAnswer();
                // console.log('resetAnswer',resetAnswer);
                let roomId = this.roomInfo.id;
                let answerList = this.answerList;
                // todo 判断有没有做完题目
                if (answerList.length != this.questionList.length) {
                    this.$alert("请答完再提交！");
                    return false;
                } else {
                    // submit
                    console.log('answerList==================', answerList);
                    console.log('roomId==================', roomId);
                    let params = {
                        roomId: roomId,
                        answerList:this.answerList,
                    }

                    /*    this.answerList.map(item=>{
                        return {
                            roomId: roomId,
                            answer: JSON.stringify(item.answers),
                            questionId: item.id,
                        }
                    })*/

                    questionApi.answerQuestion(params).then((result) => {
                        if (result.code == this.$success) {
                            this.$message({
                                type: 'success',
                                message: this.getLangServerMess(result.messageCode) || "提交成功",
                            });
                            this.subjectDialogVisible = false;
                            this.getPageList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: this.getLangServerMess(result.messageCode) || "提交失败,请检查",
                            });
                        }
                    }).catch((err) => {
                        console.log('err', err);
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .page_history_list {
        background-color: #fff;
        height: 550px;

        .cont {
            padding: 10px;
        }
        .answertf{
            color: #4285f4;
            .fontSize{
                font-size: 15px;
                font-weight: bold;
            }
            .fontErr{
                font-size: 15px;
                font-weight: bold;
                color: #f00;
            }
        }

        .control_btns {
            text-align: right;
            width: 210px;

            .btn_score {
                background-color: rgb(250, 236, 216)
            }

            .btn_score:hover {
                background-color: rgb(247, 201, 131);
                color: #fff;
                border-color: #F7C983
            }

            .btn_see {
                background-color: rgb(225, 243, 216)
            }

            .btn_see:hover {
                background-color: #67C23A;
                border-color: #67C23A;
                color: #fff
            }
        }

        .score {
            text-align: center;

            .clearfix {
                text-align: center;

                .el-rate {
                    margin-top: 10px;
                }
            }
        }

    }


</style>
