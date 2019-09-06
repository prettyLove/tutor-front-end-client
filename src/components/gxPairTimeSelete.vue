<template>
    <div class="page_pairtime_selete">
        <div v-for="(item,index) in value" class="page_pairtime_sty">
            <span class="pairtime_index">{{index+1}}:</span>
            <el-select  v-model="item.weekday" style="width: 18%" >
                <el-option v-for="(item,index) in weekType" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-time-picker
                is-range
                v-model="timeValue"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围" style="width: 40%">
            </el-time-picker>
<!--            <el-form-item label="补习时长：" class="pairtime_formitem">-->
                <el-input  v-model="item.hours" type="number" placeholder="请输入时长" class="pairtime_formitem"></el-input>
<!--            </el-form-item>-->
<!--            <el-select v-model="item.startTime">-->
<!--                <el-option v-for="(item,index) in lengthOfTutoring" :key="index" :label="item.name" :value="item.value"></el-option>-->
<!--            </el-select>-->
<!--            <el-time-picker v-model="item.startTime" :picker-options="{selectableRange: '06:30:00 - 23:30:00'}" value-format="hh:mm:ss" style="width: 120px" placeholder="开始时间"></el-time-picker>-->
<!--            <el-time-picker arrow-control v-model="item.endTime" :picker-options="{selectableRange: '06:30:00 - 23:30:00'}" value-format="hh:mm:ss" style="width: 120px" placeholder="结束时间"></el-time-picker>-->
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
    import {weekType,subjectList,lengthOfTutoring} from "@/utils/const";
    export default {
        extends:viewBase,
        name: "gxPairTimeSelete",
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
                lengthOfTutoring,
                timeValue: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
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
    .page_pairtime_selete{
        width: 100%;
        .page_pairtime_sty{
            display: flex;
            .pairtime_index{display:inline-block;width:20px}
            .elbtnDel{background-color: #f99;margin-left: 20px}
            .elbtnAdd{background-color: #c6dcce}
            .pairtime_formitem{width: 20%}
        }

    }
</style>
