<template>
    <!--:checked="currentValue"-->
    <!--<input class="lg_table_checkbox" ref="checkbox" type="checkbox" value="currentValue" :readOnly="disable" @change="handelClick" />-->
    <span class="lg_table_checkbox" @click="handelClick">
        <span v-show="currentValue"  ><img src="@/assets/images/icon/gou.png" /></span>
    </span>
</template>

<script>
    export default {
        name: "lgTableCheckBox",
        data(){
            return{
                currentValue: ( this.value === undefined || this.value === null ) ? false : this.value,
            }
        },
        props:{
            disable:{
                type: Boolean,
                default:false,
            },
            value:{
                type: Boolean,
                default:false,
            },
            id:{
                type: String,
            },
            label:{
                type: String,
            },
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
                this.setValue ( val );
            },
        },
        mounted(){

        },
        methods:{
            handelClick:function(e){
                this.valueChange( ! this.currentValue );
                this.$emit("checkedChange",! this.currentValue ,this.id,this.label);
                e.stopPropagation();
                e.preventDefault();
            },
            valueChange:function(value) {
                this.$emit('setValue', this.currentValue);
            },
            setValue:function(value){
                this.currentValue =  value;
            },
        }
    }
</script>

<style scoped>
    .lg_table_checkbox { width: 18px; height: 18px; display: inline-block; border-radius: 4px; border:1px solid #5a9a70; background-color: #ffffff99; cursor: pointer; vertical-align: middle;  }
    .lg_table_checkbox > span { width: 14px; height: 14px; display: block ; margin: 0 auto; line-height: 16px;  }
    .lg_table_checkbox > span img { width: 100%; height: 100%; vertical-align: middle;  }
</style>
