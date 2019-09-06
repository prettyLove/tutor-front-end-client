<template>
    <!-- 继承自  tablePageBase -->
    <lg-body :pageInfo="pageInfo" :ths="ths" :title="$route.name" @pageChange="setPage" class="page_demand">
        <!--  =================== 添加对话框 ===================  -->
        <template slot="dialog">
            <el-dialog title="添加需求" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                <el-form class="clearfix" :model="form">
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item label="标题" :label-width="formLabelWidth" style="width: 100%">
                                <el-input v-model="form.title" placeholder="请输入数量"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <!--具体要添加的内容-->
                        <el-col :span="12">
                            <el-form-item label="学科" :label-width="formLabelWidth">
                                <el-select v-model="form.subject" placeholder="请选择学科" style="width: 100%">
                                    <el-option v-for="(item ,index) in subjectList" :key="index" :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="年级" :label-width="formLabelWidth">
                                <el-select v-model="form.category" placeholder="请选择年级" style="width: 100%">
                                    <el-option label="初一" value="初一"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="学历" :label-width="formLabelWidth">
                                <el-select v-model="form.educational" placeholder="请选择学历" style="width: 100%">
                                    <el-option v-for="(item ,index) in educationalList" :key="index" :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="成绩" :label-width="formLabelWidth">
                                <el-select v-model="form.grade" placeholder="请选择成绩" style="width: 100%">
                                    <el-option v-for="(item ,index) in gradeList" :key="index" :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="语言" :label-width="formLabelWidth">
                                <el-select v-model="form.language" placeholder="请选择语言" style="width: 100%">
                                    <el-option v-for="(item ,index) in langSelectList" :key="index" :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="工资需求" :label-width="formLabelWidth" style="width: 100%">
                                <el-input v-model="form.salary" placeholder="请输入工资"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数量" :label-width="formLabelWidth">
                                <el-input-number style="width: 70%;" v-model="form.number" :min="1" :max="10"
                                                 label="数量"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item label="补习时段" :label-width="formLabelWidth">
                                <div>
                                    <gx-pair-time-selete v-model="demandTime"/>
                                </div>
                            </el-form-item>
