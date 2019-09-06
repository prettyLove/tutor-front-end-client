<template>
    <div class="preview-question" >

        <div v-if="question">
            <div class="card-body">

                <!--  题目内容   -->
                <QuestionDisplayBlock v-bind:question="question" v-bind:displayAnswer="displayAnswer" class="preview_box"/>

                <div style="height: 20px;"></div>
                <el-row>
                    <el-col :span="3">
                        <el-button size="middle" @click="onSwitchQuestion(-1)" v-bind:disabled="editIndex <= 0">上一题</el-button>
                    </el-col>

                    <el-col :span="18">
                       <div style="text-align: center;">
                           <el-button size="middle" plain type="success" v-if="question.reviewStatus=='NOT_REVIEWED'" @click="onApproveQuestion">审批</el-button>
                           <el-button size="middle" plain type="primary" @click="onEditQuestion">编辑</el-button>
                           <el-button size="middle" @click="onDisplayAnswer">
                               {{displayAnswer ? '隐藏答案' : '显示答案'}}
                           </el-button>
<!--                           <el-button v-bind:disabled="editIndex <= listTotal-1" size="middle"  @click="$emit('close')">返回</el-button>-->
                       </div>
                    </el-col>

                    <el-col :span="3">
                        <div style="text-align: right;">
                            <el-button size="middle" v-bind:disabled="editIndex >= listTotal-1" @click="onSwitchQuestion(1)">下一题</el-button>
                        </div>
                    </el-col>

                </el-row>

                <div style="height: 70px;"></div>

            </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2'
    import QuestionDisplayBlock from '@/components/QuestionDisplayBlock/QuestionDisplayBlock.vue';
    import {questionApi} from '../../api/question';
    import {questionTypeList} from '@/utils/const';
    import qs from 'qs'

    export default {
        name:"previewQuestion",
        components: {
            QuestionDisplayBlock
        },
        props:{
            question:{
                type: Object,
                default:()=>{
                    return {}
                },
            },
            listTotal:{
                type: Number,
                default:0,
            },
            editIndex:{
                type: Number,
                default:0,
            },
        },
        data: function () {
            return {
                recordPerPage: 10,
                // question: null,
                displayAnswer: false,
                currentPage: 1,
                index: 0,
                reqCond:null,
            }
        },

        watch:{
            // question 改变时处理
            // question:{
            //     handler(val,oldVla){
            //         let question = val;
            //         console.log("question",question)
            //         if(question){
            //             if(question.reviewStatus=="NOT_REVIEWED"){
            //                 question.isReviewed = false;
            //             }else{
            //                 question.isReviewed = true;
            //             }
            //         }
            //     },
            //     deep:true, //深度
            //     immediate: true // 实时
            // }
        },

        created() {
            function shuffle(array) {
                let currentIndex = array.length, temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

            // this.reqCond = this.$route.query.reqCond;
            // this.question = this.$route.query.question;
            // this.index = this.$route.query.index;

            // getQuestion(this.currentPage).then(response => {
            //     this.question = response.data[this.index];
            //
            //     this.question.subQuestions.map(subQuestion => {
            //         if (subQuestion.type === 'MC') {
            //             subQuestion.answer.value = shuffle(subQuestion.answer.value);
            //         }
            //     })
            // })

            questionApi.getTotalQuestion().then(response => {
                this.recordPerPage = response.data.recordPerPage;
            })
        },
        mounted(){

        },

        methods: {
            // 审批问题
            onApproveQuestion() {
                questionApi.approveQuestion({questionId:this.question.id}).then(result => {
                    if(result.code==this.$success){
                        this.question.isReviewed = true;
                        this.$message({
                            message: '成功审批问题！',
                            type: 'success'
                        });
                        this.$emit("approveQuestion",this.question.id);
                        return;
                    }
                    this.$message({
                        message: '审批问题失败！',
                        type: 'error'
                    });
                })
            },
            // 下一题目
            onSwitchQuestion(offset) {
                if(offset==-1){
                    this.$emit('prevQuestion')
                }else{
                    this.$emit('nextQuestion')
                }
            },
            // 编辑
            onEditQuestion() {
               /* this.apiService.getQuestionDefinition(this.question.id).then(response => {
                    this.$router.push({
                        path: '/question/addQuestion',
                        query: {
                            question: response.data,
                            reqCond: this.reqCond,
                        }
                    })
                })*/
               /* this.$router.push({
                    path: '/question/addQuestion',
                    query: {
                        questionId: this.question.id,
                        reqCond:JSON.stringify(this.reqCond)
                    }
                })*/
                this.$emit("editQuestion",this.question.id);
            },

            // 显示答案
            onDisplayAnswer() {
                this.displayAnswer = !this.displayAnswer;
            },
            // 返回
            onGoBack() {
                this.$router.push({
                    path: '/question/questionList',
                    query: {
                        reqCond : this.reqCond,
                    },
                });
            },


        }
    }
</script>

<style lang="scss">
    .preview-question {
        .preview_box {
            min-height: 300px;
        }
    }

</style>
