<template >
    <!-- 继承自  tablePageBase -->
    <lg-body :pageInfo="pageInfo" :ths="ths" :title="$route.name" @pageChange="setPage" class="page_question_list" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head" >
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form  :model="reqCond" label-width="80px" >
                        <el-row :gutter="10">

                            <el-col :span="4" >
                                <el-form-item label="审批:"  >
                                    <el-select size="small" v-model="reqCond.reviewStatus" clearable style="width: 100%;">
                                        <el-option  label="自己审批" value="SELF_REVIEWED"></el-option>
                                        <el-option  label="未审批" value=""></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4" >
                                <el-form-item label="年级:"  >
                                    <el-select size="small" v-model="reqCond.categoryA" clearable style="width: 100%;">
                                        <el-option v-for="(option,k) in options.optionsMap" :key="k" :label="k" :value="k"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6" >
                                <el-form-item label="主要章节:"  >
                                    <el-select size="small" v-model="reqCond.categoryB" clearable style="width: 100%;">
                                        <el-option v-for="(option,k) in options.optionsMap[reqCond.categoryA]" :key="k" :label="k" :value="k"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6" >
                                <el-form-item label="副章节:"  >
                                    <el-select size="small" v-model="reqCond.categoryC" clearable style="width: 100%;">
                                        <el-option v-for="(option,k) in options.optionsMap[reqCond.categoryA]?options.optionsMap[reqCond.categoryA][reqCond.categoryB]:{}" :key="k" :label="k" :value="k"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="5" >
                                <el-form-item label="日期由:"  >
                                    <!--<el-input size="small" v-model="reqCond.startDate" @keyup.enter.native="enterSearch"></el-input>-->
                                    <el-date-picker style ="width:100%;"
                                        v-model="reqCond.startDate" size="small"
                                        align="right"
                                        type="date" value-format="yyyy-MM-dd"
                                        placeholder="选择日期" >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" >
                                <el-form-item label="日期至:"  >
                                    <!--<el-input size="small" v-model="reqCond.endDate" @keyup.enter.native="enterSearch"></el-input>-->
                                    <el-date-picker style ="width:100%;"
                                        v-model="reqCond.endDate" size="small"
                                        align="right"
                                        type="date" value-format="yyyy-MM-dd"
                                        placeholder="选择日期" >
                                    </el-date-picker>
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

        <!--  =================== 添加对话框 ===================  -->
        <template slot="dialog">
            <el-dialog :title="'题目预览  '+(editIndex+1)+'/'+ (pageInfo.list?pageInfo.list.length:0)" :visible.sync="dialogFormVisible" width="80%"  :close-on-click-modal="false">
                <preview-question :question="form" :editIndex="editIndex" :listTotal="pageInfo.list?pageInfo.list.length:0"
                                  @prevQuestion="onPrevQuestion" @nextQuestion="onNextQuestion" @editQuestion="onEditPreviewQuestion"
                @approveQuestion="onApproveQuestion"/>
            </el-dialog>
        </template>

        <!--  =================== 添加按钮 ===================  -->
        <template slot="table_btns">
            <ul>
                <li><el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="$router.push('/question/addQuestion')">添加</el-button></li>
            </ul>
        </template>

        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="(item,index) in pageInfo.list">
                <td style="width: 32px">{{(reqCond.pageNumber-1)*10+index+1}}</td>
                <td style="width: 60%;">

                    <!--<vue-markdown :source="item.question"></vue-markdown>-->
                    <!--<mavon-editor v-model="latex"/>-->
                    <div style="padding: 6px 0;">
                        <MathDisplayable :formula="item.question" />
                        <!--{{item.question}}-->
                    </div>
                </td>
                <td  >
                    <div style="padding: 6px 0">
                    <template v-for="subQuestion in item.subQuestions">
                        <template v-if="subQuestion.type === 'FILL_IN_THE_BLANKS'">
                            <span v-for="(an,anIndex) in subQuestion.answer.value" >
                                <MathDisplayable   v-bind:formula="an" /><span v-if="anIndex<subQuestion.answer.value.length-1">,</span>
                            </span>

                        </template>
                        <template v-if="subQuestion.type === 'MC' || subQuestion.type === 'TF'">
                            <MathDisplayable v-for="(choice,ci) in subQuestion.answer.value" :key="ci+'_'+choice.value" :formula="choice.value" />
                        </template>
                    </template>
                    </div>
                </td>
                <td style="width: 70px">{{item.reviewStatus|formatReviewStatus}}</td>
                <td class="control_btns" style="width: 140px;text-align: center;">
                    <!-- 编辑按钮 -->
                    <el-button size="small" plain @click="editQuestion(item,index)" >编辑</el-button>
                    <!-- 删除按钮 -->
                     <el-button size="small" plain type="danger" @click="del(item.id)" >删除</el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import TablePageBase from '../common/tablePageBase'
    import LgBody from "@/components/lgBody" ;
    import lgSearchBox from "@/components/lgSearchBox"
    import MathDisplayable from '@/components/MathDisplayable/MathDisplayable.vue'
    import previewQuestion from './previewQuestion'
    import qs from 'qs'
    import {roles} from "@/utils/const";

    export default {
        name: "questionList",
        extends : TablePageBase,
        components: { LgBody, lgSearchBox, MathDisplayable ,previewQuestion },
        data(){
            return{
                roles,
                title:'题库列表',
                formLabelWidth: '120px',
                editIndex :0,
                options: {
                    types: [],
                    optionsMap: {},
                    choices: {},
                    tools: [],
                    tutorialLinks: []
                },
                latex:"$ \\int_0^{+\\infty} x^n e^{-x} \\,dx = n! $",
                ck:1,
            };
        },
        filters:{
            formatReviewStatus:function (sta) {
                switch (sta) {
                    case "NOT_REVIEWED":
                        return "未审批"
                        break
                    case "SELF_REVIEWED":
                        return "自己审批"
                        break
                    case "OTHER_REVIEWED":
                        return "别人审批"
                        break
                    case "ADMIN_REVIEWED":
                        return "管理员审批"
                        break
                    default:
                        return sta;
                }
                return null;
            }
        },
        mounted: function () {
            var vm = this;
            //'父节点名称',
            vm.ths = ['#', '问题',  '答案', '已审批', {name: '操 作',align: 'center'}];
            //增删改查
            vm.api.listPage = vm.$api.questionRouter.listPage;
            vm.api.insert = vm.$api.questionRouter.insert;
            vm.api.update = vm.$api.questionRouter.update;
            vm.api.delete = vm.$api.questionRouter.delete;

            let reqCond = qs.parse(this.$route.query.reqCond);
            //
            this.reqCond = Object.assign(this.reqCond,reqCond);
            this.reqCond.pageNumber = parseInt(this.reqCond.pageNumber);
            this.$router.push("/question/questionList"); // 清除显示参数
            // console.log("reqCond",reqCond)

            this.options.types = this.$store.getters.getQuestionConfigsTypes;
            this.options.optionsMap = this.$store.getters.getQuestionOptionsMap;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            getCk:function(ci){
                this.ck += 1;
                return this.ck+"_";
            },
            getPageListAfter:function(p){

            },
            // addQueue:function () {
            //     window.MathJax.Hub.Queue([
            //         'Typeset',
            //         window.MathJax.Hub,
            //         // this.$refs.mathJaxEl
            //         document.getElementsByClassName('main_body')[0],  () => {  // on complete callback
            //              console.log("pppppppppppppppppppppp");
            //         }
            //     ])
            // },
            onEditPreviewQuestion:function(questionId){
                this.$router.push({
                    path: '/question/addQuestion',
                    query: {
                        questionId: questionId,
                        reqCond:qs.stringify(this.reqCond)
                    }
                })
            },
            editQuestion:function(item,index){
                console.log("question",item)
                this.editIndex = index;
                this.edit(item);
            },
            // 上一题目
            onPrevQuestion:function () {
                if (this.editIndex > 0) {
                    this.editIndex -= 1;
                }
                this.form = Object.assign(this.pageInfo.list[ this.editIndex])
                console.log("onPrevQuestion", this.editIndex)
            },
            // 下一题目
            onNextQuestion:function () {
                let len = this.pageInfo.list ? this.pageInfo.list.length : 0;
                if (this.editIndex < len) {
                    this.editIndex +=1;
                }
                this.form = Object.assign(this.pageInfo.list[ this.editIndex])
                console.log("onNextQuestion", this.editIndex)
            },
            // 审核回调
            onApproveQuestion:function () {
                this.getPageList();
            }
            // 编辑题目
            /*edit: function (item, index) {
                // 预览题目
                this.$router.push({
                    path: '/question/previewQuestion', query: {
                        reqCond: this.reqCond,
                        question: item,
                        index
                    }
                });
            }*/
        }
    }
</script>

<style scoped>
    .page_question_list .el-form-item { margin-bottom: 5px; }
</style>