<!--                            <el-form-item label="补习时长" :label-width="formLabelWidth">-->
<!--                                <el-select v-model="form.tutorialDuration">-->
<!--                                    <el-option v-for="(item,index) in lengthOfTutoring" :key="index" :label="item.name" :value="item.value"></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item label="需求内容" :label-width="formLabelWidth" style="width: 100%">
                                <el-input v-model="form.content" type="textarea" rows="12" placeholder="请输入"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>

                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns">
                    <el-button @click="cancelEditDialog()">取消</el-button>
                    <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">
                        {{form.id?'更新':'新增'}}
                    </el-button>
                </div>
            </el-dialog>
        </template>

        <!--  =================== 配对对话框 ===================  -->
        <!--<template slot="dialog">
            <el-dialog title="配对" :visible.sync="pairFormVisible" width="70%" :close-on-click-modal="false">
                <el-form class="clearfix" :model="form">
                    <pair-suited :demand="form.id" @selectSuited="onSelectSuited" :stateNum="stateNum" />
                </el-form>
            </el-dialog>
        </template>-->

        <template slot="dialog">
            <el-dialog title="配对" :visible.sync="pairFormVisible" width="75%" style="margin-top: -8vh;"
                       :close-on-click-modal="false">
                <el-form class="clearfix" :model="form">
                    <pair-suited :demand="form.role" @selectSuited="onSelectSuited" @user="onUser"
                                 :stateNum="stateNum"/>
                </el-form>
            </el-dialog>
        </template>
        <!--  =================== 详细信息对话框 ===================  -->
        <template slot="dialog">
            <el-dialog title="详细信息" :visible.sync="userFormVisible" width="40%" :close-on-click-modal="false">
                <el-form class="clearfix" :model="form">
                    <pair-user :userId="form.createBy" :stateNumUser="stateNumUser"/>
                </el-form>
            </el-dialog>
        </template>


        <!--  =================== 添加按钮 ===================  -->
        <template slot="table_btns">
            <ul>
                <li>
                    <router-link to="pairSuitedForm" style="color: #ffffff">
                        <el-button type="primary" size="medium" icon="el-icon-menu">查看配对</el-button>
                    </router-link>
                </li>
                <li>
                    <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="edit({})">添加需求
                    </el-button>
                </li>
            </ul>
        </template>

        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td>{{item.title}}</td>
                <td>{{item.subject}}</td>
                <!--<td>{{item.category}}</td>-->
                <td>{{item.educational}}</td>
                <td>{{item.grade}}</td>
                <td>{{item.language}}</td>
                <td>{{item.salary}}</td>
                <td>{{item.number}}</td>
                <td style="width: 200px;">{{item.createDate | formatTimeStamp}}</td>
                <td class="control_btns" style="width: 210px;">
                    <!-- 编辑按钮 -->
                    <el-button size="small" @click="edit(item)" plain v-if="item.status != 1">编辑</el-button>
                    <!-- 配对按钮 -->
                    <el-button size="small" @click="pair(item)" plain v-if="item.status == 0">配对</el-button>
                    <el-tag type="info" v-if="item.status == 1">配对成功</el-tag>
                    <el-tag type="info" v-if="item.status == -1">配对失败</el-tag>
                    <!-- 删除按钮 -->
                    <el-button size="small" @click="del(item.id)" plain type="danger" v-if="item.status != 1">删除
                    </el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import lgSearchBox from "../../components/lgSearchBox"
    import lgTable from "../../components/lgTable"
    import tablePageBase from '../common/tablePageBase'
    import lgBody from "../../components/lgBody";
    import {langSelectList, educationalList, gradeList, subjectList} from "@/utils/const";
    import pairSuited from "./components/pairSuited";
    import pairUser from "./components/pairUser";
    import {pairApi} from "@/api/pair";
    import gxPairTimeSelete from "@/components/gxPairTimeSelete"
    import {lengthOfTutoring} from "@/utils/const";

    export default {
        extends: tablePageBase,
        name: 'demand',
        components: {lgTable, lgSearchBox, lgBody, pairSuited, pairUser, gxPairTimeSelete},
        data() {
            return {
                langSelectList,
                educationalList,
                gradeList,
                subjectList,
                lengthOfTutoring,
                formLabelWidth: '80px',
                startDate: null,
                endDate: null,
                dateRange: [],
                pairFormVisible: false,
                userFormVisible: false,
                sendPairId: 0,
                stateNum: 0,
                //后面加的内容
                stateNumUser: 0,
                demandId: '',
                beDemandedId: '',
                demandTime:[],
            }
        },

        mounted: function () {
            let vm = this;
            vm.ths = ['标题', '学科', '学历', '成绩', '语言要求', '工资要求', '数量', '创建时间', {name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.demandRouter.listPage;
            vm.api.insert = this.$api.demandRouter.insert;
            vm.api.update = this.$api.demandRouter.update;
            vm.api.delete = this.$api.demandRouter.delete;
            // 加载列表
            vm.getPageList();
        },

        methods: {
            //
            editBefore:function(item){
                console.log("this.form",item)
                try{
                    this.demandTime=[{}];
                    if(!this.isEmpty(item.demandTime)){
                        this.demandTime = JSON.parse(item.demandTime);
                    }
                }catch (e) {
                    console.log(e);
                }
            },
            validate: function () {
                let vm = this;
                if (vm.isEmpty(this.form.subject)) {
                    this.$alert("学科不能为空");
                    return false;
                }
                if (vm.isEmpty(this.form.educational)) {
                    this.$alert("学历不能为空");
                    return false;
                }
                if (vm.isEmpty(this.form.salary)) {
                    this.$alert("工资不能为空");
                    return false;
                }
                if (vm.isEmpty(this.form.number)) {
                    this.$alert("数量不能为空");
                    return false;
                }
                //
                this.form.demandTime = JSON.stringify( this.demandTime);
                console.log('this.demandTime',this.demandTime);
                return true;
            },
            onSelectSuited: function (item) {
                let vm = this;
                /*//以前传参
                this.sendPairId = item;*/
                //修改以后传被发送人id
                this.beDemandedId = item;
                //待处理
                this.$confirm('是否确定发送?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 原本逻辑
                    // pairApi.sendPair(this.sendPairId)
                    //修改过后
                    pairApi.sendPair({demandId: this.demandId, beDemandedId: this.beDemandedId})
                        .then((result) => {
                            //发送成功
                            if (result.code == vm.$success) {
                                this.stateNum += 1;
                                this.$message({
                                    type: 'info',
                                    message: "发送成功"
                                });
                            } else {
                                //发送失败
                                vm.$alert(result.message || "发送失败", {
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
            pair: function (item, readyOnly) {
                /*发送配对用到的参数*/
                this.demandId = item.id;
                this.pairFormVisible = true;
                this.editBefore(item);
                this.readyOnly = readyOnly;
                // item 为空的object 则是添加
                this.form = Object.assign({}, item || {});
                this.showPairDialog();

            },
            showPairDialog: function () {
                this.stateNum += 1;
                this.pairFormVisible = true;
            },


            showUserDialog: function () {
                this.stateNumUser += 1;
                this.userFormVisible = true;
            },
            //user详细信息组件点击
            onUser: function (item, readyOnly) {
                this.userFormVisible = true;
                this.editBefore(item);
                this.readyOnly = readyOnly;
                console.log('this.readyOnly',this.readyOnly);
                // item 为空的object 则是添加
                this.form = Object.assign({}, item || {});
                this.showUserDialog();

            },
        },

    };
</script>

<style scoped>

</style>
<style>
    .page_system_notice .el-form-item {
        margin-bottom: 5px;
    }
</style>
