<template>
    <div class="table_box page_dashboard_list">

        <!-- 添加画板 -->
        <el-dialog title="添加画板" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form class="clearfix" ref="addForm" :rules="rules" :model="form">
                <el-row :gutter="10">
                    <!--具体要添加的内容-->
                    <el-col :span="12">
                        <el-form-item label="名称" prop="dashboardName" :label-width="formLabelWidth">
                            <el-input size="small" v-model="form.dashboardName" placeholder="请输入名称"/>
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

        <!-- 编辑画板 -->
        <el-dialog title="画板编辑" :visible.sync="dialogEditDashboardVisible" top="5vh" width="80%" :show-close="false" :close-on-click-modal="false">
            <dashboard-edit class="edit_dashboard" :editUrl="editUrl" @close="onDashEditClose" @change="getPageList"></dashboard-edit>
        </el-dialog>

        <!-- 教学直播 -->
        <el-dialog title="开始教学直播" :visible.sync="liveFormVisible" :close-on-click-modal="false">
            <el-form class="clearfix" :model="form">
                <el-row :gutter="10">
                    <!--具体要添加的内容-->
                    <el-col :span="12">
                        <el-form-item label="课程主题" :label-width="formLabelWidth">
                            <el-input v-model="lessonTopics" placeholder="请输入名称"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="live">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="选择成员" :label-width="formLabelWidth">
                                <el-select v-model="liveUserList" multiple placeholder="请选择">
                                    <el-option
                                        v-for="item in $store.getters.getUserPairList" v-if="item.name!=$store.getters.getUserInfo.name"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
<!--                <el-row :gutter="10">-->
<!--                    <el-col :span="24">-->
<!--                        <el-form-item label="结束时间" :label-width="formLabelWidth">-->
<!--                            <el-date-picker-->
<!--                                style="max-width: 100%"-->
<!--                                v-model="endTime"-->
<!--                                type="datetime"-->
<!--                                clearable-->
<!--                                range-separator="至"-->
<!--                                start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期">-->
<!--                            </el-date-picker>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
                    <!--  <el-col :span="12">
                          <ul>
                              <li v-for="(item,k) in userList" >
                              &lt;!&ndash;<span>{{item.name}}</span>&ndash;&gt;
                                  <span><el-button size="mini">{{item.name}}</el-button></span>
                              </li>
                          </ul>
                      </el-col>-->

<!--                </el-row>-->
            </el-form>

            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                <el-button @click="liveFormVisible=false">取消</el-button>
                <el-button type="primary" @click="startLive()">开始</el-button>
            </div>
        </el-dialog>

        <div style="text-align: right;">
            <el-button size="small" type="primary" plain icon="el-icon-circle-plus-outline" @click="edit({})">添加画板</el-button>
        </div>

        <div>
            <div class="list_box">
                <div class="item" v-for="item in pageInfo.list" :key=item.id>
                    <!--<div >{{item.createDate|formatTimeStamp}}</div>-->
                    <div class="img" @click="clickDashboard(item)">
                        <img v-if="item.url" :src="item.url" />
                        <img v-else src="/static/image/default_dashboard.png" />
                    </div>
                    <div class="name">{{item.dashboardName}}</div>
                    <div>
