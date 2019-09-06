<template>
    <div class="table_box">
        <div>
            id:<el-input-number v-model="form.id" :min="1" :max="240" label="id" @change="sendIdNum()"></el-input-number>
        </div>
        <GeoGebraContainer ref="applet" v-bind:value="base64" v-if="visible"/>
        <div style="margin-top: 10px; text-align: center;">
            <!--<el-button size="small" plain type="info" @click="closeModal">取消</el-button>-->
            <!--<el-button size="small" plain type="primary" @click="onBeforeClose">提交</el-button>-->
        </div>
    </div>
    
</template>

<script>
    import GeoGebraContainer from "../components/GeoGebraContainer/GeoGebraContainer";
    import {questionApi} from '../api/question';
    export default {
        name: "convertDiagram",
        components:{GeoGebraContainer},
        data(){
            return {
                base64:"",
                visible :false,
                diagram:null,
                idNum:1,
                form:{id:1}
            }
        },
        mounted() {
            this.getList();
        },
        methods:{
            sendIdNum: function () {
                this.idNum = this.form.id;
                this.getList();
            },

            runItem:function(item,cb){
                console.log("run time",this.idNum)
                this.visible = false;
                this.diagram = item.encodedText;
                this.base64 = this.diagram;
                setTimeout(()=>{
                    this.visible = true;
                },100)

                setTimeout(()=>{
                    let xmlData = this.$refs.applet.getXML();
                    questionApi.saveQuestionDiagramXml({id: this.idNum,xmlText:xmlData}).then((response) => {
                        console.log("success",response);
                        cb()
                    });

                },4000);
            },

            getList:function () {
                questionApi.getQuestionDiagramList({id:this.idNum}).then((result) => {
                    console.log("load item",this.idNum)
                    if (result.code == this.$success) {
                        let item = result.data;
                        if (item) {
                            this.visible = false;
                            this.diagram = item.encodedText;
                            this.base64 = this.diagram;
                            setTimeout(()=>{
                                this.visible = true;
                            },1)

                            /*this.diagram = item.encodedText;
                            this.runItem(item, () => {
                                if (this.idNum < 240) {
                                    this.idNum++;
                                    this.getList();
                                }
                            });*/
                        } else if (this.idNum < 240) {
                            this.idNum++;
                            this.getList();
                        }

                    } else {
                        this.$alert(result.message||"失败", {
                            confirmButtonText: '确定',
                        });
                    }
                }).catch((error) => {
                    this.$message({
                        type: 'error',
                        message: "操作失败"
                    });
                })
            },
            onBeforeClose(event) {
                console.log("onBeforeClose" );

                    let xmlData = this.$refs.applet.getXML();
                    saveQuestionDiagramXml({id: this.diagram.id,xmlText:xmlData}).then((response) => {
                        console.log("success",response);
                    });
                },
        }
    }
</script>

<style scoped>

</style>
