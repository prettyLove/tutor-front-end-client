<template>
        <el-date-picker
            :size="size"
            v-model="value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateTimeChange"
            align="right">
        </el-date-picker>
</template>

<script>
    // 更新时间选择
    export default {
        name: "lgDateTime",
        props:{
            beforeDate:{
                type:String,
                default:"",
            }          //时间回显 把date String 传进来即可
            ,
            size:{
                type:String,
                default: null,
            }
        },
        data(){
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近 30 分钟',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 1800 * 1000  );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 1 小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000  );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 3 小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 3 );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 6 小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 6 );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 12 小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 12 );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 1 天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 );
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 3 天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近 7 天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近 30 天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value: [],
            }
        },
        watch:{
            // 监听 beforeDate 发生改变时触发
            beforeDate:{
                handler(val, oldName) {
                    this.value = val.split("~");
                },
                immediate: true,  //实时
                deep:true,        //深度
            },
        },
        methods:{
            dateTimeChange:function () {
                let dateTime = "";
                if(this.value){
                    let start = this.$options.filters['formatTimeStamp'](this.value[0].getTime());
                    let end = this.$options.filters['formatTimeStamp'](this.value[1].getTime());
                    dateTime = start+"~"+end;
                }
                // 修改改为三个参数
                let st = null;
                let et = null;
                if(this.value && this.value.length>1){
                    st = this.value[0].getTime();
                    et = this.value[1].getTime();
                }
                this.$emit("dateTimeChange",dateTime,st,et);
            }
        },
    }
</script>

<style scoped>

</style>
