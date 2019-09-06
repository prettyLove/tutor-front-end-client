<template>
    <div class="table_box exercisemode_page">
        <!-- ==============================练习测试========================================-->
        <div  :close-on-click-modal="false">
            <div class="card-body">
<!--                预览{{questionIndex+1}}/{{questionList.length?questionList.length:0}}-->
                <div class="exercisemode_title" >题目</div>
                <div class="answertf">
                    总共<span class="fontSize"> {{this.rightCount+this.wrongCount}} </span>题,
                    答对<span class="fontSize"> {{this.rightCount}} </span>题,
                    答错<span class="fontErr"> {{this.wrongCount}} </span>题
                </div>
                <!--  题目内容   -->
                <QuestionDisplayBlock v-bind:question="question" ref="questionDisplay" v-bind:displayAnswer="true" class="preview_box"/>
                <div style="height: 20px;"></div>
                <el-row>
                    <el-col :span="18">
                        <div style="text-align: left;">
                            <el-button size="middle" plain type="primary" @click="submitExercisesMode">提交</el-button>
                            <el-button size="middle" plain type="primary" @click="exercisesModeReview">查看</el-button>
                        </div>
                    </el-col>
                </el-row>
                <div style="height: 70px;"></div>
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
    import {parseQuestions} from '@/utils/parseQuestionAnswer';


    export default {
        components: {QuestionDisplayBlock,lgTable, lgBody},
        extends: tablePageBase,
        name: "exerciseMode",
        data(){
            return{
                questionIndex:0,
                questionList:'',
                question: {},
                questionList:[],
                answerList:[],
                id:'', //问题id,
                // answerRresult:[], //
                rightCount:'',
                wrongCount:'',
            }
        },
        mounted() {
            this.questionContent();
            this.rightAndWrongList(); //加载对错题
        },
        methods:{
            exercisesModeReview:function(){
                //查看已答过的题目列表
                this.$router.push({  //核心语句
                    path: '/exercisemode/exercisemodeReview',   //跳转的路径
                    query: {           //路由传参时push和query搭配使用 ，作用时传递参数
                        // id: item.id,
                    }
                })
            },
            //对错题列表
            rightAndWrongList:function(){
                questionApi.getExerciseGrade().then((result)=>{
                    if (result.code==this.$success){
                        console.log('getExerciseGrade-----result',result);
                        this.rightCount=result.data.rightCount;
                        this.wrongCount=result.data.wrongCount;
                    }
                })
            },
            //题目列表
            questionContent(){
                questionApi.getExerciseQuestion().then((result)=>{
                    if (result.code == this.$success) {
                        console.log('getExerciseQuestion===result',result);
                        this.question = result.data || {};
                        this.question.subQuestions = this.question.displaySubQuestions;
                        this.questionIndex = result.data.questionSeq;
                        this.id=result.data.uuid;
                        parseQuestions(this.questionList); // 还原答案
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //提交
            submitExercisesMode(){
                let answers = this.$refs.questionDisplay.getAnswer().answers;
                let params={
                    answers:answers, id:this.question.uuid
                }
                questionApi.submitExercise(params).then((result)=>{
                    if (result.code == this.$success ) {
                        console.log('submitExercise===result',result);
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
                    this.questionContent(); //重新接在题目
                    this.rightAndWrongList(); //加载对错题
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
        }
    }
</script>

<style lang="scss">
    .exercisemode_page{
        .exercisemode_title{
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin-bottom: 30px;
        }
        .answertf{
            text-align: center;
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
    }
</style>
