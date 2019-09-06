<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths" @pageChange="setPage" class="programmeMessage_page">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form :model="reqCond" label-width="80px">
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <el-form-item label="名称:">
                                    <el-input size="small" v-model="reqCond.content"
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
        <template slot="dialog">
            <!--    查看弹出框-->
            <el-dialog title="查看" :visible.sync="readMessageVisible" :close-on-click-modal="false" style="text-align: center">
                <el-form class="clearfix" v-for="(item,index) in operatingConfirms" :key="index">
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="发送者" :label-width="formLabelWidth">
                                <div>{{item.name}} </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item label="变更详情" :label-width="formLabelWidth">
                                <div>{{item.content}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                    <el-button @click="readMessageVisible=false">关闭</el-button>
<!--                    <el-button type="primary" @click="readMessage()" v-loading.fullscreen.lock="updateLoading">确定</el-button>-->
                </div>
            </el-dialog>
        </template>

        <!--  =================== 表格内容 ===================  -->
        <template slot="table" class="tableContent">

            <table class="table" style="width: 100%">
                <tr>
                    <th>消息类型</th>
                    <th>发送者</th>
                    <th>时间</th>
<!--                    <th>状态</th>-->
                    <th>操作</th>
                </tr>
                <tr v-for="item in pageInfo.list" :key= item.id>
                    <td>{{item.content}}</td>
                    <td>{{item.name}}</td>
                    <td style="width: 300px;">{{item.createDate | formatTimeStamp}}</td>
                    <td class="control_btns" style="width: 210px;" v-if="item.type=='appointment_save'&&item.status==0">
                        <!-- 编辑按钮 -->
                        <el-button size="small" @click="agreeMessigeChange(item,1)" plain  >同意</el-button>
                        <el-button size="small" @click="agreeMessigeChange(item,-1)" plain  >不同意</el-button>
                    </td>
                    <td class="control_btns" style="width: 210px;" v-if="item.type=='appointment_save'&&item.status==1">
                        <el-tag type="success">已同意</el-tag>
                    </td>
                    <td class="control_btns" style="width: 210px;" v-if="item.type=='appointment_save'&&item.status==-1">
                        <el-tag type="success">已拒绝</el-tag>
                    </td>
                    <td class="control_btns" style="width: 210px;" v-if="item.type=='appointment_save'&&item.status==-2">
                        <el-tag type="success">日程已取消更改</el-tag>
                    </td>
                    <td v-if="item.type!='appointment_save'">
                        <el-button size="small" @click="readMessage(item)" plain  >查看</el-button>
                    </td>
                </tr>
            </table>
        </template>
    </lg-body>
</template>

<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {scheduleNoticeApi} from "@/api/scheduleNotice";
    export default {
        name: "programmeMessage",
        components: {lgTable, lgBody, lgSearchBox, lgUpload},
        extends: tablePageBase,
        data(){
            return{
                formLabelWidth:'120px',
                readMessageVisible:false,
                readMessageVisible:false,
                formLabelWidth:'120px',
                content:'',
                oldStart:'',
                newStart:'',
                operatingList:[],
                operatingConfirms:[],
            }
        },
        mounted() {
            let vm=this;
            vm.api.listPage = this.$api.scheduleNoticeRouter.listPage;
            vm.getPageList();

        },
        methods:{
            //查看消息
            readMessage:function (item) {
                console.log('item',item);
                let id=item.id;
                this.readMessageVisible=true;
                scheduleNoticeApi.getOperatingConfirm({id:id}).then((result)=>{
                    if(result.code==this.$success){
                        console.log('getOperatingConfirm===result',result);
                        this.operatingList=result.data;
                        this.operatingConfirms=result.data.operatingConfirms;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            //同意不同意
            agreeMessigeChange:function(item,status){
                if(this.isEmpty(item.id)){
                    this.$message({
                        type: 'error',
                        message: "ID 为空"
                    });
                    return;
                }
                let prams={
                    confirmId:item.id,
                    status:status
                }
                scheduleNoticeApi.confirm(prams).then((result)=>{
                    if(result.code==this.$success){
                        console.log('listPage==result',result);
                        this.getPageList();
                        this.$message({
                            type: 'success',
                            message: this.getLangServerMess(result.messageCode) || "确认成功"
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: this.getLangServerMess(result.messageCode) || "确认失败,请检查！"
                        });
                    }
                    this.getPageList();
                }).catch((err)=>{
                    console.log('err',err);
                })
            },

        }
    }
</script>

<style lang="scss">
     .programmeMessage_page{
         /*.tableContent{*/
             .table {
                 width: 100%;
                 th {
                     color: #ffffff;
                     background-color: #5a9a70;
                 }

                 td,th {
                     text-align: center;
                     border: 1px solid #e3e9e0;
                     line-height: 18px;
                     padding: 4px 6px;
                 }
             }
         /*}*/
     }


</style>
