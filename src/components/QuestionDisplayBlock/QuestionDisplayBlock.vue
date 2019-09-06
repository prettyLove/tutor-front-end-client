<template>
    <div id="question-display-block" style="min-height: 260px">
        <template v-for="data of displayQuestion">
            <MathDisplayable v-if="data.type === 'display'" v-bind:formula="data.value"/>
            <el-input v-else />
        </template>

        <!--<el-button @click="outAnswer">test</el-button>-->

        <template v-for="data of question.questionDiagrams">
            <div style="color: #468bcc; line-height: 32px; font-size: 16px; ">图表 :</div>
            <!--<GraphDisplayable v-bind:value="data.encodedText"/>-->
            <gx-draw-graph-modal v-if="data.encodedText != null" :dataStr="data.encodedText" :isShow="true"/>
        </template>
        <template v-for="data of question.encodedText">
            <div style="color: #468bcc; line-height: 32px; font-size: 16px; ">图表 :</div>
            <gx-draw-graph-modal v-if="data != null" :dataStr="data" :isShow="true"/>
        </template>

        <div class="mt-10" v-for="(subQuestion, index) in question.subQuestions" v-bind:key="index">
            <div style="line-height: 40px; font-size: 16px; border-bottom: 1px solid #ccc; margin-bottom: 10px;">
                分题{{index+1}}: <span style="color: #ff3126;"> ({{subQuestion.type|formatQuestionType}}) </span>
            </div>

            <!-- 选择题 -->
            <template v-if="subQuestion.type === 'MC'">
                <div class="action-row" v-for="(choice, subQuestionIndex) of subQuestion.answer.value"
                     v-bind:key="subQuestionIndex">
                    <label class="desc align-middle">
                        <!--<el-radio v-model="subQuestion.answer.input"  :label="subQuestionIndex.toString()">选择{{subQuestionIndex+1}}:</el-radio>-->
<!--                        <el-radio v-model="subQuestion.answer.input"  :label="choice.value">选择{{subQuestionIndex+1}}:</el-radio>-->
                        <el-radio :disabled="disabled" @change="subQuestion.answer = Object.assign({},subQuestion.answer)" v-model="subQuestion.answer.input"  :label="subQuestionIndex">选择{{subQuestionIndex+1}}:</el-radio>
                    </label>
                    <div class="choice-area">
                        <span v-if="!choice.value && !choice.encodedText">&nbsp;</span>
                        <MathDisplayable v-if="choice.value != null" v-bind:formula="choice.value"/>
                        <!--<GraphDisplayable v-if="choice.encodedText != null" v-bind:value="choice.encodedText"/>-->
                        <gx-draw-graph-modal v-if="choice.encodedText != null" :dataStr="choice.encodedText" :isShow="true"/>
                        <span style="color: #f00; margin-left: 12px; " v-if="choice.isCorrect && displayAnswer">(正确答案)</span>
                    </div>
                </div>
            </template>

            <!-- 是非题  -->
            <template v-if="subQuestion.type === 'TF'">
                <div class="action-row" v-for="(choice, subQuestionIndex) of subQuestion.answer.value"
                     v-bind:key="subQuestionIndex">
                    {{subQuestionIndex+1}}:
                    <MathDisplayable v-if="choice.value != null" v-bind:formula="choice.value"/>
                    <gx-draw-graph-modal  v-if="choice.encodedText != null" :dataStr="choice.encodedText" :isShow="true"/>
                    <!--<GraphDisplayable v-if="choice.encodedText != null" v-bind:value="choice.encodedText"/>-->
                    <!--<label>
                        <el-radio name="radio" color="primary" v-bind:value="subQuestionIndex" v-bind:name="index.toString()">正确</el-radio>
                    </label>
                    <label>
                        <el-radio name="radio" color="primary" v-bind:value="subQuestionIndex" v-bind:name="index.toString()">不正确</el-radio>
                    </label>-->
                    <span style="margin-left: 30px" >  </span>
                    <el-radio-group v-model="choice.select" :disabled="disabled">
                        <el-radio color="primary" :label="true">正确</el-radio>
                        <el-radio color="primary" :label="false">不正确</el-radio>
                    </el-radio-group>

                    <br>
                    <span class="text-danger" v-if="displayAnswer">({{choice.isCorrect ? '正确' : '不正确'}})</span>
                </div>
            </template>

            <!-- 填充题 -->
            <template v-if="subQuestion.type === 'FILL_IN_THE_BLANKS'">
                <span class="text-danger">（请在下方填充格中输入）</span>

                <div v-if="fboxList && fboxList.length>0">
                    <div v-for="(item,boxIndex) in fboxList" :key="boxIndex">
                        <div>
                            <!--<MathDisplayable  :formula="'\('+inputArr[boxIndex]+'\)'" beginMath="\(" endMath="\)" />-->
                            <MathDisplayable  :formula="'\('+ (subQuestion.answer.input[boxIndex]||'')+'\)'" beginMath="\(" endMath="\)" />
                        </div>
                        <div>
                            <MathDisplayable  :formula="'\('+item+'\)'" beginMath="\(" endMath="\)" />

                            <el-input :disabled="disabled" size="small" v-model="subQuestion.answer.input[boxIndex]"

                                      @focus="(e)=>{onFocus(e,subQuestion,boxIndex)}"
                                      @input.native="valueChange" @change="(val)=>{$set(subQuestion.answer.input,boxIndex,val)}" style="width: 60%"></el-input>
                        </div>
                    </div>
                </div>
                <div v-else>没有找到输入框</div>

                <div  v-if="displayAnswer && subQuestion.answer.value" style="margin-top: 10px">
                    <!-- 数组显示 -->
                    <template v-if=" Array.isArray(subQuestion.answer.value)" >
                        <div v-for="(an,anIndex) in subQuestion.answer.value">
                            <span class="text-danger">正确答案{{anIndex+1}}:</span> <MathDisplayable v-bind:formula="an"/>
                        </div>
                    </template>
                    <!-- 字符串 -->
                    <div  v-if="typeof (subQuestion.answer.value) =='string'">
                        <MathDisplayable v-bind:formula="subQuestion.answer.value"/>
                    </div>
	            </div>
            </template>

            <!-- 直接答题 -->
            <template v-if="subQuestion.type === 'DIRECT_QUESTION'">
                请输入<el-input v-model="subQuestion.answer.input"
                             :disabled="disabled"
                             @focus="(e)=>{onFocus(e,subQuestion)}"
                             size="small" style="max-width: 360px" />
                <span class="text-danger" v-if="displayAnswer">
	        <MathDisplayable v-bind:formula="subQuestion.answer.value"/>
	      </span>
            </template>

        </div>

        <!-- 特别工具  -->
        <!--@change="onChange"-->
        <!--:fboxNums="fboxList.length"-->
        <!--@addVariable="addVariable"-->
        <!--&& (focuSubQuestion == 'FILL_IN_THE_BLANKS' || focuSubQuestion.type == 'DIRECT_QUESTION' )-->

        <tool-box @addTool="onAddTool" v-if="focuSubQuestion " />
    </div>
