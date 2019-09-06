<template>
    <div class="page_pair table_box">
        <div class="cont">
            <el-tabs v-model="sendAndAccept">
                <el-tab-pane label="发送请求" name="first">
                    <table>
                        <tr>
                            <th>标题</th>
                            <th>姓名</th>
                            <th>学科</th>
                            <th>学历</th>
                            <th>成绩</th>
                            <th>语言</th>
                            <th>详细</th>
                            <th>工资</th>
                            <th>发送时间</th>
                            <th>配对状态</th>
                        </tr>
                        <tr v-for="item in pageInfo.list" :key="item.id">
                            <td style="width: 140px;">{{item.title}}</td>
                            <td style="width: 140px;">{{item.name}}</td>
                            <td style="width: 140px;">{{item.subject}}</td>
                            <td style="width: 140px;">{{item.educational}}</td>
                            <td style="width: 140px;">{{item.grade}}</td>
                            <td style="width: 140px;">{{item.language}}</td>
                            <td style="width: 140px;">{{item.content}}</td>
                            <td style="width: 140px;">{{item.salary}}</td>
                            <td style="width: 140px;">{{item.pairDate | formatTimeStamp}}</td>
                            <td class="control_btns" style="width: 110px;">
                                <el-tag v-if="item.pairStatus == 0">待回复</el-tag>
                                <el-tag type="success" v-if="item.pairStatus == 1">配对成功</el-tag>
                                <el-tag type="success" v-if="item.pairStatus == 2">配对成功</el-tag>
                                <el-tag type="danger" v-if="item.pairStatus == -1">配对失败</el-tag>
                                <el-tag type="info" v-if="item.pairStatus == -2">配对解除</el-tag>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <!--翻页组件-->
                        <el-pagination
                            :visible.sync="!pageInfo.loading"
                            layout="prev, pager, next"
                            :current-page="pageInfo.pageNum"
                            :total="pageInfo.total"
                            @current-change="setPage">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="接收请求" name="second">
                    <table>
                        <tr>
                            <th>标题</th>
                            <th>姓名</th>
                            <th>学科</th>
                            <th>学历</th>
                            <th>成绩</th>
                            <th>语言</th>
                            <th>详细</th>
                            <th>工资</th>
                            <th>结束时间</th>
                            <th>操作</th>
                        </tr>
                        <tr v-for="item in pageInfo2.list" :key= item.id>
                            <td style="width: 140px;">{{item.title}}</td>
                            <td style="width: 140px;">{{item.name}}</td>
                            <td style="width: 140px;">{{item.subject}}</td>
                            <td style="width: 140px;">{{item.educational}}</td>
                            <td style="width: 140px;">{{item.grade}}</td>
                            <td style="width: 140px;">{{item.language}}</td>
                            <td style="width: 140px;">{{item.content}}</td>
                            <td style="width: 140px;">{{item.salary}}</td>
                            <td style="width: 140px;">{{item.pairDate | formatTimeStamp}}</td>
                            <td class="control_btns" style="width: 200px;">
                                <el-button size="small" type="primary" @click="acceptPair(item.pairId)" plain  v-if="item.pairStatus == 0">同意配对</el-button>
                                <el-button size="small" type="warning" @click="declinePair(item.pairId)" plain  v-if="item.pairStatus == 0">拒绝配对</el-button>
                                <el-tag type="success" v-if="item.pairStatus == 2">配对成功</el-tag>
                                <el-tag type="success" v-if="item.pairStatus == 1">配对成功</el-tag>
                                <el-tag type="danger" v-if="item.pairStatus == -1">配对失败</el-tag>
                                <el-tag type="info" v-if="item.pairStatus == -2">配对解除</el-tag>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <!--翻页组件-->
                        <el-pagination
                            :visible.sync="!pageInfo2.loading"
                            layout="prev, pager, next"
                            :current-page="pageInfo2.pageNum"
                            :total="pageInfo2.total"
                            @current-change="setPage">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import lgSearchBox from "../../components/lgSearchBox"
    import lgTable from "../../components/lgTable"
    import tablePageBase from '../common/tablePageBase'
    import lgBody from "../../components/lgBody";
    import {langSelectList,educationalList,gradeList,subjectList} from "@/utils/const";
    import  {pairApi} from "@/api/pair";

    export default {
        extends : tablePageBase,
        name:'demand',
        components :{lgTable, lgSearchBox, lgBody},
        data() {
            return {
                langSelectList,
                educationalList,
                gradeList,
                subjectList,
                formLabelWidth:'80px',
                startDate: null,
                endDate:null,
                dateRange: [],
                pairFormVisible:false,
                pairId:'',
                stateNum:0,
                sendAndAccept:'first',
                pageInfo2: {
                    loading:false,
                }, // 分页数据
                reqCond2: {    // 请求参数
                    pageNumber: 1, //初始化查询时为第一页
                },
            }
        },

        mounted: function () {
            let vm = this;
            vm.ths= ['标题','学科','学历', '成绩','语言要求','工资要求','数量','创建时间',{name:'操作',align:"center"}];
            // 加载数据
            vm.api.listPage = this.$api.demandRouter.getSendDemandList;
            vm.api.listPage2 = this.$api.demandRouter.getAcceptDemandList;
            // 加载列表
            if (!vm.isEmpty(vm.$route.query.display)) {
                vm.sendAndAccept = vm.$route.query.display;
            }
            vm.getPageList();
            vm.getPageList2();
        },

        methods: {
            getPageList2: function ( ) {
                let vm = this;
                let url = vm.api.listPage2;
                if (! url || url == "") {
                    return;
                }
                this.pageInfo2.loading = true;
                //查询时页数据
                this.$http.get( url , {params: vm.reqCond2})
                    .then((response) => {
                        vm.pageInfo2.loading = false;
                        let result = response.data;
                        if(response.status= vm.$responseSuccess){
                            if(result.code == vm.$success){
                                vm.pageInfo2 =  result.data;
                                vm.pageInfo2.loading = false;
                                return;
                            }
                        }
                        this.$message({
                            type: 'error',
                            message: result.message || "数据出错！"
                        });
                    })
                    .catch((error) => {
                        console.log("get page list error:",error);
                        this.$message({
                            type: 'error',
                            message: "加载数据出错！"
                        });
                    })
            },
            acceptPair:function(item){
                let vm = this;
                vm.pairId = item;
                //待处理
                this.$confirm('是否确定配对?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 密码验证完成 to del
                    pairApi.acceptPair({id:vm.pairId})
                        .then((result) => {
                            //配对成功
                            if (result.code == vm.$success) {
                                this.stateNum +=1;
                                vm.getPageList2();
                                this.$message({
                                    type: 'info',
                                    message: "配对成功"
                                });
                            } else {
                                //配对失败
                                vm.$alert(result.message||"配对失败，对方已完成配对", {
                                    confirmButtonText: '确定',
                                });
                                vm.getPageList2();
                            }
                        })
                        .catch((error) => {
                            this.$message({
                                type: 'error',
                                message: "操作失败"
                            });
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            },
            declinePair:function(item){
                let vm = this;
                vm.pairId = item;
                //待处理
                this.$confirm('是否确定拒绝配对?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 密码验证完成 to del
                    pairApi.declinePair({id:vm.pairId})
                        .then((result) => {
                            //拒绝成功
                            if (result.code == vm.$success) {
                                this.stateNum +=1;
                                this.$message({
                                    type: 'info',
                                    message: "已拒绝配对"
                                });
                                vm.getPageList2();
                            } else {
                                //发送失败
                                vm.$alert(result.message||"发送失败", {
                                    confirmButtonText: '确定',
                                });
                            }
                        })
                        .catch((error) => {
                            this.$message({
                                type: 'error',
                                message: "操作失败"
                            });
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            },
        } ,

    };
</script>

<style scoped>

</style>
<style lang="scss" scoped>
    .cont {
        table {
            width: 100%;
            tr{
                border: 1px solid #5a9a70;
                text-align: center;
            }
            th {
                background-color: #5a9a70;
                color: #ffffff;
            }
            td , th {
                min-height: 42px ;
                padding: 10px 4px;
            }
        }
    }
</style>
