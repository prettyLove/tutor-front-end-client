<template>
    <div class="table_box add-question">
        <div class="title clearfix"  >
            <h3>上传问题教学</h3>
            <el-button size="mini" v-if="$route.query.reqCond" style="margin-left: 25px; margin-top: 6px;">
                <router-link :to="{ path: '/question/questionList', query: { reqCond: $route.query.reqCond }}" >返回列表</router-link>
            </el-button>

            <div style="float: right; margin-top: 10px;">
                <el-dropdown trigger="click">
                    <el-button type="success" size="mini">
                        查看操作教程<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(link,index) in options.tutorialLinks" :key="index" >
                            <!--<el-button  size="mini" type="primary"  plain>-->
                            <a style="display: block;" target="_BLANK" v-bind:href="link.url" >{{link.name}}</a>
                            <!--</el-button>-->
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-form  :model="model" >
        <div class="card">
            <div class="card-body">


                <div style="padding: 10px 0;">
                    <hr>
                </div>

                <el-row>
                    <el-col :span="6" v-for="(type, index) in options.audienceType.types" :key="index">
                        <el-form-item :label="type.name+':'" :label-width="formLabelWidth">
                            <el-select size="small" v-model="model.audienceType[type.key]" v-on:change="()=>{syncAudienceType(index)}"  style="width: 100%;">
                                <el-option v-for="option in options.audienceType.choices[index]" :key="option" :label="option || '(没有)'" :value="option"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>


                <QuestionEditor ref="questionEditor" v-model="model.question" v-bind:tools="options.tools" v-on:change="()=>{this.ui.canProceed = false}" />


                <el-dialog title="预浏" :visible.sync="mathjaxPreviewVisible"  :close-on-click-modal="false">
                    <div >
                        <div class="col-12">
                            <div class="action-row">
                                <label class="desc align-middle">预浏:</label>
                                <div class="preview-area">
                                    <QuestionDisplayBlock v-if="ui.previewQuestion != null" v-bind:question="ui.previewQuestion" v-bind:displayAnswer="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 取消和保存 -->
                    <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                        <el-button @click="mathjaxPreviewVisible=false">取消</el-button>
                        <el-button type="success" plain v-on:click="submit" v-bind:disabled="!ui.canProceed || (!model.question.graph && !model.question.question) || ui.isLoading">
                            <i v-if="ui.isLoading && ui.loadingAction === 'submit'" class="fas fa-spinner fa-spin"></i>
                            <span v-else>提交</span>
                        </el-button>
                    </div>
                </el-dialog>


                <div style="height: 50px;"></div>
                <el-row>
                    <el-col :span="24">
                        <div style="text-align: center">
                            <el-button type="success" plain v-on:click="preview"  v-loading.fullscreen.lock="ui.isLoading" v-bind:disabled="(!model.question.graph && !model.question.question) || ui.isLoading">
                                <i v-if="ui.isLoading && ui.loadingAction === 'preview'" class="fas fa-spinner fa-spin"></i>
                                <span v-else>预浏</span>
                            </el-button>
                            <!--<el-button type="success" plain v-on:click="submit" v-bind:disabled="!ui.canProceed || (!model.question.graph && !model.question.question) || ui.isLoading">
                                <i v-if="ui.isLoading && ui.loadingAction === 'submit'" class="fas fa-spinner fa-spin"></i>
                                <span v-else>提交</span>
                            </el-button>-->

                            <el-button v-if="$route.query.reqCond" >
                                <router-link :to="{ path: '/question/questionList', query: { reqCond: $route.query.reqCond }}" >返回列表</router-link>
                            </el-button>
                        </div>
                    </el-col>
                </el-row>


                <div style="height: 160px;"></div>
            </div>
        </div>
        </el-form>
    </div>
</template>


