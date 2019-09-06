<template>
    <div class="com_topbar">
        <template>
            <el-dialog title="个人信息" :visible.sync="dialogFormVisible" width="500px" :close-on-click-modal="true">
                <el-form :model="user" class="updateForm">
                    <!-- 个人信息 -->
                    <lg-input label="用户名：" class="lgInput" :readonly="true" v-model="user.name"
                              :labelWidth="formLabelWidth"/>
                    <lg-input label="手机号：" class="lgInput" v-model="user.phone" :labelWidth="formLabelWidth"/>
                    <lg-input label="邮箱：" class="lgInput" v-model="user.email" :labelWidth="formLabelWidth"/>
                    <el-form-item label="语言：" :label-width="formLabelWidth">
                        <el-select v-model="user.language">
                            <el-option v-for="item in LANG_LIST" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns">
                    <!--取消-->
                    <el-button @click="closeUser">{{getLang(langCode.cancel)}}</el-button>
                    <!--更新-->
                    <el-button @click="save()">{{getLang(langCode.update)}}</el-button>
                </div>
            </el-dialog>
        </template>
        <!--  更改密码弹出框-->
        <template>
            <el-dialog title="修改密码" :visible.sync="passwordFormVisible" width="500px" :close-on-click-modal="true">
                <el-form :model="form" class="updateForm">
                    <!-- 修改密码 -->
                    <lg-input label="旧密码：" type="password" class="lgInput" v-model="form.passWord" :labelWidth="formLabelWidth"/>
                    <lg-input label="新密码：" type="password" class="lgInput" v-model="form.newPassWord" :labelWidth="formLabelWidth"/>
                    <lg-input label="确认密码：" type="password" class="lgInput" v-model="form.confirmPassWord" :labelWidth="formLabelWidth"/>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns">
                    <!--取消-->
                    <el-button @click="closeUser">{{getLang(langCode.cancel)}}</el-button>
                    <!--更新-->
                    <el-button @click="updatePasswordById">{{getLang(langCode.update)}}</el-button>
                </div>
            </el-dialog>
        </template>

        <template>
            <el-dialog title="进入直播间" :visible.sync="$store.getters.getLiveJoinVisible" width="500px"
                       :close-on-click-modal="false" style="text-align: center">
                <div style="text-align: center">
                    <!--取消-->
                    <el-button @click="calcelJoinRoom">{{getLang(langCode.cancel)}}</el-button>
                    <el-button @click="joinRoom">JOIN</el-button>
                </div>
            </el-dialog>
        </template>

        <template>
            <el-dialog title="您有 正在进行教学直播未完成" :visible.sync="$store.getters.isHasLive" width="500px"
                       style="text-align: center"
                       :close-on-click-modal="false" :show-close="false">
                <div style="text-align: center">
                    <el-button v-if="$store.getters.getUserInfo.role==roles.STUDENT" @click="calcelJoinLive">取消</el-button>

                    <span v-for="(item,index) in $store.getters.getLiveRoomList" :key="index">
                              <el-button @click="joinLive(item)">进入直播-{{item.title}}</el-button>
                    </span>
                </div>

            </el-dialog>
        </template>

        <div class="topbar">
            <div class="cont" style="margin-left: 60px;">
                <span style="float: left; margin-left: 10px; font-weight: bold; ">{{$route.name}}</span>

                <span class="item" v-if="!$store.getters.getWsClientStatus" style="color: #f00; margin-right: 10px">
                    <!--服务连接失败-->
                    {{getLang(langCode.serviceConnectionFailure)}}
                </span>

                <el-badge style="line-height: 10px;" is-dot class="item" v-if="$store.getters.getDemandRequestNum > 0"
                          :value="$store.getters.getDemandRequestNum">
                    <router-link :to="{path:'/demand/pairSuitedForm',query:{display:'second'}}">
                        <el-button style="padding: 2px 5px;" class="share-button" icon="el-icon-bell"
                                   type="primary"></el-button>
                    </router-link>
                </el-badge>
                <el-badge style="line-height: 10px;" is-dot class="item" v-if="$store.getters.getMessageRequestNum > 0"
                          :value="$store.getters.getMessageRequestNum">
                    <router-link :to="{path:'/userMessage/list'}">
                        <el-button style="padding: 2px 5px;" class="share-button" icon="el-icon-message"
                                   type="primary"></el-button>
                    </router-link>
                </el-badge>
                <span class="item">
                      <!-- 点击进入直播 -->
                      <el-button type="warning" v-for="(item,index) in $store.getters.getLiveRoomList" :key="index"
                                 @click="joinLive(item)" title="点击进入直播" style="padding: 2px 8px;">
                          <i class="el-icon-video-camera"></i> {{item.title}}
                      </el-button>
                </span>
                <!-- 顾学科技 -->
                <span class="item">{{getLang(langCode.siteName)}}</span>

                <span class="item">
                    <font-awesome-icon icon="user"/>
                    <el-dropdown @command="userClick">
                        <span class="user">{{$store.getters.getUserInfo.name}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <!--个人信息-->
                            <el-dropdown-item :command="0">{{getLang(langCode.personalInformation)}}</el-dropdown-item>
                            <!--修改密码-->
                            <el-dropdown-item :command="1">{{getLang(langCode.changePassword)}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>

                <span class="item">{{$store.getters.getUserInfo.role}}</span>

                <!--  退出  -->
                <span class="item">
                    <font-awesome-icon style="cursor: pointer;" icon="power-off" @click="close"/>
                    <span class="logout" @click="close">{{this.getLang(this.langCode.exit)}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {removeToken, getToken} from '@/utils/auth'
    import {LANG_LIST} from '@/utils/const'
    import LgInput from "@/components/lgInput";
    import {userLogout} from '@/api/login';
    import {modifyPassword, getUserInfoForLogin, modifyUserInfo} from '@/api/user';
    import {roles} from '@/utils/const'
    import qs from 'qs'
    import {roomApi} from '@/api/room'
    import {dashboardApi} from '@/api/dashboard'
    import viewBase from './common/viewBase'
    import {langs,langCode} from "@/utils/languageWebMap"

    export default {
        extends: viewBase,
        name: "TopBar",
        data() {
            return {
                roles,
                formLabelWidth: '100px',
                LANG_LIST,
                username: '',
                user: {},       //用户对象
                form: {},       //修改密码对象
                flag: 0,
                versionFormVisible: false,
                dialogFormVisible: false,
                passwordFormVisible: false,
                brandkStatementOne: '',
                brandStatementTwo: '',
                lessonTopics:'',
            }
        },

        mounted: function () {

            this.getUserByCookie();
        },
        watch: {
            //监听SystemCode 被手动修改后 触发
            "$store.getters.getSystemCode": "onChange",
        },
        methods: {
            calcelJoinRoom: function () {
                this.$store.commit("cancelJoinRoom")
            },
            calcelJoinLive: function () {
                this.$store.commit("cancelJoinLive")
            },

            joinRoom: function () {
                let info = this.$store.getters.getJoinRoomInfo
                let dashboardUrl = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_HOST");
                let webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
                let charServer = this.$store.getters.getSystemConfigMapByKey("CHART_SERVER_HOST");
                let params = {
                    token: getToken(),
                    userId: this.$store.getters.getUserInfo.id,
                    roomId: info.roomId,
                    dashboardId: info.dashboardId,
                    webApi: webApi,
                    charServer: charServer,
                }
                console.log("info",info)

                window.open(dashboardUrl + "?" + qs.stringify(params), '_blank');
                this.$store.commit("setJoinLiveVisible", false)
            },
            //导师点击进入直播间方法
            joinLive: function (item) {
                console.log("joinlive", item)
                let dashboardUrl = this.$store.getters.getSystemConfigMapByKey("DASHBOARD_HOST");
                let webApi = this.$store.getters.getSystemConfigMapByKey("WEBAPI_HOST");
                let charServer = this.$store.getters.getSystemConfigMapByKey("CHART_SERVER_HOST");

                let params = {
                    token: getToken(),
                    userId: this.$store.getters.getUserInfo.id,
                    roomId: item.id,
                    dashboardId: item.dashboardId,
                    webApi: webApi,
                    charServer: charServer,
                    dashboardName: this.dashboardName,
                }
                window.open(dashboardUrl + "?" + qs.stringify(params), '_blank');
                this.$store.commit("cancelJoinLive")
            },

            userClick: function (sel) {
                if (sel == 0) {
                    this.getLoginInfo();
                    this.dialogFormVisible = true;
                } else {
                    this.passwordFormVisible = true;
                }

            },
            // 关闭 用户信息弹框
            closeUser: function () {
                this.dialogFormVisible = false;
                this.passwordFormVisible = false;
            },
            //用户修改自己的用户信息
            save: function () {
                let vm = this;
                if (vm.isEmpty(this.user.email)) {
                    this.$alert("邮箱不能为空");
                    return false;
                } else {
                    if (!vm.isEmail(this.user.email)) {
                        this.$alert("邮箱格式不正确，请重新输入");
                        return false;
                    }
                }
                if (vm.isEmpty(this.user.phone)) {
                    this.$alert("手机号不能为空");
                    return false;
                } else {
                    if (!vm.isPhoneNumber(this.user.phone)) {
                        this.$alert("手机号码不正确，请重新输入");
                        return false;
                    }
                }
                modifyUserInfo(this.user)
                    .then((result) => {
                        if (result.code == vm.$success) {
                            this.$message("操作成功");
                            //更新store
                            this.$store.commit("setUserInfo", this.user);
                            // 更新title
                            document.title = this.getLang(langCode.siteName);
                        } else {
                            this.$message("操作失败");
                        }
                        this.dialogFormVisible = false;
                    })
                    .catch((error) => {
                        console.log(error)
                        this.$message("操作失败");
                        this.dialogFormVisible = false;
                    })
            },
            //用户修改密码的方法
            updatePasswordById: function () {
                let vm = this;
                if (vm.form.newPassWord != vm.form.confirmPassWord) {
                    // 两次输入的密码不一致
                    this.$alert("两次输入的密码不一致");
                    return false;
                }
                vm.form.id = vm.user.id;
                vm.form.userName = vm.user.userName;
                // 调用api
                modifyPassword(this.form)
                    .then((res) => {
                        if (res.code == vm.$success) {
                            console.log('res',res);
                            this.$message(this.getLang(this.langCode.modifyPasswordSuccess));
                            //退出登入
                            userLogout({})
                                .then((response) => {
                                    if (res.code === this.$success) {
                                        removeToken();
                                        this.$router.push('/login');
                                    } else {
                                        this.$message({
                                            type: 'info',
                                            message: '退出异常！'
                                        });
                                    }
                                })
                                .catch((error) => {
                                    console.log(error)
                                });
                        } else {
                            this.$message(res.message);
                        }

                    })
                    .catch((err) => {
                        console.log(err);
                    })


            },
            // 是不是大屏页面
            isOverView: function () {
                if (this.$route.meta) {
                    //网络 监控不需要选择系统
                    return this.$route.meta.hideTopBarSystem ? true : false;
                }
                return false;
            },
            onChange: function () {
                //第一次进入是加载
                if (this.flag == 0) {
                    this.getBusinessData();
                    this.flag++;
                }
            },
            // 登录
            getLoginInfo: function () {
                let info = this.$store.getters.getUserInfo;//this.$local.fetch('loginInfo');
                console.log("info", info)
                this.user = Object.assign({}, info);
            },

            // 全屏开关
            getMenuMagin: function () {
                return this.$store.getters.leftMenuWidth;
            },

            //更新user的 session
            updateUserCookie: function (id) {
                let url = this.$api.homeRouter.updateUserCookie + "?id=" + id;
                this.$http.get(url)
                    .then((response) => {
                        if (response.status == this.$responseSuccess) {
                            this.getUserByCookie();
                        } else {
                        }
                    })
            },
            getUserByCookie: function () {
                getUserInfoForLogin()
                    .then((result) => {
                        this.user = result.data;
                        this.$store.commit("setUserInfo", result.data);
                    })
                    .catch((err) => {
                        // 取用户信息失败, 重新登陆
                        removeToken();
                        this.$router.push('/login');
                    })
            },

            // 退出登录
            close: function () {
                this.$confirm('是否退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    userLogout({})
                        .then((res) => {
                            if (res.code === this.$success) {
                                removeToken();
                                // 断开ws 连接
                                this.$store.dispatch("webSocketdisconnect");
                                this.$router.push('/login');
                            } else {
                                this.$message({
                                    type: 'info',
                                    message: '退出异常！'
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            },
        },
        components: {
            LgInput,
        },
    }
</script>

<style>
    .topbar {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 5;
        text-align: right;
        height: 40px;
    }

    .topbar > .cont {
        line-height: 40px;
        font-size: 15px;
        color: #ffffff;
        background-color: rgba(26, 87, 43, 0.88);
    }

    .topbar .el-input__inner {
        background: #071544;
        border-color: #5a9a70;
        color: #ffffff;
        font-size: 14px;
    }

    .topbar .el-input__inner:hover {
        border-color: #5a9a70
    }

    /* 修改下拉样式 */
    .top_select.el-select-dropdown {
        margin: 0;
        border: none;
    }

    .top_select.el-select-dropdown .el-select-dropdown__wrap {
    }

    .top_select.el-select-dropdown .popper__arrow {
        display: none;
    }

    .top_select.el-select-dropdown .el-select-dropdown__wrap .el-select-dropdown__item {
        background-color: #53b275 !important;
        color: #fff;
    }

    .top_select.el-select-dropdown .el-select-dropdown__wrap .el-select-dropdown__item.hover,
    .top_select.el-select-dropdown .el-select-dropdown__wrap .el-select-dropdown__item.selected {
        background-color: #59b583 !important;
    }

    /* 无数据显示 */
    .top_select.el-select-dropdown .el-select-dropdown__empty {
        background-color: #182A62 !important;
        color: #fff;
    }

    .top_select.el-select-dropdown .el-select-dropdown__wrap li span {
        font-size: 16px; /*max-width: 160px; display: block; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;*/
    }

    .top_select .el-select-dropdown.el-popper {
        background: #182A62;
    }

    .top_select .el-select-dropdown__list {
        background: #182A62
    }

    .top_select .el-select .el-input .el-select__caret {
        color: #5a9a70
    }

    .com_topbar .user {
        cursor: pointer;
        color: #FFFFFF
    }

    .com_topbar .topbar > .cont > .item {
        margin-right: 15px;
    }

    .com_topbar .logout {
        margin-right: 17px;
        cursor: pointer;
    }

    .com_topbar .updateForm {
        width: 400px;
        margin-top: 20px
    }

</style>


