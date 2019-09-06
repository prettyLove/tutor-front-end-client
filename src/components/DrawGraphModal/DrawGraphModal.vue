<template>
    <!--v-on:before-open="onBeforeOpen"-->
    <!--v-on:before-close="onBeforeClose"-->
    <div name="draw-graph-modal" id="draw-graph-modal"

         adaptive width="100%" height="auto">

        <GeoGebraContainer ref="applet" v-bind:value="base64"/>

        <div style="margin-top: 10px; text-align: center;">
            <el-button size="small" plain type="info" @click="closeModal">取消</el-button>
            <el-button size="small" plain type="primary" @click="onBeforeClose">提交</el-button>
        </div>

    </div>
</template>

<script>
    import GeoGebraContainer from '@/components/GeoGebraContainer/GeoGebraContainer.vue'

    export default {
        name: 'DrawGraphModal',

        components: {
            GeoGebraContainer
        },

        props:{
            base64:{
                type:String,
                default:""
            },
            stateNum:{
                type: Number
            },
            graphCb:{}
        },

        data: function () {
            return {
                // base64: null,
                callback: null
            }
        },
        mounted(){

        },
        methods: {
            onBeforeOpen(event) {
                this.base64 = event.params.initValue;
                this.callback = event.params.callback;
            },

            onBeforeClose(event) {
                console.log("onBeforeClose" );
                // if (this.callback) {
                //     this.$refs.applet.getBase64().then((response) => {
                //         this.callback(response);
                //     });
                // }
                if(this.graphCb){
                    this.$refs.applet.getBase64().then((response) => {
                        this.graphCb(response);
                    });
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
