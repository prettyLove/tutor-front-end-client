<template>
    <div class="lg_color_picker">
        <div class="color_box" :style="{backgroundColor: currentValue}" @click="showColorPanel"></div>
        <div class="color_panel clearfix" v-if="panelVisible">
            <div class="color_box" v-for="item in COLOR_LIST" :style="{backgroundColor: item }"
                 @click="onClickColor(item)"></div>
        </div>
    </div>
    
</template>

<script>
    let COLOR_LIST = [
        "#FFFFFF",
        "#000000",
        "#8694f5",
        "#bd8cf4",
        "#fea996",
        "#8ac4f5",
        "#3dd2d4",
        "#00FFFF",
        "#00FF00",
        "#4dbf7b",
        "#59c0e4",
        "#458ce0",
        "#FFFF00",
        "#bbdf5a",
        "#f7803e",
        "#f9493e",
        "#FF0000",
        "#0000FF",
    ];
    //颜色选择
    export default {
        name: "lgColorPicker",
        data(){
            return{
                COLOR_LIST,
                panelVisible:true,
                currentValue:  this.value,
            }
        },
        props:{
            value: [String],
            defaultColor:{
                type:String,
                default:"#ffffff"
            }
        },
        model: {
            prop: 'value',
            event: 'setValue'
        },
        watch:{
            currentValue(val, oldValue) {
                this.valueChange(val);
            },
            value(val, oldValue) {
                this.currentValue =  val;
            },
        },
        mounted(){

        },
        methods:{
            showColorPanel:function () {

            },
            valueChange:function(value) {
                this.$emit('setValue', this.currentValue);
                this.$emit('change', this.currentValue);
            },
            onClickColor:function (color) {
                this.currentValue = color;
                this.valueChange(color);
            }
        },
        components:{

        }
    }
</script>

<style scoped>
    .lg_color_picker { position: relative; }
    .lg_color_picker .color_box { width: 20px; height: 20px; border: 1px solid #D4DBE0; cursor: pointer; border-radius:4px; }
    .lg_color_picker .color_box:hover { border-color: #3a8ee6; }
    .lg_color_picker .color_panel { border: 1px solid #D4DBE0; padding: 10px; background-color: #fff; margin-top: 4px; width: 260px; }
    .lg_color_picker .color_panel .color_box { float: left; margin: 0 6px 6px 0; }
</style>
