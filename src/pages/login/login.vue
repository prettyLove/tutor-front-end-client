<template>
    <div class="login">
        <div class="cont">
            <div class="login_main">
                <div class="login-box" >
                    <div style="text-align: right; padding:20px 20px 0 0;">
                        <el-select v-model="loginLang" placeholder="请选择" size="mini" style="width: 100px;">
                            <el-option  label="中文简体"  :value="langs.zh_cn"></el-option>
                            <el-option  label="中文繁体"  :value="langs.zh_hk"></el-option>
                            <el-option  label="English"  :value="langs.cn_us"></el-option>
                        </el-select>
                    </div>
                    <!--用户登陆 -->
                    <div class="head-box"><h3>{{getLang(langCode.userLogin)}}</h3></div>
                    <el-form  :label-position="labelPosition" label-width="80px" :model="account" style="text-align: center;margin-top: 10px">
                        <el-input v-model="account.username" @keyup.enter.native="enterSearch" style="width: 280px" placeholder="账号">
                            <template slot="prepend">
                                <font-awesome-icon icon="user" style="color: #418a5a"></font-awesome-icon>
                            </template>queryRoleMenus
                        </el-input>

                        <el-input type="password" v-model="account.password" @keyup.enter.native="enterSearch" style="width: 280px; margin: 20px 3px 0 0" placeholder="密码">
                            <template slot="prepend">
                                <font-awesome-icon icon="lock" style="color: #418a5a"></font-awesome-icon>
                            </template>
                        </el-input>
                    </el-form>

                    <div style="text-align: right;margin: 15px 15px 0 0;">
                        <!--记住密码-->
                        <el-checkbox v-model="remember" id="remember"  label="1">{{getLang(langCode.rememberPassword)}}</el-checkbox>
                    </div>

                    <!-- 拼命加载中 -->
                    <div style="text-align: center;" v-loading="loading" element-loading-text="loading ...">
                        <!--登陆-->
                        <el-button type="primary" @click="sendLogin" style="width: 280px;margin-top: 20px">{{getLang(langCode.login)}}</el-button>
                    </div>
                    <div style="margin:30px 15px 0 ; text-align: left;">
                        <!--忘记密码-->
                        <router-link to="/forgetPassword"><a style="color: #418a5a;">{{getLang(langCode.forgotPassword)}}</a></router-link>
                        <!--新用户注册-->
                        <router-link to="../register" style="float: right;"><a style="color: #418a5a;">{{getLang(langCode.newUserRegistration)}}</a></router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getToken, removeToken, setToken} from '@/utils/auth'
    import CryptoJS from "crypto-js";
    import router from '@/router/index';
    import {userLogin} from '../../api/login'
    import {langCode,langs,getLanguseWebMessage} from '@/utils/languageWebMap';

    export default {
        data() {
            return {
                langCode,
                langs,
                router,
                note: {
                    backgroundPosition: "absolute",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                },
                labelPosition: 'right',
                remember:true,
                account: {
                    username: '',
                    password: '',
                    orgName:'',
                },
                localStorageUser: '',
                localStoragePassword: '',
                OrgList:[],
                encryption: "kmjky", //加密追加的字符串
                loading:false,
                loginLang:langs.zh_hk,
            }
        },
        created() {

        },
        mounted() {
            this.getLocalStorage();
        },
        watch:{
            // 用户选择
            account:{
                handler(arr, oldName) {
                    this.account = arr;
                },
                deep:true, //深度
                immediate: true // 实时
            }
        },
        mounted() {
            //动态设置单个组件页面的背景颜色
        },
        methods: {
            getLang : function(k){
                return getLanguseWebMessage(k,this.loginLang)
            },
            sendLogin() {
                let _self = this;
                // login 记录密码验证，如果记住密码状态为true，则保存至localStorage
                if(_self.remember == true) {
                    _self.setLocalStorage(_self.account.username, _self.account.password, "",30);
                } else {
                    _self.clearLocalStorage();
                }
                this.loading=true;
                userLogin(this.account)
                    .then((res) => {
                        if( res.code == _self.$success ){
                            //cookie中保存登录状态
                            setToken(res.data.accessToken);
                            this.$local.save('loginInfo', {
                                username: this.account.username,
                                realName:  res.data.realName,
                                roleName:  res.data.roleName,
                                orgId:  res.data.orgId,
                                email:  res.data.email,
                            });
                            this.loginSuccess();
                            this.loading=false;
                        } else {
                            this.$message.error(this.getLang(langCode.loginFail));  //'登录成功！'
                            this.loading=false;
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },

            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loginSuccess() {
                //加载用户权限
                let info = this.$local.fetch('loginInfo');
                // ----------- 初始化用户数据 --------------------------
                this.$store.dispatch("userStoreInit",info.username);
                // 排除跳转到login
                if(this.$route.query.redirect && this.$route.query.redirect.indexOf("login?")==-1){
                    // 重定向
                    this.$router.push({
                        path:this.$route.query.redirect,
                        query:{random:Math.random()},
                    });
                }else{
                    // 重定向到首页
                    this.$router.push({
                        path:'/',
                        query:{random:Math.random()},
                    });
                }
                this.$message({
                    message: this.getLang(langCode.loginSuccess), //'登录成功！'
                    type: 'success'
                });
            },

            // 设置localStorage
            setLocalStorage(c_name, c_pwd, c_org ,exdays) {
                // 获取当前时间
                var exdate = new Date();
                // 保存的天数
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
                // 加密账号密码
                this.localStorageUser = CryptoJS.AES.encrypt(c_name+'', this.encryption).toString();
                this.localStoragePassword = CryptoJS.AES.encrypt(c_pwd+'', this.encryption).toString();
                this.localStorageOrganization = CryptoJS.AES.encrypt(c_org+'', this.encryption).toString();
                // 将加密后的账号保存至localStorage
                this.$local.saveString("username", this.localStorageUser);
                this.$local.saveString("password", this.localStoragePassword);
                this.$local.saveString("organization", this.localStorageOrganization);
            },

            // 读取localStorage  还原用户密码
            getLocalStorage: function() {
                // 若为第一次登录，则不执行读取localStorage的操作
                var username = localStorage.getItem("username");
                var password = localStorage.getItem("password");
                var org = localStorage.getItem("organization");
                if (username && password && org) {
                    // 解密账号和密码
                    var bytes = CryptoJS.AES.decrypt(this.$local.getString("username"), this.encryption);
                    var bytes1 = CryptoJS.AES.decrypt(this.$local.getString("password"), this.encryption);
                    var bytes2 = CryptoJS.AES.decrypt(this.$local.getString("organization"), this.encryption);
                    // 账号密码回显
                    this.account.username = bytes.toString(CryptoJS.enc.Utf8);
                    this.account.password = bytes1.toString(CryptoJS.enc.Utf8);
                    this.account.orgName = bytes2.toString(CryptoJS.enc.Utf8);
                }
            },

            // 回车自动搜索
            enterSearch:function(e){
                e.target.blur();
                this.sendLogin();
            },

            // 清除localStorage  此处注意应将自身的localStorage清除即可，调用clear方法会将所有的localStorage清除
            clearLocalStorage: function() {
                this.$local.saveString("username", '');
                this.$local.saveString("password", '');
                this.$local.saveString("organization", '');
            }
        }
    }

</script>

<style lang="scss">

    .login {
        display: table;
        height: 100%;
        width: 100%;
        min-height: 100%;
        background: #59b583;
        & > .cont {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
            .logo {
                position: absolute;
                top: 20px;
                left: 40px;
            }
            .login_main {
                display: inline-block;
                margin: 0 auto;
                text-align: center;

                & > .login-box {
                    /*margin-left: 830px;*/
                    max-width: 360px;
                    width:92%;
                    margin: 0 auto;
                    height: 420px;
                    background-color: #eeeeee;
                    border-radius: 9px;

                    h3 {
                        font-weight: 500;
                        line-height: 80px;
                        font-size: 25px;
                        color: #418a5a;
                        text-align: center;
                    }
                }
            }
        }

    }

</style>
