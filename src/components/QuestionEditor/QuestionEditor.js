import Vue from 'vue'
import {questionTypeList,editMathFag} from '@/utils/const';
import viewBase from "@/pages/common/viewBase";
import gxDrawGraphModal from '@/components/DrawGraphModal/gxDrawGraphModal.vue'
import MathDisplayable from '@/components/MathDisplayable/MathDisplayable.vue'
import toolBox from '@/components/toolBox/toolBox'

const typeKeyToValue = {
    'number': 'number',
    'object': '物件',
    'verb': '动词'
}

const typeKeyToShortKey = {
    'number': 'number',
    'object': 'O',
    'verb': 'V'
}

const typeValueToKey = {
    '数字': 'number',
    '物件': 'object',
    '动词': 'verb'
}

export default {
    extends:  viewBase,
    dependencies: [],
    components: { gxDrawGraphModal,MathDisplayable,toolBox },
    name: 'Question',
    props: ['tools', 'value'],

    data: function () {
        return {
            editMathFag,
            questionTypeList,
            formLabelWidth: '100px',
            ui: {
                preview: null,
                currentFocus: {
                    field: null,
                    index: null,
                    subIndex: null
                },
                ref: null,
                numberOfQuestion: 1
            },
            model: {
                question: null,
                graph: [],
                rule: [],
                subQuestions: [{
                    type: 'TF',
                    numberOfOptions: 1,
                    choice: [{
                        value: null,
                        isCorrect: true,
                        graph: null
                    }],
                    answer: null,
                }]
            },
            activeEditIndex:"1",
            toolboxTabActive:'calculation',
            toolboxVisible:true,
            dialogGraphVisible:false,
            graphEdit:"",
            stateNum:0,
            graphCb:null,
        }
    },

    computed: {
        typeKeyToValue: function () {
            return typeKeyToValue;
        },

        // 检查输入框
        fboxList:function () {
            let questionStr = this.model.question;
            console.log("questionStr",questionStr);
            if(questionStr){
                var lreg = new RegExp("\(\s*\\\\fbox\\s*{(.*?)\}\s*\)", "gm");
                var arr = questionStr.match(lreg);
                if(arr){
                    console.log(arr);
                    return arr;
                }
            }
            return []
        }
    },

    mounted() {

    },

    methods: {
        // 添加问题选择项
        addQuestionChoice:function(subQuestion){
            console.log("addQuestionChoice",subQuestion);
            subQuestion.choice.push({});
            this.onChange();
        },
        // 删除选择项
        deleteQuestionChoice:function(subQuestion,index){
            //待处理
            /*this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log("addQuestionChoice",subQuestion,index);
                subQuestion.choice.splice(index, 1);
            })*/
            console.log("addQuestionChoice",subQuestion,index);
            subQuestion.choice.splice(index, 1);
            this.onChange();
        },
        // 删除问题
        removeQuestionCard:function (subQuestions,index) {
            console.log("removeQuestionCard",subQuestions,index);
            subQuestions.splice(index, 1);
            this.onChange();
        },
        addNewQuestion:function(subQuestions){
            subQuestions.push({
                value: null,
                isCorrect: false,
                graph: null,
                choice:[{}],
                type : 'TF',
            });
            this.onChange();
        },

        // 初始化
        init(question) {
            console.log("init question",question);
            this.model.question = question.question;
            let subQuestions = [];
            question.subQuestions.map(subQuestion => {
                if (subQuestion.type === 'TF' || subQuestion.type === 'MC') {
                    subQuestions.push({
                        type: subQuestion.type,
                        numberOfOptions: subQuestion.answer.numAns,
                        choice: subQuestion.answer.value.map(choice => {
                            return {
                                value: choice.value,
                                isCorrect: choice.isCorrect,
                                graph: choice.encodedText
                            }
                        }),
                        answerInput:[],
                    })
                } else if (subQuestion.type === 'FILL_IN_THE_BLANKS') {
                    // 填充题
                    subQuestions.push({
                        type: subQuestion.type,
                        choice: Array.isArray(subQuestion.answer.value) ? subQuestion.answer.value : [],
                        // answer: subQuestion.answer.value,
                        answerInput:[],
                    })
                }

            })

            this.model.subQuestions = subQuestions;
            this.ui.numberOfQuestion = subQuestions.length;
            this.syncVariableState();

            let ruleModel = JSON.parse(JSON.stringify(this.model.rule)).map(rule => {
                rule.value.min = question.questionConstrain[rule.text].min;
                rule.value.max = question.questionConstrain[rule.text].max;
                rule.value.interval = question.questionConstrain[rule.text].interval;

                return rule;
            });

            this.$set(this.model, 'rule', ruleModel);
            this.model.graph = question.questionDiagrams.map(question => question.encodedText);
            this.onChange();
        },
        // 关闭图表弹窗
        closeGraphDialog:function(){
            console.log("closeGraphDialog")
            this.dialogGraphVisible = false;
        },
        // 打开图表弹窗
        onOpenDrawGraphModal(type, index, subIndex) {
            console.log(type, index, subIndex)
            if (type === 'question') {
                if (index == null) {
                    console.log("进入index")
                    this.graphCb = (drawObj) => {
                        this.model.graph.push(drawObj);
                        this.onChange();
                        this.graphCb = null;
                        console.log("graphCb")
                        this.dialogGraphVisible = false;
                        this.$message({
                            type: 'success',
                            message: "图表已修改"
                        });
                    }
                    this.graphEdit = "";
                    this.dialogGraphVisible = true;
                    /* this.$modal.show('draw-graph-modal', {
                         callback: (base64Src) => {
                             this.model.graph.push(base64Src);
                             this.onChange();
                         }
                     });*/
                } else {
                    this.graphEdit = this.model.graph[index];
                    this.graphCb = (drawObj) => {
                        this.$set(this.model.graph, index, drawObj);
                        this.onChange();
                        this.graphCb = null;
                        console.log("graphCb xg")
                        this.dialogGraphVisible = false;
                        this.$message({
                            type: 'success',
                            message: "图表已修改"
                        });
                    }
                    this.dialogGraphVisible = true;

                }
            } else if (type === 'mc' || type === 'tf') {
                this.graphEdit = this.model.subQuestions[index].choice[subIndex].graph;
                this.graphCb =  (base64Src) => {
                    this.$set(this.model.subQuestions[index].choice[subIndex], 'graph', base64Src);
                    this.onChange();
                    this.graphCb = null;
                    this.dialogGraphVisible = false;
                    this.$message({
                        type: 'success',
                        message: "图表已修改"
                    });
                }
                this.dialogGraphVisible = true;

            }
        },

        onDeleteGraph(type, index, subIndex) {
            if (type === 'question') {
                this.model.graph.splice(index, 1);
            } else if (type === 'mc' || type === 'tf') {
                this.$set(this.model.subQuestions[index].choice[subIndex], 'graph', null);
            }
            this.onChange();
        },

        reset() {
            this.ui = {
                preview: null,
                currentFocus: {
                    field: null,
                    index: null,
                    subIndex: null
                },
                ref: null,
                numberOfQuestion: 1
            };

            this.model = {
                question: null,
                graph: [],
                rule: [],
                subQuestions: [{
                    type: 'TF',
                    numberOfOptions: 1,
                    choice: [{
                        value: null,
                        isCorrect: true,
                        graph: null
                    }],
                    answer: null,
                }]
            };
        },

        onChange() {
            this.$emit('input', this.model)
        },

        onChangeMC(subQuestion, index) {
            for (let i = 0; i < subQuestion.choice.length; i++) {
                if (i !== index)
                    subQuestion.choice[i].isCorrect = false
            }
            this.onChange();
        },

        onFocus(item, index, subIndex) {
            console.log("onFocus",item, index, subIndex)
            this.ui.currentFocus.field = item;
            this.ui.currentFocus.index = index;
            this.ui.currentFocus.subIndex = subIndex;
        },

        onTextfieldChange() {
            console.log(this.model)
            this.syncVariableState();
            this.onChange();
        },

        onQuestionTypeChange(subQuestion) {
            console.log(JSON.parse(JSON.stringify(subQuestion)))
            if (subQuestion.type === 'MC') {
                Vue.set(subQuestion, 'numberOfOptions', 4);
                Vue.set(subQuestion, 'choice', [{
                    value: null,
                    isCorrect: true,
                    graph: null
                }, {
                    value: null,
                    isCorrect: false,
                    graph: null
                }, {
                    value: null,
                    isCorrect: false,
                    graph: null
                }, {
                    value: null,
                    isCorrect: false,
                    graph: null
                }]);
            } else  if (subQuestion.type === 'FILL_IN_THE_BLANKS') {
                Vue.set(subQuestion, 'choice',[])
            }

            this.onChange();
        },

        // 问题的选择列表改变
        onChoiceChange(index) {
            if (this.model.subQuestions[index].choice.length > this.model.subQuestions[index].numberOfOptions) {
                this.model.subQuestions[index].choice = this.model.subQuestions[index].choice.slice(0, this.model.subQuestions[index].numberOfOptions);
            } else {
                let array = JSON.parse(JSON.stringify(this.model.subQuestions[index].choice));

                for (let i = this.model.subQuestions[index].choice.length; i < this.model.subQuestions[index].numberOfOptions; i++) {
                    array.push({
                        value: null,
                        isCorrect: false,
                        graph: null
                    });
                }

                this.model.subQuestions[index].choice = array;
            }

            this.onChange();
        },

        // 添加 number
        addVariable(variable,action) {
            if (!this.ui.currentFocus.field) return;

            let existing = this.model.rule.filter(val => val.type === variable);
            let count = existing.length ? existing[existing.length - 1].count + 1 : 1;

            this.model.rule.push({
                type: variable,
                count: count,
                text: '\\' + typeKeyToShortKey[variable] + '{' + count + '}',
                value: {
                    min: null,
                    max: null,
                    interval: null,
                    value: null
                }
            })

            this.addText('\\' + typeKeyToValue[variable] + '{' + count + '}',0,action);
        },
        // 添加 latex
        onAddTool(value, offset, action) {
            console.log("onAddTool", value, offset)
            if (!this.ui.currentFocus.field) return;
            this.addText(value, -offset, action);
        },
        // 工具栏添加 符号
        addText(text, offset, action) {
            if (!offset) offset = 0;

            if (this.ui.currentFocus.field === 'questionField') {
                console.log("field",this.$refs.questionField.$refs.textarea)
                this.model.question = action(this.$refs.questionField.$refs.textarea,text,offset);
            } else if (this.ui.currentFocus.field) {
                if (this.ui.currentFocus.field.substring(0, 11) === 'fillInField') {
                    // 填充题目
                    let inputEl = this.$refs[this.ui.currentFocus.field];
                    let index = this.ui.currentFocus.index;
                    let subIndex = this.ui.currentFocus.subIndex;
                    this.model.subQuestions[subIndex].choice[index] = action(inputEl[0].$refs.input,text,offset);
                    this.model = Object.assign({},this.model); // 解决不更新问题
                } else if (this.ui.currentFocus.field.substring(0, 11) === 'answerField') {
                    let index = this.ui.currentFocus.field.substring(11);
                    this.model.subQuestions[index].answer = action(this.$refs[this.ui.currentFocus.field][0].$refs.input,text,offset);
                } else if (this.ui.currentFocus.field.substring(0, 11) === 'optionField') {
                    let index = this.ui.currentFocus.field.substring(11);
                    let inputEl = this.$refs[this.ui.currentFocus.field][this.ui.currentFocus.subIndex]
                    this.model.subQuestions[index].choice[this.ui.currentFocus.subIndex].value = action(inputEl.$refs.input,text,offset);
                }
            }

            this.onChange();
        },

        getRules: function (type) {
            return this.model.rule.filter(val => val.type === type)
        },

        syncVariableState() {
            let newState = [];

            outer: for (let i = 0; i < this.model.rule.length; i++) {
                let rule = this.model.rule[i];

                if (this.model.question && this.model.question.indexOf('\\' + typeKeyToValue[rule.type] + '{' + rule.count + '}') != -1) {
                    newState.push(rule);
                } else {
                    for (let j = 0; j < this.model.subQuestions.length; j++) {
                        let subQuestion = this.model.subQuestions[j];

                        if (subQuestion.answer && subQuestion.answer.indexOf('\\' + typeKeyToValue[rule.type] + '{' + rule.count + '}') != -1) {
                            newState.push(rule);
                            continue outer;
                        }

                        for (let k = 0; k < subQuestion.choice.length; k++) {
                            let choice = subQuestion.choice[k];
                            if (choice.value && choice.value.indexOf('\\' + typeKeyToValue[rule.type] + rule.count + '{' + '}') != -1) {
                                newState.push(rule);
                                continue outer;
                            }
                        }
                    }
                }
            }

            let match = (this.model.question || '').match(/\\number{[0-9]+}/gm);

            (match || []).map(variableName => {
                let key = 'number';
                let count = Number(variableName.substring(key.length + 2, variableName.length - 1));

                if (newState.filter(obj => obj.count === count).length === 0) {
                    newState.push({
                        count: count,
                        text: variableName,
                        type: key,
                        value: {
                            interval: null,
                            max: null,
                            min: null,
                            value: null
                        }
                    })
                }
            })

            this.model.rule = newState;
        }
    }
}
