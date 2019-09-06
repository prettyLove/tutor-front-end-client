<template>
    <el-form-item :label="label" :label-width="labelWidth">
        <el-select v-model="currentValue" :disabled="disabled">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
</template>

<script>
    export default {
        name: "lgSelect",
        data(){
            return {
                currentValue: ( this.value === undefined || this.value === null ) ? '' : this.value,
                defaultFormLabelWidth:'120px',
                currentOptions : ( this.options === undefined || this.options === null ) ? [] : this.options,
            }
        },
        props:{
            value: [String, Number],
            label:String,
            options:Array,
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
            disabled: {
                type: Boolean,
                default: false
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
                this.handleChange(val);
            },
            value(val, oldValue) {
                this.currentValue =  val;
            },
        },

        methods:{
            handleChange(value) {
                // this.currentValue =  value;
                this.$emit('setValue', this.currentValue);
            },
        }
    }
</script>

<style scoped>

</style>
