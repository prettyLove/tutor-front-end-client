<template>
    <div class="page_lessiontime_selete">
        <div v-for="(item,index) in value" >
            <span class="lessiontime_index">{{index+1}}:</span>

            week:
            <el-select  v-model="item.weekday" >
                <el-option v-for="(item,index) in weekType" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-time-picker v-model="item.startTime" :picker-options="{selectableRange: '06:30:00 - 23:30:00'}" value-format="hh:mm:ss" style="width: 120px" placeholder="开始时间"></el-time-picker>
            <el-time-picker arrow-control v-model="item.endTime" :picker-options="{selectableRange: '06:30:00 - 23:30:00'}" value-format="hh:mm:ss" style="width: 120px" placeholder="结束时间"></el-time-picker>
<!--           {{item.startTime}}-{{item.endTime}}-->
<!--            科目:-->
<!--            <el-select  v-model="item.subject" >-->
<!--                <el-option v-for="(item,index) in subjectList" :key="index" :label="item.name" :value="item.value"></el-option>-->
<!--            </el-select>-->
            <el-button @click="removeItem(index)" class="elbtnDel" v-if="index>0" >删除</el-button>

        </div>
        <el-button @click="addItem" class="elbtnAdd" >添加</el-button>
    </div>
</template>

<script>
    import viewBase from '@/pages/common/viewBase'
    import {weekType,subjectList} from "@/utils/const";
    export default {
        extends:viewBase,
        name: "gxLessionTimeSelete",
        components:{},
        props:{
            value:{
                type:Array,
                default: [],
            }
        },
        model: {
            prop: 'value',
            event: 'setValue'
        },
        data(){
            return {
                subjectList,
                weekType,
                // dataList:[
                //     // {
                //     //     weekday:"Sunday",
                //     //     startTime:"",
                //     //     endTime:"",
                //     //     subject:"English"
                //     // }
                // ],
                currentValue: (this.value === undefined || this.value === null) ? [] : this.value,
            }
        },
        mounted() {
            this.initList();
        },
        methods:{
            initList:function(){
                if(this.currentValue.length<1){
                    this.setValue([
                        {
                            weekday:"Sunday",
                            startTime:"",
                            endTime:"",
                            subject:"English"
                        }
                    ])
                }
            },
            addItem:function () {
                this.currentValue.push({
                    name:"",
                    startTime:null,
                    endTime:null,
                    subject:""
                })
            },
            removeItem:function (index) {
                if(this.currentValue.length>1){
                    this.currentValue.splice(index,1)
                }
            },
            valueChange: function (value) {
                this.$emit('setValue', this.currentValue);
            },
            setValue: function (value) {
                this.currentValue = value;
            },

        },
        watch:{
            currentValue(val, oldValue) {
                this.valueChange(val);
            },
            value(val, oldValue) {
                this.currentValue = val;
            },
        },

    }
</script>

<style lang="scss">
    .page_lessiontime_selete{
        .lessiontime_index{display:inline-block;width:20px}
        .elbtnDel{background-color: #f99;margin-left: 20px}
        .elbtnAdd{background-color: #c6dcce}
    }
</style>
