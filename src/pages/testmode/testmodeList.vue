<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths" @pageChange="setPage" class="page_testmode_list">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form :model="reqCond" label-width="80px">
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <el-form-item label="名称:">
                                    <el-input size="small" v-model="reqCond.name"
                                              @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <div style="line-height: 42px;">
                                    <el-button class="search_box_serarch_button" type="primary" size="small"
                                               icon="el-icon-search" @click="getPageList()">搜索
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </lgSearchBox>
            </div>
        </template>
        <!--  =================== 添加按钮 ===================  -->
        <template slot="table_btns">
            <ul>
                <li>
                    <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="create">创建测验</el-button>
                </li>
            </ul>
        </template>
        <template slot="dialog">
            <!--    笔记编辑弹出框-->
            <el-dialog title="创建测试" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                <el-form class="clearfix">
                    <el-row :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="测试名称" :label-width="formLabelWidth">
                                <el-input v-model="form.name" placeholder="请输入名字"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                    <el-button @click="dialogFormVisible=false">取消</el-button>
                    <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">
                        {{form.id?'保存':'新增'}}
                    </el-button>
                </div>
            </el-dialog>
        </template>

        <!--  =================== 表格内容 ===================  -->
        <template slot="table" class="tableContent">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.name}}</td>
                <td style="width: 140px;">{{item.grade}}</td>
                <td style="width: 140px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 140px;">{{item.timePassed|formatTimeStampMinute}}</td>
                <td style="width: 140px;">{{item.end==false?"未完成":"已完成"}}</td>
                <td class="control_btns" style="width: 180px;text-align: center">
                    <!-- 编辑按钮 -->
                    <router-link :to="{path:'/testmode/testmode',query:{id:item.id}}">
                        <el-button size="small" type="success" @click="enterExam(item)" plain v-if="item.end==false">
                            进入测验
                        </el-button>
                    </router-link>
                    <el-button size="small" type="success" @click="enterReview(item)" plain v-if="item.end==true">测验查看</el-button>
                </td>
            </tr>
        </template>
    </lg-body>

</template>

<script>
    import {examApi} from '@/api/exam';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";

    export default {
        name: "testmodeList",
        components: {lgTable, lgBody, lgSearchBox, lgUpload},
        extends: tablePageBase,
        data() {
            return {
                roles,
                formLabelWidth: '120px',
                fileList: [],
                dialogFormVisible: false,
                id: '',
            }
        },
        mounted() {
            let vm = this;
            vm.ths = ['测试名称', '成绩', '创建时间', '到期时间', '状态', {name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.examRouter.listPage;
            vm.api.insert = this.$api.examRouter.createExam;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            saveEnd: function () {
                let name = this.name;
                examApi.createExam(name).then((result) => {
                    if (result.code == this.$success) {
                        console.log('createExam--result', result);
                        this.dialogFormVisible = false;
                        this.$message({
                            type: 'success',
                            // message: "提交成功",
                            message: this.getLangServerMess(result.messageCode) || "创建成功"
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: this.getLangServerMess(result.messageCode) || "创建失败",
                        });
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            create: function () {
                this.dialogFormVisible = true;
                // this.edit({}) ;
            },
            enterExam: function (item) {
                this.id = item.id;
            },
            enterReview: function (item) {
                this.id = item.id;
                this.$router.push({  //核心语句
                    path: '/testmode/testmodeReview',   //跳转的路径
                    query: {           //路由传参时push和query搭配使用 ，作用时传递参数
                        id: item.id,
                    }
                })
            },
            validate: function () {
                let vm = this;
                // if (vm.isEmpty(this.form.title)) {
                //     this.$alert("标题不能为空");
                //     return false;
                // }
                // if(vm.isEmpty(this.form.content)){
                //     this.$alert("内容不能为空");
                //     return false;
                // }
                return true
            },
        }
    }
</script>

<style lang="scss">
    .page_testmode_list {
        .tableContent {
            .control_btns {
            }
        }

    }
</style>
