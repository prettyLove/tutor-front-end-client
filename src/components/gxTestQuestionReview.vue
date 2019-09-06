<template>
    <div class=" test_mode_page">
        <!-- ==============================练习习题========================================-->
        <div  :close-on-click-modal="false">
            <div class="card-body" >

                <div class="test_mode_title" >题目回看{{questionIndex+1}}/{{questionList.length?questionList.length:0}}</div>
                <!--  题目内容   -->
                <QuestionDisplayBlock :disabled="true" v-bind:question="question" v-if="question"
                                      ref="questionDisplay" v-bind:displayAnswer="true" class="preview_box"/>
                <div style="height: 20px;"></div>
                <el-row>
                    <el-col :span="3" class="prevTopic">
                        <!--                            v-bind:disabled="editIndex <= 0" 索引小于0禁用按钮-->
                        <el-button size="middle" @click="onPrevQuestion(-1)" v-bind:disabled="questionIndex <= 0">
                            上一题
                        </el-button>
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
                        <li class="item" v-for="(item,index) in questionList.length"
                            :class="questionIndex === index ? 'active' : ''"
                            @click="clickIndexBtn(index)" :key="index">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import tablePageBase from '../pages/common/tablePageBase';
    import lgBody from "@/components/lgBody";
    import lgTable from "@/components/lgTable";
    import QuestionDisplayBlock from "@/components/QuestionDisplayBlock/QuestionDisplayBlock";
    import {examApi} from '@/api/exam';
    import {parseQuestions} from '@/utils/parseQuestionAnswer';
    export default {
        name: "gxTestQuestionReview",
        components: {QuestionDisplayBlock,lgTable, lgBody},
        props:{
            questionList:{
                type: Array,
                default:[],
            },
        },
        extends: tablePageBase,
        data(){
            return{
                questionIndex:0,
                question: {},
            }
        },
        mounted() {
            if(this.question==null){
                return false
            }else{
                this.question=this.questionList[this.questionIndex]
            }
        },
        methods:{
            //下标索引列表
            clickIndexBtn:function(index){
                console.log("clickIndexBtn",index);
                this.changeQuestionIndex(index);
            },

            //问题下标切换
            changeQuestionIndex:function(num){
                this.questionIndex = num;
                this.question = this.questionList[this.questionIndex];
            },

            //上一题
            onPrevQuestion(){
                this.changeQuestionIndex(this.questionIndex -1);
            },
            //下一题
            onNextQuestion(){
                this.changeQuestionIndex(this.questionIndex +1);
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

            }

        }


        // 改变组件默认样式
        .el-radio__input.is-disabled.is-checked .el-radio__inner {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }
    }
</style>