<script>

    import Vue from 'vue'
    import Swal from 'sweetalert2'
    import QuestionDisplayBlock from '@/components/QuestionDisplayBlock/QuestionDisplayBlock.vue';
    import QuestionEditor from '@/components/QuestionEditor/QuestionEditor.vue'
    import { questionApi } from "@/api/question";
    import viewBase from "@/pages/common/viewBase";

    export default {
        extends:  viewBase,
        // dependencies: ['$bus', 'apiService', 'authenticationService'],
        name:"addQuestion",
        components: {QuestionDisplayBlock, QuestionEditor},
        props: {},

        data: function() {
            return {
                formLabelWidth:'100px',
                options: {
                    audienceType: {
                        types: [],
                        options: {},
                        choices: {}
                    },
                    tools: [],
                    tutorialLinks: []
                },
                model: {
                    editingQuestion: null,
                    audienceType: {},
                    numberOfQuestion: null,
                    question: {},
                    currentPage: null
                },
                ui: {
                    isLoading: false,
                    loadingAction: null,
                    canProceed: false,
                    previewQuestion: null
                },
                value:'',
                questionId:'',
                mathjaxPreviewVisible:false, // 显示预览
                // updateLoading:false,
            }
        },

        created: function() {
            // this.model.editingQuestion = this.$route.params.question;
            // this.model.currentPage = this.$route.params.currentPage;

            let query  = this.$route.query;
            let questionId = query.questionId;
            // 取题目详情
            if(questionId && questionId!=''){
                this.questionId = questionId;
                questionApi.getOriginalQuestion({questionId:this.questionId}).then((result)=>{
                    if(result.code == this.$success){
                        this.model.editingQuestion = result.data;
                        this.$refs.questionEditor.init(this.model.editingQuestion);
                    }
                }).catch((error)=>{
                    this.$message({
                        type: 'error',
                        message: this.getLang(this.$langCode.quetions.loadQuestionError)
                    });
                })
            }

            // 取问题配置
            // getQuestionConfig().then((response) => {
            let response = this.$store.getters.getQuestionConfigs;
                this.options.audienceType.types = response.types;
                this.options.audienceType.options = this.$store.getters.getQuestionOptionsMap;
                this.options.tools = response.tools;

                this.syncAudienceType(-1);
                // for (let i = 0; i < response.types.length; i++)
                //   this.getOptions(i);

                this.$refs.questionEditor ? this.$refs.questionEditor.reset():"";

                this.options.tutorialLinks = response.tutorialLinks;
                if (this.model.editingQuestion) {
                    console.log(JSON.parse(JSON.stringify(this.model.editingQuestion)))
                    for (let i = 0; i < this.options.audienceType.types.length; i++) {
                        let type = this.options.audienceType.types[i];
                        this.model.audienceType[type.key] = this.model.editingQuestion[type.key];
                        this.syncAudienceType(i);
                    }
                    // this.$refs.questionEditor.init(this.model.editingQuestion);
                }
            // })

        },

        methods: {
            canSubmit: function() {
                if (this.model.question.graph && (this.model.question.question == null || this.model.question.question === '')) {
                    // Swal('错误', '问题不能为空。', 'error');
                    this.$message({
                        type: 'error',
                        message: '问题不能为空'
                    })
                    return false;
                }

                console.log("canSubmit...")
                for (let subQuestion of this.model.question.subQuestions) {
                    if (subQuestion.type === 'MC' || subQuestion.type === 'TF') {
                        for (let choice of subQuestion.choice) {
                            if (choice.graph == null && (choice.value == null || choice.value === '')) {
                                // Swal('错误', '答案不能为空。', 'error');
                                this.$message({
                                    type: 'error',
                                    message: '答案不能为空'
                                })
                                return false;
                            }
                        }
                    }
                    else if (subQuestion.type === 'DIRECT_QUESTION' ) {
                        if (subQuestion.answer == null || subQuestion.answer === '') {
                            // Swal('错误', '答案不能为空。', 'error');
                            this.$message({
                                type: 'error',
                                message: '答案不能为空'
                            })
                            return false;
                        }
                    }else if (subQuestion.type === 'FILL_IN_THE_BLANKS') {
                        if (subQuestion.choice == null || subQuestion.choice.length < 0) {
                            // Swal('错误', '答案不能为空。', 'error');
                            this.$message({
                                type: 'error',
                                message: '答案不能为空'
                            })
                            return false;
                        }
                    }
                }

                return true;
            },

            syncAudienceType(index) {
                for (let i = index+1; i < this.options.audienceType.types.length; i++) {
                    Vue.set(this.options.audienceType.choices, i, this.getOptions(i));
                }
            },

            getOptions(index) {
                let data = this.options.audienceType.options;
                for (let i = 0; i < index; i++) {
                    let key = this.options.audienceType.types[i].key;
                    let model = this.model.audienceType[key];

                    if (model == null) {
                        return [];
                    }

                    data = data[model];

                    if (data == null) {
                        return [];
                    }
                }

                let result = [];

                for (let k in data) {
                    result.push(k);
                }

                this.model.audienceType[this.options.audienceType.types[index].key] = result[0];

                return result;
            },

            // 取题目内容提交
            getOutQuestion(){
                let stringReplace = (text) => {
                    let result = JSON.parse(JSON.stringify(text));
                    let map = {
                        '$计算': '$eval'
                    }
                    for (let k in map) {
                        if (result && result.indexOf(k) != -1) {
                            result = result.replace(k, map[k]);
                        }
                    }
                    return result;
                }

                let questionConstrain = {};

                this.model.question.rule.map(rule => {
                    questionConstrain[rule.text] = rule.value;
                });

                let subQuestions = [];

                this.model.question.subQuestions.map(question => {
                    let getAnswer = (question) => {
                        switch (question.type) {
                            case 'TF':
                            case 'MC':
                                return {
                                    numAns: question.numberOfOptions,
                                    value: question.choice.map(ans => {
                                        return {
                                            isCorrect: ans.isCorrect,
                                            value: stringReplace(ans.value) || '',
                                            encodedText: ans.graph
                                        }
                                    })
                                };
                            case 'FILL_IN_THE_BLANKS':
                                return {
                                    value:question.choice||[],
                                };
                            default:
                                return {
                                    value: stringReplace(question.answer) || ''
                                };
                        }
                    };

                    subQuestions.push({
                        type: question.type,
                        answer: getAnswer(question),
                        answerList : question.answerList||[],
                    });
                });

                let requestBody = {
                    question: stringReplace(this.model.question.question),
                    questionConstrain: questionConstrain,
                    subQuestions: subQuestions,
                    encodedText: this.model.question.graph
                }

                for (let k in this.model.audienceType) {
                    requestBody[k] = this.model.audienceType[k];
                }
                return requestBody;
            },

            // 预览题目
            preview() {
                let  requestBody = this.getOutQuestion();
                requestBody.id = this.questionId;

                this.ui.isLoading = true;
                this.ui.loadingAction = 'preview';

                this.mathjaxPreviewVisible = true;

                // 调用预览接口
                questionApi.getMathjaxPreview(requestBody).then(result => {
                    this.ui.isLoading = false;
                    if ( result.code === this.$success ) {
                        this.ui.previewQuestion = result.data;
                        this.ui.previewQuestion.subQuestions.map(item=>{
                            item.answer.input=[]
                        })
                        console.log("preview",this.ui.previewQuestion)
                        this.ui.canProceed = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.messageCode?this.getLangServerMess(result.messageCode):"错误"  //"格式不正确"
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                    this.ui.isLoading = false;
                    this.$message({
                        type: 'error',
                        message: err||"错误"
                    });
                })
            },

            // 提交
            submit() {
                console.log("submit...")
                if (!this.canSubmit()) return;
                // 准备参数
                let  requestBody = this.getOutQuestion();

                console.log(JSON.parse(JSON.stringify(requestBody)));

                this.ui.isLoading = true;
                this.ui.loadingAction = 'submit';

                if (this.model.editingQuestion != null) {
                    requestBody.id = this.questionId;
                    // send server
                    questionApi.editQuestion(requestBody).then(result => {
                        this.ui.isLoading = false;
                        if (result.code === 0) {
                            // this.$router.push({name: 'view-question', params: {
                            //         currentPage: this.model.currentPage
                            //     }});
                            this.mathjaxPreviewVisible = false;
                            this.$message({
                                type: 'success',
                                message: result.messageCode?this.getLangServerMess(result.messageCode):"成功更新问题"  //"格式不正确"
                            });
                            setTimeout(()=>{this.$router.push('/question/questionList')}, 100);
                        } else {
                            this.$message({
                                type: 'error',
                                message: result.messageCode?this.getLangServerMess(result.messageCode):"错误"  //"格式不正确"
                            });
                        }
                    }).catch((err) => {
                        console.log(err)
                        this.ui.isLoading = false;
                        this.$message({
                            type: 'error',
                            message: result.messageCode?this.getLangServerMess(result.messageCode):"错误"  //"格式不正确"
                        });
                    })
                }
                else {
                    console.log("questionApi",requestBody)
                    questionApi.createQuestion(requestBody).then(result => {
                        if (result.code === 0) {
                            // this.$router.push({name: 'home'});
                            // Swal('成功', '成功新增问题。', 'success');
                            this.$message({
                                type: 'success',
                                message: result.messageCode?this.getLangServerMess(result.messageCode):"操作成功"  //"格式不正确"
                            });
                            setTimeout(()=>{this.$router.push('/question/questionList')}, 100);
                        }
                        else {
                            this.ui.isLoading = false;
                            // Swal('错误', '格式不正确。', 'error');
                            this.$message({
                                type: 'error',
                                message: result.messageCode?this.getLangServerMess(result.messageCode):"错误"  //"格式不正确"
                            });
                        }
                    }).catch(() => {
                        this.ui.isLoading = false;
                        // Swal('错误', '格式不正确。', 'error');
                        this.$message({
                            type: 'error',
                            message: result.messageCode?this.getLangServerMess(result.messageCode):"错误"  //"格式不正确"
                        });
                    })
                }


            }
        }
    }
 </script>
<style lang="scss"  >

    @import "@/theme/layout-variables.scss";
    @import "@/theme/theme-variables.scss";

    .add-question {
        .el-form-item {
            margin-bottom: 0px;
        }
        .tutorial-block {
            margin-left: 5rem;
        }

        .card {
            .card-image {
                height: 10rem;
                width: 10rem;

                position: absolute;
                top: -3rem;
                left: -1rem;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .card-body {

            }
        }

    }

</style>