</template>

<script>
    import GraphDisplayable from '@/components/GraphDisplayable/GraphDisplayable.vue';
    import MathDisplayable from '@/components/MathDisplayable/MathDisplayable.vue';
    import gxDrawGraphModal from '@/components/DrawGraphModal/gxDrawGraphModal.vue';
    import {questionTypeList,editMathFag} from '@/utils/const';
    import  toolBox from '@/components/toolBox/toolBox'

    export default {
        components: {
            GraphDisplayable,
            MathDisplayable,
            gxDrawGraphModal,
            toolBox
        },
        data(){
          return{
              editMathFag,
              subQuestionSelected:"",
              inputEl:null,
              focuSubQuestion:null,
              focuIndex:0,
              questionId:'',
            }
        },
        props: {
            displayAnswer:{
                type:Boolean,
                default:false,
            },
            question:{
                type:Object,
                default: () => {
                    return {}
                }
            },
            disabled:{
                type:Boolean,
                default:false,
            },
        },//['question', 'displayAnswer'],
        filters:{
          formatQuestionType:function (t) {
              let len = questionTypeList.length;
              for(let i=0;i<len;i++){
                  let item = questionTypeList[i];
                  if(item.value==t){
                      return item.name;
                  }
              }
              return null;
          }
        },
        computed: {
            displayQuestion: {
                get() {
                    console.log("displayQuestion",this.question);
                    let id = this.question.id || this.question.uuid
                    if(this.questionId != id ){
                        this.inputEl=null;
                        this.focuSubQuestion=null;
                        this.questionId = this.question.id || this.question.uuid;
                    }

                    let questionArray = [];
                    console.log("this.question",this.question)
                    if(this.question.question){
                        let questionSplit = this.question.question.split(/\\blank{[0-9]+}/gm);
                        for (let i = 0; i < questionSplit.length; i++) {
                            questionArray.push({
                                type: 'display',
                                value: questionSplit[i]
                            });
                            if (i !== questionSplit.length - 1) {
                                questionArray.push({
                                    type: 'input',
                                    value: questionSplit[i]
                                });
                            }
                        }
                        if(!this.question.subQuestions){
                            this.question.subQuestions = []
                        }
                        this.question.subQuestions.map(sub=>{
                            if(sub.type=="FILL_IN_THE_BLANKS"){
                                if (!sub.answer.input) {
                                    // sub.answer.input = sub.answer.value.map(() => {
                                    //     return ''
                                    // });
                                    sub.answer.input = [];
                                    // sub.answer.input = this.inputArr;
                                }
                            }
                        })
                        return questionArray;
                    }
                }
            },
            // 检查输入框
            fboxList:function () {
                let questionStr = this.question.question;
                if(questionStr){
                    var lreg = new RegExp("\(\s*\\\\fbox\\s*{(.*?)\}\s*\)", "gm");
                    var arr = questionStr.match(lreg);
                    if(arr){
                        console.log(arr);
                        return arr;
                    } else {
                        if(this.question.subQuestions && this.question.subQuestions.length>0){
                            return  this.inputArr;
                        }else{

                        }
                    }
                }
                return []
            }
        },
        methods:{
            onChange:function(val){
                console.log("onChange",val)

                this.question.subQuestions.map(item=>{
                    item.answer = Object.assign({},item.answer )
                });
            },
            valueChange:function(e){
                console.log("valueChange",e);
                this.question.subQuestions.map(item=>{
                    item.answer = Object.assign({},item.answer )
                });
            },
            getAnswer:function () {
                return {
                    id:this.question.id||this.question.uuid,
                    answers: this.question.subQuestions.map((item,index) => {
                        let userInput ;
                        if(item.type=="TF"){
                            userInput = item.answer.value
                        } else {
                            userInput = item.answer.input
                        }
                        return {
                            subIndex:item.id || item.uuid,
                            type:item.type,
                            input:userInput,
                        }
                    }),
                    // subQuestions:this.question.subQuestions,
                    // subQuestionSelected:this.subQuestionSelected,
                };
            },
            setSubQuestionSelected:function (value,answerInput) {
                this.subQuestionSelected=value;
                // this.answerInput=answerInput;
            },
            // 输出答案
            outAnswer:function () {
                console.log("question",this.question)
                // console.log("answer",this.subQuestionSelected,this.answerInput)
            },

            onFocus:function(e,subQuestion,focuIndex){
                console.log("onFocus",e);
                this.inputEl = e.target;
                this.focuSubQuestion = subQuestion;
                this.focuIndex = focuIndex;
            },
            // 添加 latex
            onAddTool(value, offset, action) {
                // console.log("onAddTool", value, offset)
                // if (!this.ui.currentFocus.field) return;
                this.addText(value, -offset, action);
            },
            // 工具栏添加 符号
            addText(text, offset, action) {
                if (!offset) offset = 0;
                if(this.inputEl && this.focuSubQuestion ){
                    if(this.focuSubQuestion.type === 'DIRECT_QUESTION'){
                        this.focuSubQuestion.answer.input =  action(this.inputEl,text,offset);
                    }else  if(this.focuSubQuestion.type === 'FILL_IN_THE_BLANKS'){
                        console.log("this.inputEl",text);
                        let res =  action(this.inputEl,text,offset);
                        this.inputEl.value = res;
                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            // evt.initEvent("input", false, true);
                            this.inputEl.dispatchEvent(evt);
                        }
                        else{
                            this.inputEl.fireEvent("onchange");
                            // this.inputEl.fireEvent("oninput");
                        }


                        // this.$set(this.inputArr,this.focuIndex,res)
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "@/theme/theme-variables.scss";

    #question-display-block {

        .input {
            line-height: 18px;
            padding: 4px 8px;
            border: 1px solid #ccc;
        }

        .text-danger {
            color: #f00;
        }
        .action-row {
            /*position: relative;*/
            margin-bottom: 2rem;
            background-color: white;

            .desc {
                /*position: absolute;*/
                width: 5rem;
                margin: 0;
            }

            .preview-area {
                margin-left: 5rem;
                margin-bottom: 5rem;

                img {
                    width: 100%;
                }
            }
        }

        /*.action-area {
            !*height: 300px;*!

            border-style: solid;
            border-width: 1px;
            border-radius: 0.25rem;
            border-color: $light-pink;

            overflow-y: scroll;
        }*/

        .category-row {
            margin: 3px 0;

            &:not(:first-of-type) {
                border-top: #dddddd 1px solid;
            }
        }

        .action-row {
            margin-bottom: 2rem;
            background-color: white;
            line-height: 22px;

            .desc {
                /*position: absolute;*/
                width: 5rem;
                margin: 0;
            }

            .preview-area {
                margin-left: 5rem;
                margin-bottom: 5rem;

                img {
                    width: 100%;
                }
            }

            .choice-area {
                /*margin-left: 5rem;*/
                display: inline;
                margin-left: 5px;
            }
        }
    }
</style>
