<template>
    <el-form-item :label="label" :label-width="labelWidth">
        <el-input ref="input"
                  v-model="currentValue"
                  :type="type"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @change="handleChange"
                  :auto-complete="autoComplete"
                  :style=" (inputWidth?'width:'+inputWidth+' ; ':' ') "
                  :readonly="readonly"
                  :disabled="isDisabled"
                  :placeholder="placeholder"/>
    </el-form-item>
</template>

<script>
    export default {
        name: "lgInput",
        data(){
            return {
                focused:false,
                currentValue: ( this.value === undefined || this.value === null ) ? '' : this.value,
            }
        },
        props:{
            value: [String, Number],
            label:String,
            readonly: Boolean,
            isDisabled:{
                type: Boolean,
                default:false,
            },
            labelWidth:{
                type: String,
                default: '120px'
            },
            type: {
                type: String,
                default: 'text'
            },
            autoComplete: {
                type: String,
                default: 'off'
            },
            inputWidth: {
                type: String,
                default: null,
            },
            placeholder: {
                type: String,
                default: "",
            },
        },
        model: {
            prop: 'value',
            event: 'setValue'
        },

        mounted(){

        },
        watch:{
            currentValue(val, oldValue) {
                this.valueChange(val);
            },
            value(val, oldValue) {
                this.currentValue =  val;
            },
        },

        methods:{
            valueChange:function(value) {
                this.$emit('setValue', this.currentValue);
            },
            setValue:function(value){
                this.currentValue =  value;
            },
            handleFocus(event) {
                this.focused = true;
                this.$emit('focus', event);
            },
            handleBlur(event) {
                this.focused = false;
                this.$emit('blur', event);
            },
            handleChange(event) {
                this.$emit('change', event);
            },
        }
    }
</script>

<style scoped>

</style>
