<template>
    <!--    已封裝好的分頁-->
<!--    <lg-body :page-info="pageInfo" :title="$route.name"   @pageChange="setPage" class="page_history_list">-->
<!--          =================== 条件搜索框 ===================-->
<!--        <template slot="head">-->
<!--            <div class="search_box">-->
<!--                <lgSearchBox style="padding: 16px 16px;">-->
<!--                    <el-form  :model="reqCond" label-width="80px" >-->
<!--                        <el-row :gutter="10">-->
<!--                            <el-col :span="4">-->
<!--                                <el-form-item label="标题:">-->
<!--                                    <el-input size="small" v-model="reqCond.title"-->
<!--                                              @keyup.enter.native="enterSearch"></el-input>-->
<!--                                </el-form-item>-->
<!--                            </el-col>-->
<!--                            <el-col :span="2" >-->
<!--                                <div style="line-height: 42px;">-->
<!--                                    <el-button class="search_box_serarch_button" type="primary" size="small" icon="el-icon-search" @click="getPageList()">搜索</el-button>-->
<!--                                </div>-->
<!--                            </el-col>-->
<!--                        </el-row>-->
<!--                    </el-form>-->
<!--                </lgSearchBox>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template slot="dialog">-->
            <div class="table_box test_mode_page">
                <div >
                    <gx-test-question-review v-if="isShow" :questionList="questionList"></gx-test-question-review>
                </div>
            </div>
<!--        </template>-->
<!--    </lg-body>-->
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

    export default {
        name: "historyExerciseModeReview",
        components: {lgBody,lgTable,QuestionDisplayBlock, gxTestQuestionReview,lgSearchBox},
        extends : tablePageBase,
        data() {
            return {
                isShow: false,
                questionList: [],
                questionIndex:0,
                isShow:false,
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            // let vm=this;
            // 加载列表
            // vm.getPageList();
            // 增删改查
            // vm.api.listPage = this.$api.questionRouter.getAssessQuestionResult;
            console.log('this.id',this.id);
            this.getAssessQuestionListPage();
        },
        methods: {
            getAssessQuestionListPage: function () {
                questionApi.getAssessQuestionResult({roomId:this.id}).then((result) => {
                    if (result.code == this.$success) {
                        console.log('getAssessQuestionListPage-result', result);
                        this.questionList = result.data.displayQuestions;
                        console.log('this.questionList', this.questionList);
                        parseQuestions(this.questionList); // 还原答案
                        this.questionIndex = 0;
                        this.questionList.map(questionList => {
                            if (questionList.displaySubQuestions) {
                                questionList.subQuestions = questionList.displaySubQuestions;
                            }
                        })
                        this.question = this.questionList[this.questionIndex];
                        this.isShow=true;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
