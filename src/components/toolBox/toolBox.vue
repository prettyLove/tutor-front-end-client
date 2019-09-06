<template>
    <!-- 特别工具  -->
    <div class="static-toolbox">
        <el-button size="mini" type="warning" @click="()=>{toolboxVisible=!toolboxVisible}">特别工具</el-button>

        <div style="margin-top: 2px; transition: max-height 0.5s ease-in-out 0ms;" v-bind:style="{'max-height': toolboxVisible?'900px':'0'}">
            <div class="action-area" >
                <div class="category-row" style="background-color: #fff;">
                    <el-button size="mini" type="primary" plain v-on:click="()=>{addVariable('number')}">数字</el-button>
                    <el-button size="mini" type="primary" plain
                               v-on:click="()=>{addTool(' \\begin{eval}\n\n \\end{eval} ', 13)}">计算
                    </el-button>
                    <el-button size="mini" type="primary" plain
                               v-on:click="()=>{addTool(' \\begin{math}\n\n \\end{math} ', 13)}">数学公式及符号
                    </el-button>
                    <el-button size="mini" type="primary" plain v-if="fboxNums>-1"
                               v-on:click="()=>{addTool('\\fbox{' + ('填充' + (fboxNums + 1)) + '}', 0)}">填充格
                    </el-button>
                   <!-- <template v-for="(subQuestion, index) in model.subQuestions">
                        <el-button size="small" type="primary" plain
                                   v-if="subQuestion.type === 'FILL_IN_THE_BLANKS'"
                                   class="btn btn-sm btn-primary m-1"
                                   v-on:click="()=>{addTool('\\blank{' + (index + 1) + '}', 0)}">填充格{{index + 1}}
                        </el-button>
                    </template>-->
                </div>

                <el-tabs type="card" v-model="toolboxTabActive" >
                    <el-tab-pane class="category-row" v-for="(category, categoryName) in tools" :key="categoryName" :name="categoryName" :label="category[0].categoryDisplayName">
                        <img style="cursor: pointer;"
                             v-for="tool in category"
                             v-bind:title="tool.displayName"
                             v-bind:src="tool.url"
                             v-bind:alt="tool.displayName"
                             v-on:click="()=>{addTool(tool.code, tool.offset)}"
                             v-bind:style="{height: 31 * tool.imageRatio + 'px'}">
                        <div style="height: 10px;"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

    </div>
</template>

<script>

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

    let insertString = function(origin, position, text) {
        if (!origin) return text;
        return origin.substring(0, position) + text + origin.substring(position);
    }

    let actionInput = (ref,text,offset) => {
        if (!offset) offset = 0;
        if(ref){
            let target = ref.selectionStart + text.length + offset;
            setTimeout(() => {
                ref.focus();

                if (offset != null) {
                    setTimeout(() => {
                        ref.selectionStart = target;
                        ref.selectionEnd = target;
                    }, 0)
                }
            }, 0);
            return insertString(ref.value, ref.selectionStart, text);
        }
    }

    export default {
        name: "toolBox",
        props: {
            currentFocus: {
                type: Object,
                default: ()=>{
                    return {}
                },
            },
            fboxNums:{
                type: Number,
                default: -1,
            }
        },
        data: function () {
            return {
                toolboxVisible: true,
                // activeEditIndex:"1",
                toolboxTabActive:'calculation',
                tools: [],
            }
        },
        computed: {},
        mounted(){
            let response = this.$store.getters.getQuestionConfigs;
            this.tools = response.tools;

            /*setTimeout(() => {
                this.toolboxVisible = false;
            }, 1000)*/
        },
        destroyed () {

        },
        methods: {
            // 添加
            addTool(value, offset) {
                this.$emit("addTool", value, offset, actionInput);
            },
            // 添加number
            addVariable(variable) {
                this.$emit("addVariable",variable,actionInput)
            },
        }
    }
</script>

<style lang="scss">

    @import "@/theme/theme-variables.scss";

    .static-toolbox {
        position: fixed;
        //background-color: white;
        text-align: right;
        bottom: 0;
        right: 0;
        z-index: 100;
        margin-bottom: 0 !important;
        margin-left: 0 !important;
        margin-right: 4px;
        //height: 100%;
        width: 960px;
        font-size: 1rem;
        //border: 1px solid #ccc;
        padding:2px;

        .action-area {
            box-shadow: 10px 10px 10px 10px rgba(26, 26, 72, 0.1);
            background-color: #fff;
            //height: 140px;
            text-align: left;
            border-style: solid;
            border-width: 1px;
            border-radius: 0.25rem;
            border-color: $light-pink;

            //height: 100%;
            //overflow-y: scroll;
            padding: 0 10px;

            // img {
            // 	height: 31px;
            // }
        }

        .category-row {
            margin: 3px 0;

            //&:not(:first-of-type) {
            //	border-top: #dddddd 1px solid;
            //}
            img {
                border: 1px solid rgba(255,255,255,0);
            }
            img:hover {
                border: 1px solid #ccc;
            }
        }

    }
</style>
