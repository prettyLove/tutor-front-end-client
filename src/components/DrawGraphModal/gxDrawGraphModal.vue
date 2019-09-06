<template>
    <!--v-on:before-open="onBeforeOpen"-->
    <!--v-on:before-close="onBeforeClose"-->
    <div name="draw-graph-modal" id="draw-graph-modal" adaptive width="100%" height="auto">

        <!--<GeoGebraContainer ref="applet" v-bind:value="base64"/>-->
        <div v-if="!isShow">{{$store.getters.getSystemConfigMapByKey('DRAW_GRAPH_HOST')}}</div>
        <div>
            <iframe ref="ifm" width="100%" height="450px" :src="$store.getters.getSystemConfigMapByKey('DRAW_GRAPH_HOST')+'?token='+token+'&webApi='+webApi"></iframe>
        </div>

        <div v-if="!isShow" style="margin-top: 10px; text-align: center;">
            <el-button size="small" plain type="info" @click="closeModal">取消</el-button>
            <el-button size="small" plain type="primary" @click="onBeforeClose">保存</el-button>
        </div>

    </div>
</template>

<script>
    import GeoGebraContainer from '@/components/GeoGebraContainer/GeoGebraContainer.vue'
    import {getToken} from "../../utils/auth";

    export default {
        name: 'gxDrawGraphModal',

        components: {
            GeoGebraContainer
        },

        props:{
            dataStr:{
                type:String,
                default:""
            },
            stateNum:{
                type: Number
            },
            graphCb:{},
            isShow:{
                type:Boolean,
                default:false
            }
        },

        data: function () {
            return {
                // base64: null,
                callback: null,
                token: "",
                webApi: ""
            }
        },
        watch:{
            base64:{
                handler(val,oldVal){
                    console.log("base--",val);
                }
            }
        },
        mounted(){
            this.token = getToken();
            this.webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
            this.init();
        },
        methods: {
            init() {
                let _self = this;
                let ifm = this.$refs.ifm;
                if(ifm){
                    if (!/*@cc_on!@*/0) { //if not IE
                        ifm.onload = function(){
                            if (_self.dataStr) {
                                if (_self.isShow) {
                                    ifm.contentWindow.hideTool(false);
                                }
                                let dataJson = {}
                                try {
                                    dataJson = JSON.parse(_self.dataStr);
                                }catch (e) {
                                    console.log(e)
                                }
                                ifm.contentWindow.setDataList(dataJson);
                            }
                        };
                    } else {
                        ifm.onreadystatechange = function(){
                            if (ifm.readyState == "complete"){
                                if (_self.dataStr) {
                                    if (this.isShow) {
                                        ifm.contentWindow.hideTool();
                                    }
                                    let dataJson = {}
                                    try {
                                        dataJson = JSON.parse(_self.dataStr);
                                    }catch (e) {
                                        console.log(e)
                                    }
                                    ifm.contentWindow.setDataList(dataJson);
                                }
                            }
                        };
                    }
                }
            },
            onBeforeOpen(event) {
                this.dataStr = event.params.initValue;
                this.callback = event.params.callback;
            },

            onBeforeClose(event) {
                console.log("onBeforeClose" );
                let dataOut = this.$refs.ifm.contentWindow.getDataList();
                if(this.graphCb){
                    this.graphCb(JSON.stringify(dataOut));
                }
            },
            closeModal:function () {
                this.$emit("close")
            }
        }
    }
</script>

<style lang="scss">
    #draw-graph-modal {
        /*background: rgba(0, 0, 0, 0.8);*/

        .v--modal {
            padding: 10px;
            overflow-y: auto;
            max-height: 90%;
        }
    }
</style>
