<template>
    <div class="table_box test_mode_page">
        <!-- ==============================练习习题========================================-->
        <div  :close-on-click-modal="false">
            <div class="card-body" >
                <div class="test_mode_title" >题目预览{{questionIndex+1}}/{{questionList.length?questionList.length:0}}</div>
                <!--  题目内容   -->
                <QuestionDisplayBlock v-bind:question="question" ref="questionDisplay" v-bind:displayAnswer="true" class="preview_box"/>
                <div style="height: 20px;"></div>
                <el-row>
                    <el-col :span="3" class="prevTopic">
                        <!--                            v-bind:disabled="editIndex <= 0" 索引小于0禁用按钮-->
                        <el-button size="middle" @click="onPrevQuestion(-1)" v-bind:disabled="questionIndex <= 0">
                            上一题
                        </el-button>
                    </el-col>
                    <el-col :span="18">
                        <div style="text-align: right;">
<!--                            <el-button size="middle" plain type="danger" @click="submitExercisesMode" v-if="answerList.length!=questionList.length-1">提前交卷</el-button>-->
<!--                            <el-button size="middle" plain  @click="submitExercisesMode" class="hand" v-else>答完交卷</el-button>-->
                            <el-button size="middle" plain  @click="submitExercisesMode" class="hand" >交卷</el-button>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="nextTopic">
                            <!--                                v-bind:disabled="editIndex >= listTotal-1" 禁用按钮-->
                            <el-button size="middle" @click="onNextQuestion(1)"
                                       v-bind:disabled="questionIndex >= (questionList.length?questionList.length:0)-1">
                                下一题
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <div  class="test_mode_foot">
                    <ul class="testmode_ul" >
                        <li class="item" v-for="(item,index) in questionList"
                            v-bind:class="{active:questionIndex === index , danger:(! ( item.answer && item.answer.indexOf('input')>-1) ) }"
                            @click="clickIndexBtn(index,item)" :key="index">{{index+1}}</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import {questionApi} from '@/api/question';
    import QuestionDisplayBlock from "@/components/QuestionDisplayBlock/QuestionDisplayBlock";
    import {examApi} from '@/api/exam';
    import  toolBox from '@/components/toolBox/toolBox'
    import {parseQuestions} from '@/utils/parseQuestionAnswer';

    export default {
        components: {QuestionDisplayBlock,lgTable, lgBody,toolBox},
        extends: tablePageBase,
        name: "testMode",
        data(){

            return{
                questionIndex:0,
                question: {},
                questionList:[],
                answerList:[],
                // changeQuestionIndex:'',
                id:'',
                answer:'', //答案
                currentQuestion:'', //当前做到第几题
                currentQuestionIdex:'', //
                examId:'',  //测验id
                timePassed:'',  //测验时间,
                questionId:'',
                reviewList:[],
                qus:{},

            }
        },
        created() {
            this.id = this.$route.query.id;
            console.log('this.id',this.id);
        },
        mounted(){
            this.questionContent();
        },
        methods:{
            //下标索引列表
            clickIndexBtn:function(index,item){
                console.log("clickIndexBtn-index",index);
                // console.log("clickIndexBtn-item",item);
                this.changeQuestionIndex(index);
                this.currentQuestionIdex=index;
            },
            //题目列表
            questionContent(){
                let id=this.id;
                examApi.startExam({id}).then((result)=>{
                    console.log('startExam-result',result);
                    if (result.code == this.$success) {
                        this.questionList = result.data.displayQuestions||[];
                        parseQuestions(this.questionList); // 还原答案
                        this.questionIndex = result.data.currentQuestion-1;

                        // let questionList=this.question;
                        // console.log('this.question', this.question);
                        // console.log('questionList', questionList);
                        // 解决 qustion 和 displayQuestion 字段不一致问题
                        this.questionList.map(questionList=>{
                            if(questionList.displaySubQuestions){
                                questionList.subQuestions = questionList.displaySubQuestions;
                            }
                        })
                        console.log("ss",this.questionIndex,this.questionList );
                        // this.questionIndex = 0;
                        this.question = this.questionList[this.questionIndex];  
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //提交
            submitExercisesMode(){
                let answers = this.$refs.questionDisplay.getAnswer().answers;
                let params={
                    "answer": { answers:answers, id:this.question.uuid} ,
                    "currentQuestion": this.questionIndex,
                    "examId": this.id,
                    "timePassed": 40
                }
                examApi.submitExam(params).then((result)=>{
                    if (result.code==this.$success){
                        console.log('submitExam-result.data',result.data);
                        this.reviewList=result.data;
                        this.$router.push({  //核心语句
                            path:'/testmode/testmodeReview',   //跳转的路径
                            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                                id:result.data.exam.id,
                            }
                        })
                        this.$message({
                            type: 'success',
                            message: this.getLangServerMess(result.messageCode) || "提交成功",
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: this.getLangServerMess(result.messageCode) || "提交失败,请检查！",
                        });
                    }
                }).catch((err)=>{
                    console.log('examApi-submitExam err====>',err);
                })
            },
            //下一题跳转请求
            skipQuestion:function(){
                let answers = this.$refs.questionDisplay.getAnswer().answers;
                console.log('skipQuestion-this.question',this.question);
                console.log('skip',this.qus);
                console.log('skipQuestion-answer',answer);
                console.log('skipQuestion-answer1',JSON.stringify(answer));
                console.log('skipQuestion-currentQuestionIdex',this.currentQuestionIdex);
                // this.question.answer = answers;
                let answer={
                    answers:answers,
                    id:this.qus.uuid
                }
                let params={
                    "answer": answer,
                    "currentQuestion": this.question.questionSeq,
                    "examId": this.id,
                    "timePassed": 400,
                }
                examApi.skipQuestion(params).then((result)=>{
                    if(result.code==this.$success){
                       console.log('skipQuestion-result',result);

                       this.questionContent();
                    }
                }).catch((err)=>{
                    console.log('skipQuestion-err',err);
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

            //上一题
            onPrevQuestion(){
                this.qus = this.questionList[this.questionIndex];
                this.changeQuestionIndex(this.questionIndex -1);
                this.skipQuestion();
            },
            //下一题
            onNextQuestion(){
                this.qus = this.questionList[this.questionIndex];
                this.changeQuestionIndex(this.questionIndex +1);
                this.skipQuestion();
            }

        }
    }
</script>

<style lang="scss">
    .test_mode_page{
        .test_mode_title{
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin-bottom: 30px;
        }
        .hand{background-color: rgb(225,243,216);}
        .hand:hover{background: rgb(103,194,58);color: #fff;border-color: #2fb21a;}
        .prevTopic{
            button{background-color: rgb(225,243,216);}
            button:hover{background: rgb(103,194,58);color: #fff;border-color: #2fb21a;}
        }
        .nextTopic{
            text-align: left;margin-left: 5px;
            button{background-color: rgb(225,243,216);}
            button:hover{background: rgb(103,194,58);color: #fff;border-color: #2fb21a;}
        }

        .test_mode_foot {
            height: 70px;
            margin-top: 10px;

            .show_answercar {
                font-size: 16px;
                font-weight: 600;

                div:hover {
                    color: rgb(103, 194, 58)
                }
            ;
            }

            .show_answercar:hover {
            }

            .testmode_ul {
                display: flex;
                flex-direction: row;

                .item {
                    cursor: pointer;
                    width: 35px;
                    height: 35px;
                    text-align: center;
                    line-height: 40px
                }
                .item:hover {
                    background-color: rgb(103, 194, 58);
                    color: #fff;
                }
                .item.active{
                    background-color: #E1F3D8;
                }
                .item.danger {
                    border-bottom: 2px solid #ff6964;

                }

            }

        }
    }

</style>
