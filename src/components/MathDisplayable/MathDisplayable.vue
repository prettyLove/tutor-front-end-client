<template>
    <div class="math-displayable">
        <!--<div style="padding: 10px 0;">latex: {{formula}} </div>-->
        <!--<span v-html="renderOut(formula)"></span>-->
        <!--<span >{{formula}}</span>-->
        <!--<span >{{formula}}</span>-->
         <span v-for="item in latexList"  >
             <span v-if="item.type=='latex'" v-html="renderKatex(item.value)"></span>
             <!--<span v-if="item.type=='latex'" >{{getLatexInFormula(item.value)}}</span>-->
             <span v-if="item.type=='txt'" >{{item.value}}</span>
         </span>
    </div>
</template>

<script>
    import katex from 'katex';

    export default {
        props: {
            formula: {
                type: String,
                default:null,
            },
            append: {
                type: String,
                default:null,
            },
            beginMath:{
                type: String,
                default:'\\\\\\(',
            },
            endMath:{
                type: String,
                default:'\\\\\\)',
            },
        },
        watch: {
            formula() {
                this.parseFormulaLatex();
            }
        },
        data(){
            return {
                formulaOpacity:0,
                latexList:[],
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    // {left: "\\[", right: "\\]", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false}
                ]
            }
        },
        mounted() {
            this.parseFormulaLatex();
        },
        methods: {
            renderOut:function(latex){
                return katex.render(latex,delimiters);
            },
            renderKatex:function(latex){
                var texString = this.getLatexInFormula(latex);
                // 替换自定义内容 否则渲染里会出错
                texString = texString.replace(/\\number\{.*?\}/g, " IN ");
                texString = texString.replace(/\\begin\{eval\}/g, " OUT = ( ");
                texString = texString.replace(/\\end\{eval\}/g, " ) ");
                // console.log("texString",texString)
                var out = ""
                // 捕捉转换时的错误消息
                try {
                    out = katex.renderToString(texString);
                } catch (e) {
                    if (e instanceof katex.ParseError) {
                        // KaTeX can't parse the expression
                        out = ("<span style='color: #f00;'>[ Error in LaTeX [ " + latex + " ] -> " + e.message+"]</span>")
                        // .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    } else {
                        throw e;  // other error
                    }
                }
                return out;
            },
            addList:function(str,type){
                if(str&&str.length>0){
                    this.latexList.push({
                        type:type,
                        value:str,
                    });
                }
            },
            parseFormulaLatex: function () {
                this.latexList = []
                // 把字符串打散,公式和字符分开渲染,解决不换行问题
                if (this.formula) {
                    let tmpstr = this.formula;
                    var lreg = new RegExp( '('+this.beginMath+'(.|\\s)*?'+this.endMath + ')|(\\\$(.|\\\\s)*?\\\$'+')|('+'\\\\\\\((.|\\\\\\\\s)*?\\\\\\\)'+')' , "gm")
                    // var lreg = new RegExp('\\\\\\\((.|\\\\\\\\s)*?\\\\\\\)', "gm");
                    // var lreg = new RegExp(('\\\$(.|\\\\s)*?\\\$'), "gm");
                    var arr = this.formula.match(lreg);
                    console.log("arr",arr);
                    var lastIndex = 0;
                    if(arr){
                        for(let i=0;i<arr.length; i++){
                            let item = arr[i];
                            let index = tmpstr.indexOf(item)
                            this.addList(tmpstr.substr(0,index),"txt");
                            // this.addList("["+lastIndex+"--"+index+"]","txt");
                            this.addList(item,"latex");
                            // lastIndex = index+item.length;
                            tmpstr = tmpstr.substr(index+item.length)
                        }
                        this.addList(tmpstr,"txt");
                    }else{
                        this.addList(tmpstr,"txt");
                    }
                }
            },
            getLatexInFormula:function (formula) {
                // 把 latex 的头和尾删除  \( \)
                var res = formula;
                if(res.indexOf('$$')==0){
                    return res.substr(2,res.length-4);
                }
                if(res.indexOf('$')==0){
                    return res.substr(1,res.length-2);
                }
                if(res.indexOf("\\\(")==0){
                    return res.substr(2,res.length-4);
                }
                // var lreg = new RegExp( '\\\\\\(' , "gm" )
                var lreg = new RegExp( this.beginMath , "gm" )
                // var rreg = new RegExp( '\\\\\\)' , "gm" )
                var rreg = new RegExp( this.endMath , "gm" )
                res = res.replace(lreg,"");
                res = res.replace(rreg,"");
                // var dreg = new RegExp( "\\\$" , "gm" );
                // var dreg = new RegExp( "\\\$" , "gm" );
                // res = res.replace(dreg,"");
                return res
            },
        }
    }
</script>

<style lang="scss">
    .math-displayable {
        display: inline-block;
    }
    .MathJax_Display {
        margin: 0 !important;
        text-align: left !important;
    }
</style>
