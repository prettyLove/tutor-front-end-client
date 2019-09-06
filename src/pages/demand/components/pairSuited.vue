<template>

    <lg-body :pageInfo="pageInfo" :ths="ths" :title="$route.name" @pageChange="setPage" class="page_user">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form  :model="reqCond" label-width="80px" >
                        <el-row :gutter="10">
                            <el-col :span="4" >
                                <el-form-item label="标题:"  >
                                    <el-input size="small" v-model="reqCond.title" @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4" >
                                <el-form-item label="内容:"  >
                                    <el-input size="small" v-model="reqCond.content" @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4" >
                                <el-form-item label="创建人:"  >
                                    <el-input size="small" v-model="reqCond.createBy" @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item label="学科">
                                    <el-select size="small" style="width: 100%;" v-model="reqCond.subject" clearable >
                                        <el-option v-for="(item ,index) in subjectList" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item label="学历">
                                    <el-select size="small" style="width: 100%;"  v-model="reqCond.educational" clearable >
                                        <el-option v-for="(item ,index) in educationalList" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item label="成绩">
                                    <el-select size="small" style="width: 100%;"  v-model="reqCond.grade" clearable >
                                        <el-option v-for="(item ,index) in gradeList" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item label="语言">
                                    <el-select size="small" style="width: 100%;"  v-model="reqCond.language" clearable >
                                        <el-option v-for="(item ,index) in langSelectList" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item size="small" label="最小工资">
                                    <el-input v-model="reqCond.minSalary" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item size="small" label="最大工资">
                                    <el-input v-model="reqCond.maxSalary" />
                                </el-form-item>
                            </el-col>

                            <el-col :span="8" >
                                <el-form-item label="创建时间:"  >
                                    <el-date-picker
                                        style="width: 100%"
                                        size="small"
                                        v-model="dateRange"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <div style="line-height: 42px; text-align: right;">
                                    <el-button class="search_box_serarch_button" type="primary" size="small" icon="el-icon-search" @click="enterSearch()">搜索</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </lgSearchBox>
            </div>
        </template>

        <template slot="table">
            <tr v-for="item in pageInfo.list" :key= item.id>
                <td>{{item.title}}</td>
                <td>{{item.name}}</td>
                <td>{{item.subject}}</td>
                <td>{{item.educational}}</td>
                <td>{{item.grade}}</td>
                <td>{{item.language}}</td>
                <td>{{item.salary}}</td>
                <td style="width: 200px;">{{item.createDate | formatTimeStamp}}</td>
                <td class="control_btns" style="width: 70px;">
                    <el-button size="small" @click="user(item)" plain>详细</el-button>
                </td>
                <td class="control_btns" style="width: 70px;">
                    <el-button size="small" @click="selectSuited(item.id)" plain >配对</el-button>
                </td>
            </tr>
        </template>

    </lg-body>
</template>

<script>
    import LgBody from "../../../components/lgBody" ;
    import lgTable from "../../../components/lgTable"
    import TablePageBase from '../../common/tablePageBase'
    import {pairApi} from '../../../api/pair';
    import lgSearchBox from "../../../components/lgSearchBox"
    import {langSelectList,educationalList,gradeList,subjectList} from "@/utils/const";

    export default {
        extends : TablePageBase,
        name: "pairSuited",
        components:{lgTable, lgSearchBox, LgBody},
        props:{
            demand:{
                type:String,
                default:"",
            },
            stateNum:{
                type:Number,
                default: 0
            },
        },
        watch:{
            stateNum(val, oldValue) {
                if (this.demand == 'TUTOR') {
                    this.reqCond.role = 'STUDENT';
                }else {
                    this.reqCond.role = 'TUTOR';
                }
                this.getPageList();
            },
        },
        data(){
            return {
                langSelectList,
                educationalList,
                gradeList,
                subjectList,
                dateRange: [],
            }
        },
        mounted() {
            let vm = this;
            // 增删改查
            vm.api.listPage = this.$api.demandRouter.listPageChild;
            vm.ths= ['标题','姓名','学科','学历', '成绩','语言要求','工资要求','创建时间','详细信息',{name:'操作',align:"center"}];
            if (this.demand == 'TUTOR') {
                this.reqCond.role = 'STUDENT';
            }else {
                this.reqCond.role = 'TUTOR';
            }
            this.reqCond.status = 0;
            // 加载列表
            vm.getPageList();
        },
        methods:{
            selectSuited:function (item) {
                this.$emit("selectSuited",item)
            },
            user:function (item) {
                console.log('item',item);
                this.$emit("user",item)
            },
            // 回车自动搜索
            enterSearch:function(e){
                if(e && e.target){
                    e.target.blur();
                }
                this.reqCond.startDate = null;
                this.reqCond.endDate = null;
                if(this.dateRange && this.dateRange.length>0){
                    this.reqCond.startDate = this.dateRange[0].getTime();
                    if(this.dateRange.length>1){
                        this.reqCond.endDate = this.dateRange[1].getTime();
                    }
                }
                this.getPageList();
            },
        }
    }
</script>

<style lang="scss" scoped>
.page_pair_suited {
    table {
        width: 100%;
        tr{
            border: 1px solid #1690ed;
            text-align: center;
        }
        td , th {
            min-height: 42px ;
            padding: 10px 4px;
        }
    }
}
</style>
