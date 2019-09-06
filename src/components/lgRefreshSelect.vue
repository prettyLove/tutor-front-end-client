<template>
    <el-select  v-model="currentValue">
        <el-option v-for="op in options" :label="op+'s'" :key="op" :value="op"></el-option>
    </el-select>
</template>

<script>
    // 更新时间选择
    export default {
        name: "lgRefreshSelect",
        data(){
            return {
                currentValue: ( this.value === undefined || this.value === null ) ? '' : this.value,
                options:[30,60,90]
            }
        },
        props: {
            value: [String, Number],
        },
        model: {
            prop: 'value',
            event: 'setValue'
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
        },
    }
</script>

<style scoped>

</style>
