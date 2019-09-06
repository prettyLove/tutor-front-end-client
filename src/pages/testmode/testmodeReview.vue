<template>
    <div class="table_box test_mode_page">
        <!-- ==============================练习习题========================================-->
        <div  :close-on-click-modal="false">
<!--            <div class="card-body" >-->
<!--                <div class="test_mode_title" >题目回看{{questionIndex+1}}/{{questionList.length?questionList.length:0}}</div>-->
<!--                &lt;!&ndash;  题目内容   &ndash;&gt;-->
<!--                <QuestionDisplayBlock :disabled="true" v-bind:question="question" v-if="question"-->
<!--                                      ref="questionDisplay" v-bind:displayAnswer="true" class="preview_box"/>-->
<!--                <div style="height: 20px;"></div>-->
<!--                <el-row>-->
<!--                    <el-col :span="2" class="prevTopic">-->
<!--                        &lt;!&ndash;                          v-bind:disabled="editIndex <= 0" 索引小于0禁用按钮&ndash;&gt;-->
<!--                        <el-button size="middle" @click="onPrevQuestion(-1)" v-bind:disabled="questionIndex <= 0">-->
<!--                            上一题-->
<!--                        </el-button>-->
<!--                    </el-col>-->
<!--                    <el-col :span="3">-->
<!--                        <div class="nextTopic">-->
<!--                            &lt;!&ndash;                     v-bind:disabled="editIndex >= listTotal-1" 禁用按钮&ndash;&gt;-->
<!--                            <el-button size="middle" @click="onNextQuestion(1)"-->
<!--                                       v-bind:disabled="questionIndex >= (questionList.length?questionList.length:0)-1">-->
<!--                                下一题-->
<!--                            </el-button>-->
<!--                        </div>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--                <div  class="test_mode_foot">-->
<!--                    <ul class="testmode_ul" >-->
<!--                        <li class="item" v-for="(item,index) in questionList.length"-->
<!--                            :class="questionIndex === index ? 'active' : ''"-->
<!--                            @click="clickIndexBtn(index)" :key="index">{{item}}</li>-->
<!--                    </ul>-->
<!--                </div>-->
<!--            </div>-->
            <gx-test-question-review  v-if="isShow" :questionList="questionList" ></gx-test-question-review>
        </div>
    </div>
</template>

<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    // import {questionApi} from '@/api/question';
    import QuestionDisplayBlock from "@/components/QuestionDisplayBlock/QuestionDisplayBlock";
    import {examApi} from '@/api/exam';
    import {parseQuestions} from '@/utils/parseQuestionAnswer';
    import gxTestQuestionReview from '@/components/gxTestQuestionReview'

    export default {
        components: {QuestionDisplayBlock,lgTable, lgBody,gxTestQuestionReview},
        extends: tablePageBase,
        name: "testmodeReview",
        data(){
            return{
                questionIndex:0,
                question: {},
                questionList:[],
                answerList:[],
                answer:'', //答案
                currentQuestion:'', //当前做到第几题
                examId:'',  //测验id
                timePassed:'',  //测验时间,
                questionId:'',
                reviewList:[],
                reviewExam:{}, //答题后返回的测验exam
                id:"",
                isShow:false
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.questionContent();
        },
        methods:{
            //下标索引列表
            // clickIndexBtn:function(index){
            //     console.log("clickIndexBtn",index);
            //     this.changeQuestionIndex(index);
            // },
            //题目列表
            questionContent(){
                let id=this.id;
                examApi.getExam({id}).then((result)=>{
                    if (result.code == this.$success) {
                        console.log('startExam-result',result);
                        this.reviewExam=result.data.exam;
                        this.questionList = result.data.list||[];
                        parseQuestions(this.questionList); // 还原答案
                        this.questionIndex = 0;
                        // 解决 qustion 和 displayQuestion 字段不一致问题
                        this.questionList.map(questionList=>{
                            if(questionList.displaySubQuestions){
                                questionList.subQuestions = questionList.displaySubQuestions;
                            }
                        })
                        this.question = this.questionList[this.questionIndex];
                        console.log("ss",this.questionIndex,this.questionList,this.question );
                        console.log("ss   subQuestions",this.question.subQuestions);
                        this.isShow=true;
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
                  },
            //下一题跳转请求
            // skipQuestion:function(){
            //     let answers = this.$refs.questionDisplay.getAnswer().answers;
            //     console.log('skipQuestion-answer',answers);
            //     console.log('skipQuestion-answer1',JSON.stringify(answers));
            //     let answer={
            //         answers:answers,
            //         id:this.question.uuid
            //     }
            //     let params={
            //         "answer": answer,
            //         "currentQuestion": this.questionIndex,
            //         "examId": this.id,
            //         // "questionId": this.question.uuid,
            //         "timePassed": 400,
            //     }
                // examApi.skipQuestion(params).then((result)=>{
                //     if(result.code==this.$success){
                //        console.log('skipQuestion-result',result);
                //     }
                // }).catch((err)=>{
                //     console.log('skipQuestion-err',err);
                // })
            // },
            //问题下标切换
            // changeQuestionIndex:function(num){
            //     let answer = this.$refs.questionDisplay.getAnswer();
            //     this.answerList[this.questionIndex] = answer;
            //
            //     this.questionIndex = num;
            //     let curanswer = this.answerList[this.questionIndex];
            //     if (curanswer) {
            //         this.$refs.questionDisplay.setSubQuestionSelected(curanswer.subQuestionSelected);
            //     } else {
            //         this.$refs.questionDisplay.setSubQuestionSelected("");
            //     }
            //     this.question = this.questionList[this.questionIndex];
            // },

            //上一题
            // onPrevQuestion(){
            //     this.changeQuestionIndex(this.questionIndex -1);
            //     this.skipQuestion();
            // },
            //下一题
            // onNextQuestion(){
            //     this.changeQuestionIndex(this.questionIndex +1);
            //     this.skipQuestion();
            // }

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

            }

        }


        // 改变组件默认样式
        .el-radio__input.is-disabled.is-checked .el-radio__inner {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }
    }

</style>