<!--                        <el-button size="small" plain type="primary" @click="readyLive(item.id,true)" :disabled="$store.getters.isHasLive"-->
                        <el-button size="small" plain type="primary" @click="readyLive(item.id,true)"
                                   style="padding: 0px 8px; line-height: 24px;" :disabled="$store.getters.getUserInfo.role==roles.STUDENT">教学直播
                        </el-button>
                        <el-button size="small" plain type="edit" @click="editDisboard(item.id)"
                                   style="padding: 0px 8px; line-height: 24px;" >编辑
                        </el-button>
                        <el-button size="small" plain type="danger" @click="del(item.id)"
                                   style="padding: 0px 8px; line-height: 24px;">删除
                        </el-button>
                    </div>
                </div>
            </div>

            <!--翻页组件-->
            <el-pagination
                :visible.sync="!pageInfo.loading"
                layout="prev, pager, next"
                :current-page="pageInfo.pageNum"
                :total="pageInfo.total"
                @current-change="setPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    import TablePageBase from '../common/tablePageBase'
    import lgCard from '../../components/lgCard'
    import {dashboardApi} from '../../api/dashboard'
    import {getToken} from "../../utils/auth";
    import {WS_MSG_TYPE} from '@/utils/const'
    import  dashboardEdit from  './dashboardEdit'
    import {roles} from '@/utils/const'
    import qs from 'qs'

    const userList = [
        {
            'name': "lugew",
            'id': "d333aefaefaeaea233",
        },
        {
            'name': "cai",
            'id': "daefaefaeaea",
        },
        {
            'name': "wl",
            'id': "defefeee333aefaefaeaea233",
        }
    ];


    export default {
        extends: TablePageBase,
        name: "dashboardList",
        components: {lgCard,dashboardEdit},
        data() {
            return {
                roles,
                userList,
                formLabelWidth: '80px',
                liveFormVisible: false,
                liveId: null,
                liveUserList: [],
                endTime: null,
                lessonTopics: "", // 课程主题
                live: true , //是否开启直播
                dialogEditDashboardVisible:false,
                editUrl:null,
                rules:{
                    dashboardName: [{ required: true, trigger: 'blur' ,message: '请输入画板名称',}],
                }
            }
        },
        mounted() {
            let vm = this;
            // 增删改查
            vm.api.listPage = this.$api.dashboardRouter.listPage;
            vm.api.insert = this.$api.dashboardRouter.add;
            vm.api.update = this.$api.dashboardRouter.save;
            vm.api.delete = this.$api.dashboardRouter.delete;

            // 加载翻页数据
            this.getPageList();
        },
        methods: {
            onDashEditClose:function(visible,editUrl){
                this.dialogEditDashboardVisible = visible;
                this.editUrl = editUrl;
            },
            // 编辑画板
            editDisboard:function(id){
                console.log("edit",id)
                this.dialogEditDashboardVisible = true;

                // let editUrl = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_EDIT");
                let webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
                // var ishttps = 'https:' == document.location.protocol ? true : false;
                // // 处理 http 和 https
                // if(ishttps) {
                //     webApi = webApi.replace("http:", "https:");
                // }
                this.editUrl = "/dashboard/edit-vue.html" + "?token=" + getToken() + "&dashboardId=" + id+"&webApi="+webApi
                console.log("this.editUrl",this.editUrl)
                // window.open(dashboardUrl + "?token=" + getToken() + "&dashboardId=" + this.id , '_blank')
            },
            validate:function(){
                /* if(this.isEmpty(this.form.dashboardName)){
                    this.$alert("请输入画板名称");
                    return false;
                }*/
                let res = false
                this.$refs.addForm.validate((valid)=>{
                    if (valid) {
                        res = true;
                    }
                })
                return res;
            },
            clickDashboard: function (item) {
                console.log("clickDashboard", item);
                this.editDisboard(item.id);
            },
            //
            readyLive: function (id, live) {
                this.liveId = id;
                this.live = live;
                /*if (!this.live) {
                    this.liveUserList = [];
                }*/
                this.lessonTopics = "";
                this.liveUserList = [];

                this.liveFormVisible = true;
            },
            // 开始直播
            startLive: function () {
                console.log("start");
                if (this.live && this.liveUserList.length < 1) {
                    this.$alert("请选择用户");
                    return;
                }
                //开始教学直播选的结束时间
                let liveHour = parseInt(this.$store.getters.getSystemConfigMapByKey("ROOM_LIVE_HOUR") ) ;
                let liveEnd = new Date().getTime()+liveHour*60*60*1000;
                console.log("=========================liveHour",liveHour,new Date(liveEnd));
                this.endTime =  new Date(liveEnd)


                // if (!this.endTime || this.endTime <= new Date()) {
                //     this.$alert("请选择结束时间并结束时间大于当前时间");
                //     return;
                // }

                console.log("this.liveUserList", this.liveUserList, this.$store.getters.getUserInfo.id)
                // 创建房间
                let getRoomQuery = {
                    type: WS_MSG_TYPE.CREATE_LIVE_ROOM,
                    fromUserId: this.$store.getters.getUserInfo.id, // 用户id
                    endDate: this.endTime,
                    // liveHour:this.liveHour,
                    message: "",
                    title: this.lessonTopics, // 课程主题
                    dashboardId: this.liveId, // 画板id
                    toUserId: this.liveUserList,
                    live: this.live//是否开启直播
                };
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.$store.dispatch("wsSend", {
                    data: getRoomQuery,
                    cb: (data) => {
                        console.log("wsback", data)
                        loading.close();
                        this.liveFormVisible = false;
                        let dashboardUrl = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_HOST");
                        let webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
                        let charServer = this.$store.getters.getSystemConfigMapByKey("CHART_SERVER_HOST");
                        let params = {
                            token:getToken(),
                            dashboardId:this.liveId,
                            userId:this.$store.getters.getUserInfo.id,
                            roomId:data.roomId,
                            webApi:webApi,
                            charServer:charServer,
                            lessonTopics:this.lessonTopics,
                            liveHour:this.liveHour,
                            // dashboardName:item.dashboardName
                        }
                        // window.open(dashboardUrl + "?token=" + getToken() + "&dashboardId=" + this.liveId + "&userId=" + this.$store.getters.getUserInfo.id + "&roomId=" + data.roomId, '_blank')
                        // document.title=this.lessonTopics;
                        window.open(dashboardUrl + "?" + qs.stringify(params), '_blank');

                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .page_dashboard_list {
        .edit_dashboard {
            margin: 0;
        }
        .list_box {
            .item {
                width: 280px;
                display: inline-block;
                text-align: center;
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 6px;

                .img {
                    border: 1px solid #ccc;
                    height: 180px;
                    cursor: pointer;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .name {
                    line-height: 22px;
                    padding: 8px 0;
                    font-size: 16px;
                }

                &:hover {
                    /*background-color: #dce6e6;*/
                }
            }
        }
    }
</style>
