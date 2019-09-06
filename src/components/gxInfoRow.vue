<template>
    <div class="com_gx_inforow clearfix">
        <div class="label" v-bind:style="{width:labelW+'px'}">{{label}}</div>
        <div class="content" v-bind:style="{marginLeft:(labelW+6)+'px'}">{{content}}</div>
    </div>
</template>

<script>
    export default {
        name: "gxInfoRow",
        props: {
            labelW:{
                type:Number,
                default:80,
            },
            label:{
                type: String,
                default: ""
            },
            content:{
                type: String,
                default: ""
            }
        },
        data(){
            return {

            }
        }

    }
</script>

<style scoped lang="scss">
    .com_gx_inforow{
        line-height: 34px;
        border-bottom: 1px solid #e3f2e3;
        .label {
            float: left;
            text-align: right;
        }
        .content {

        }
    }
</style>
