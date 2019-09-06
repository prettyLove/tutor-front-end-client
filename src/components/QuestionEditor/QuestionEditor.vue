<template>
    <div >

        <div class="question_editer">

            <el-dialog title="图表" :visible.sync="dialogGraphVisible" width="60%" :close-on-click-modal="false" >
                <gx-draw-graph-modal v-if="dialogGraphVisible" ref="graphModal" :graphCb="graphCb" :dataStr="graphEdit" :stateNum="stateNum" @close="closeGraphDialog" />
            </el-dialog>

            <!--<lg-hr />-->

            <div class="col-12">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="问题内容:" :label-width="formLabelWidth">
                            <el-row >
                                <el-col :span="13">
                                    <div style=" margin-right: 10px; ">
                                        <div style="border-radius: 4px;">
                                            <div  style="line-height: 20px; color: #6595c4;">预览</div>
                                            <div style="border: 1px solid #98c7e6; padding: 4px 6px; min-height: 58px; ">
                                                <MathDisplayable :formula="model.question" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                            </div>
                                        </div>

                                        <div style="line-height: 20px; color: #6595c4;">code</div>
                                        <el-input ref="questionField" type="textarea" rows="6" :autosize="{ minRows: 6, maxRows: 16 }"  v-model="model.question" @change="onTextfieldChange" @focus="()=>{onFocus('questionField')}" />
                                    </div>
                                </el-col>
                                <el-col :span="11">

                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-form-item label="图表:" :label-width="formLabelWidth">
                            <div class="form-button text-center">
                                <div v-for="(graph, index) in model.graph">
                                    图表{{index + 1}}
                                    <el-button size="mini" v-on:click="()=>{onOpenDrawGraphModal('question', index)}">修改</el-button>
                                    <el-button size="mini" v-on:click="()=>{onDeleteGraph('question',index)}">删除</el-button>
                                </div>
                                <el-button size="small" v-on:click="()=>{onOpenDrawGraphModal('question')}">新增图案或函数图</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <lg-hr />

                <!-- 题目卡片-->
                <!--<el-tabs v-model="activeEditIndex" type="card" @tab-click="onQuestionTabClick" closable @tab-remove="removeQuestionTab">-->
                <!--    <el-tab-pane v-for="item in ui.numberOfQuestion" :label="'题目'+item" name="1">题目{{item}}</el-tab-pane>-->
                <!--</el-tabs>-->

                <!--<div class="horizontal-form">
                    <el-form-item label="题目数:" :label-width="formLabelWidth">
                        <el-select  v-model="ui.numberOfQuestion" @change="onQuestionChange"  >
                            <el-option v-for="i in 9"  :key="i" :label="i" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                </div>-->


            </div>
        </div>

        <!-- 特别工具  -->
        <tool-box  :currentFocus="ui.currentFocus"
                   @addTool="onAddTool"
                   @change="onChange"
                   :fboxNums="fboxList.length"
        @addVariable="addVariable" />

        <el-row :gutter="10" v-for="(subQuestion, index) in model.subQuestions" :key="index" >
            <!-- 题目列表 -->
            <el-col :span="14">
                <div >
                    <!-- 题目列表 -->
                    <el-card style=" border-radius: 6px; margin-top: 20px;">
                        <div slot="header" class="clearfix" >
                            <span style="font-size: 18px; color: #468bcc;" >题目{{index+1}}</span>
                            <el-button v-if="index>0" @click="removeQuestionCard(model.subQuestions,index)" type="danger" plain style="float: right; padding: 5px 8px" >删除</el-button>
                        </div>
                        <div style="line-height: 40px;">
                            <el-row>
                                <el-col :span="10">
                                    <div class="horizontal-form">
                                        <el-form-item :label="'题型'+(index + 1)+':'" :label-width="formLabelWidth">
                                            <el-select size="small" v-model="subQuestion.type" @change="()=>{onQuestionTypeChange(subQuestion)}"  style="width: 100%;" >
                                                <el-option v-for="(item,index) in questionTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <template v-if="subQuestion.type === 'TF'">

                                    <el-col :span="24">
                                        <lg-hr />
                                        <el-row :gutter="10" v-for="(option, oi) in subQuestion.choice" :key="oi">

                                            <el-col :span="14" >
                                                <!--<label class="align-middle">选择{{oi + 1}}:</label>-->
                                                <div>
                                                    <el-form-item :label="'选择'+(oi + 1)+':'" :label-width="formLabelWidth">
                                                        <el-input size="small" v-bind:ref="'optionField'+index"
                                                                  v-model="option.value"
                                                                  @change="onTextfieldChange"
                                                                  v-on:focus="()=>{onFocus('optionField'+index, index, oi)}"/>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="2" >
                                                <div class="form-check">
                                                    <!--<input size="small" type="checkbox" class="form-check-input" v-model="option.isCorrect" @change="onChange"/>-->
                                                    <!--<label class="form-check-label">正确</label>-->
                                                    <div >
                                                        <el-checkbox size="small" v-model="option.isCorrect" @change="onChange" >正确</el-checkbox>
                                                    </div>
                                                </div>
                                            </el-col>
                                            <el-col :span="5" >
                                                <div >
                                                    <template v-if="!option.graph">
                                                        <el-button size="small" v-on:click="()=>{onOpenDrawGraphModal('tf', index, oi)}">
                                                            新增图案或函数图
                                                        </el-button>
                                                    </template>
                                                    <template v-else>
                                                        <el-button size="small" v-on:click="()=>{onOpenDrawGraphModal('tf', index, oi)}">修改图表</el-button>
                                                        <el-button size="small" v-on:click="()=>{onDeleteGraph('tf', index, oi)}">删除图表</el-button>
                                                    </template>
                                                </div>
                                            </el-col>
                                            <el-col :span="2" >
                                                <el-button icon="el-icon-close" v-if="oi>0" type="danger" plain size="small" @click="deleteQuestionChoice(subQuestion,oi)">删除</el-button>
                                            </el-col>
                                        </el-row>

                                        <div style="height: 10px;"></div>
                                        <div style="text-align: center;">
                                            <el-button icon="el-icon-circle-plus-outline" type="primary" plain size="small" @click="addQuestionChoice(subQuestion)">添加选择项</el-button>
                                        </div>
                                        <div style="height: 10px;"></div>

                                    </el-col>
                                </template>

                            </el-row>

                            <template v-if="subQuestion.type === 'MC'">
                                <div class="horizontal-form">
                                    <!-- <el-form-item label="选择数:" :label-width="formLabelWidth">
                                         <el-select size="small"  class="form-control" v-model="subQuestion.numberOfOptions"
                                                    @change="()=>{onChoiceChange(index)}">
                                             <el-option v-for="i in [2, 3, 4, 5, 6, 7, 8]" :key="i" :label="i" :value="i"></el-option>
                                         </el-select>
                                     </el-form-item>-->
                                </div>
                                <el-row :gutter="20" v-for="(option, oi) in subQuestion.choice" :key="oi">
                                    <el-col :span="16">
                                        <el-form-item :label="oi == 0 ? '答案' : '错误答案' + oi" :label-width="formLabelWidth">
                                            <el-input size="small" v-bind:ref="'optionField'+index" v-model="option.value"
                                                      @change="onTextfieldChange"
                                                      v-on:focus="()=>{onFocus('optionField'+index, index, oi)}" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="form-button text-center">
                                            <template v-if="!option.graph">
                                                <el-button size="mini" class="btn btn-primary btn-xs mt-1"
                                                           v-on:click="()=>{onOpenDrawGraphModal('mc', index, oi)}">新增图表
                                                </el-button>
                                            </template>
                                            <template v-else>
                                                <el-button size="mini" class="btn btn-primary btn-xs mt-1 mr-1"
                                                           v-on:click="()=>{onOpenDrawGraphModal('mc', index, oi)}">修改图表
                                                </el-button>
                                                <el-button size="mini" class="btn btn-danger btn-xs mt-1"
                                                           v-on:click="()=>{onDeleteGraph('mc', index, oi)}">删除图表
                                                </el-button>
                                            </template>
                                        </div>
                                    </el-col>
                                    <el-col :span="2" >
                                        <el-button icon="el-icon-close" v-if="oi>1" type="danger" plain size="small" @click="deleteQuestionChoice(subQuestion,oi)">删除</el-button>
                                    </el-col>

                                </el-row>
                                <div style="text-align: center;">
                                    <div style="text-align: center;">
                                        <el-button icon="el-icon-circle-plus-outline" type="primary" plain size="small" @click="addQuestionChoice(subQuestion)">添加选择项</el-button>
                                    </div>
                                </div>
                            </template>

                            <!-- 填充题 -->
                            <el-row v-if="subQuestion.type === 'FILL_IN_THE_BLANKS' ">
                                <el-col :span="16">
                                    <!--<label class="align-middle">答案{{index + 1}}:</label>-->

                                    <div v-if="fboxList && fboxList.length>0">
                                        <el-form-item v-for="(item,answerIndex) in fboxList" :key="answerIndex" :label="'答案'+(answerIndex + 1)+':'" :label-width="formLabelWidth">
                                            <MathDisplayable  :formula="'\('+item+'\)'" beginMath="\(" endMath="\)" />
                                            <el-input size="small" class="form-control" v-bind:ref="'fillInField'+answerIndex+''+index"
                                                      v-model="subQuestion.choice[answerIndex]" @change="onTextfieldChange"
                                                      v-on:focus="()=>{onFocus('fillInField'+answerIndex+''+index, answerIndex,index)}" />
                                        </el-form-item>
                                    </div>
                                    <div v-else>没有找到输入框</div>
                                </el-col>
                            </el-row>


                            <!-- 直接答题 -->
                            <el-row v-if="subQuestion.type === 'DIRECT_QUESTION'">
                                <el-col :span="16">
                                    <el-form-item :label="'答案'+(index + 1)+':'" :label-width="formLabelWidth">
                                        <el-input size="small" class="form-control" v-bind:ref="'answerField'+index"
                                                  v-model="subQuestion.answer" @change="onTextfieldChange"
                                                  v-on:focus="()=>{onFocus('answerField'+index, index)}" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>

                </div>
            </el-col>

            <!-- 预览 -->
            <el-col :span="10">
                <div >
                    <!-- 题目列表 -->
                    <el-card style=" border-radius: 6px; margin-top: 20px;">
                        <div slot="header" class="clearfix" >
                            <span style="font-size: 18px; color: #468bcc;" >题目{{index+1}}预览</span>
                        </div>
                        <div style="line-height: 40px;">
                            <el-row>

                                <!-- 是非题 -->
                                <template v-if="subQuestion.type === 'TF'">
                                    <el-col :span="24">
                                        <el-row :gutter="10" v-for="(option, oi) in subQuestion.choice" :key="oi">
                                            <el-col :span="22" >
                                                <div>
                                                    <el-form-item :label="'选择'+(oi + 1)+':'" :label-width="'60px'">
                                                        <MathDisplayable :formula="option.value" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>

                                    </el-col>
                                </template>

                            </el-row>

                            <!-- 选择题 -->
                            <template v-if="subQuestion.type === 'MC'">
                                <el-row :gutter="20" v-for="(option, oi) in subQuestion.choice" :key="oi">
                                    <el-col :span="24">
                                        <el-form-item :label="oi == 0 ? '答案:' : '错误答案' + oi+':'" :label-width="formLabelWidth">
                                            <MathDisplayable :formula="option.value" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </template>

                            <!-- 填充题 -->
                            <el-row v-if="subQuestion.type === 'FILL_IN_THE_BLANKS' ">
                                <el-col :span="16">
                                    <div v-if="fboxList && fboxList.length>0">
                                        <el-form-item v-for="(item,answerIndex) in fboxList" :key="answerIndex" :label="'答案'+(answerIndex + 1)+':'" :label-width="formLabelWidth">
                                            <!--<MathDisplayable  :formula="'\('+item+'\)'" beginMath="\(" endMath="\)" />-->

                                            <MathDisplayable :formula="subQuestion.choice[answerIndex]" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                        </el-form-item>
                                    </div>
                                    <!--<el-form-item :label="'答案'+(index + 1)+':'" :label-width="formLabelWidth">
                                        <MathDisplayable :formula="subQuestion.answer" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                    </el-form-item>-->
                                </el-col>
                            </el-row>

                            <!-- 直接答题 -->
                            <el-row v-if="subQuestion.type === 'DIRECT_QUESTION'">
                                <el-col :span="16">
                                    <el-form-item :label="'答案'+(index + 1)+':'" :label-width="formLabelWidth">
                                        <MathDisplayable :formula="subQuestion.answer" :beginMath="editMathFag.beginMath" :endMath="editMathFag.endMath" />
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </div>
                    </el-card>

                </div>
            </el-col>
        </el-row>

        <div style="height: 30px;"></div>

        <div style="text-align: center;">
            <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="addNewQuestion(model.subQuestions)">添加题目</el-button>
        </div>

        <!-- 约束  -->
        <el-card class="box-card" v-if="model.rule.length > 0" style="margin-top: 20px; width: 70%;" >
            <div slot="header" class="clearfix">
                <span>约束</span>
            </div>

            <div >
                <el-row :gutter="20" v-for="(rule,index) in getRules('number')" :key="index">
                    <el-col :span="20">
                        <div style="font-size: 14px; color: #4285f4;">
                            {{typeKeyToValue[rule.type]}} [ {{rule.count}} ]:
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="'最少值'" :label-width="'60px'">
                            <el-input size="small" class="form-control" rows="4" cols="50" v-model="rule.value.min" @change="onChange" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="'最大值:'" :label-width="'60px'">
                            <el-input size="small" class="form-control" rows="4" cols="50" v-model="rule.value.max" @change="onChange" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="'间距:'" :label-width="'50px'">
                            <el-input size="small" class="form-control" rows="4" cols="50" v-model="rule.value.interval" @change="onChange" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" v-for="(rule,index) in getRules('object')" :key="index">
                    <el-col :span="20">
                        <!--<label class="align-middle">{{typeKeyToValue[rule.type]}}{{rule.count}}:</label>-->
                        <el-form-item :label="typeKeyToValue[rule.type]+rule.count+':'" :label-width="formLabelWidth">
                            <el-input class="form-control" rows="4" cols="50" v-model="rule.value.value" @change="onChange" />
                        </el-form-item>
                    </el-col>>
                </el-row>
                <div class="col-6" v-for="rule in getRules('verb')">
                    <div class="horizontal-form">
                        <!--<label class="align-middle">{{typeKeyToValue[rule.type]}}{{rule.count}}:</label>-->
                        <el-form-item :label="typeKeyToValue[rule.type]+rule.count+':'" :label-width="formLabelWidth">
                            <el-input class="form-control" rows="4" cols="50" v-model="rule.value.value" @change="onChange" />
                        </el-form-item>
                    </div>
                    <hr>
                </div>

            </div>

        </el-card>

        <div style="height: 30px;"></div>
    </div>
</template>

<script src="./QuestionEditor.js" />

<style src="./QuestionEditor.scss" lang="scss" scoped />
<style lang="scss">
    .question_editer {

    }
</style>
