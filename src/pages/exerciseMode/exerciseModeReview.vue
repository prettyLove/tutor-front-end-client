<template>
<!--    &lt;!&ndash;    已封裝好的分頁&ndash;&gt;-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths"  @pageChange="setPage" class="page_history_list">
<!--          =================== 条件搜索框 ===================-->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form  :model="reqCond" label-width="80px" >
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <el-form-item label="标题:">
                                    <el-input size="small" v-model="reqCond.question" placeholder="请输入标题"
                                              @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="结果:">
                                    <el-input size="small" v-model="reqCond.right"  placeholder="请输入结果(英文)"
                                              @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" >
                                <div style="line-height: 42px;">
                                    <el-button class="search_box_serarch_button" type="primary" size="small" icon="el-icon-search" @click="getPageList()">搜索</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </lgSearchBox>
            </div>
        </template>
        <!--   ====================内容==========================-->

        <template slot="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
<!--                <td style="width: 70%;">{{item.question?item.question.substr(0,150)+(item.question.length>150?'...':''):''}}</td>-->
                <td>
                    <div style="padding: 6px 0;">
                        <MathDisplayable :formula="item.question" />
                        <!--{{item.question}}-->
                    </div>
                </td>
                <td style="width: 140px;">{{item.right==true?'正确':'错误'}}</td>
                <td class="control_btns" style="width: 70px;" >
                    <!-- 编辑按钮 -->
                    <el-button size="small" plain @click="seeExerciseReviewList(item)">查看</el-button>
                </td>
            </tr>
        </template>
        <template slot="dialog">
            <!--    笔记编辑弹出框-->
            <el-dialog title="题目" :visible.sync="questionDialogVisible"  :close-on-click-modal="false"  >
                <div class="table_box test_mode_page">
                    <div :close-on-click-modal="false">
                        <gx-test-question-review v-if="isShow" :questionList="questionList"></gx-test-question-review>
                    </div>
                </div>
            </el-dialog>
        </template>
    </lg-body>
</template>


<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import QuestionDisplayBlock from "@/components/QuestionDisplayBlock/QuestionDisplayBlock";
    import gxTestQuestionReview from '@/components/gxTestQuestionReview'
    import {questionApi} from '@/api/question';
    import {parseQuestions} from '@/utils/parseQuestionAnswer';
    import MathDisplayable from '@/components/MathDisplayable/MathDisplayable.vue'

    export default {
        name: "exerciseModeReview",
        components: {lgBody,lgTable,QuestionDisplayBlock, gxTestQuestionReview,lgSearchBox,MathDisplayable},
        extends : tablePageBase,
        data() {
            return {
                isShow: false,
                questionList: [],
                pageNumber:'1',
                isShow:false,
                questionIndex:0,
                questionDialogVisible:false,
            }
        },
        mounted() {
            let vm = this;
            vm.ths= ['问题','结果', {name:'操作',align:"center"}];
            // 增删改查
            vm.api.listPage = this.$api.questionRouter.exerciseListPage;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            getExerciseModeReview:function () {
                questionApi.exerciseListPage({pageNumber:this.pageNumber}).then((result) => {
                    if (result.code == this.$success) {
                        console.log('getExerciseListPage-result', result);
                        this.questionList = result.data.list||[];
                        this.questionIndex = 0;
                        this.questionList.map(questionList => {
                            if (questionList.displaySubQuestions) {
                                questionList.subQuestions = questionList.displaySubQuestions;
                            }
                        })
                        parseQuestions(this.questionList); // 还原答案
                        console.log('this.questionList', this.questionList);
                        // this.question = this.questionList[this.questionIndex];
                        this.isShow=true;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            seeExerciseReviewList:function () {
                this.questionDialogVisible=true;
                this.getExerciseModeReview();
            }
            
        }
    }
</script>

<style lang="scss">
    .control_btns{text-align: center}
</style>
