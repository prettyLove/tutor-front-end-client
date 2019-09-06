<template>
    <div class="register">
        <div class="cont">
            <!--<div class="logo"><img src="../../assets/images/logo.png"></div>-->

            <div class="register_main">

                <div class="register-box" >
                    <div class="head-box"><h3>用户注册</h3></div>
                    <div v-if="showRegisterForm">
                        <el-form  :label-position="labelPosition" @keyup.enter.native="enterSearch" ref="registerForm" :rules="rules" label-width="80px" :model="account" style="text-align: center;margin-top: 10px">
                            <el-form-item label="名称" prop="name" style="width: 320px;margin: 0 20px 0 90px;">
                                <el-input v-model="account.name" style="width: 280px" placeholder="请输入用户名" @blur="">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="全名" prop="fullName" class="form-input">
                                <el-input v-model="account.fullName" placeholder="请输入全名" style="width: 280px" >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="身份" prop="role" class="form-input">
                                <el-select v-model="account.role" placeholder="请选择身份" style="width: 280px" >
                                    <el-option v-for="(item ,index) in memberRoleList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="性别" prop="sex" class="form-input">
                                <el-radio-group v-model="account.sex" style="width: 200px" >
                                    <el-radio label=1>男</el-radio>
                                    <el-radio label=0>女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="密码" prop="password" class="form-input">
                                <el-input type="password" v-model="account.password" style="width: 280px;" placeholder="密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPass" class="form-input">
                                <el-input type="password" v-model="account.checkPass"  style="width: 280px;" placeholder="密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="电话号码" prop="phone" class="form-input">
                                <el-input v-model="account.phone" placeholder="请输入电话号码" style="width: 280px" >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email" style="width: 320px;margin: 20px 20px 0 90px;">
                                <el-input v-model="account.email" placeholder="请输入邮箱" style="width: 280px" >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="语言" prop="language" class="form-input">
                                <el-select v-model="account.language" placeholder="请选择语言" style="width: 280px" >
                                    <el-option v-for="(item ,index) in langSelectList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: center;">
                            <el-button type="primary" @click="sendRegister" style="width: 280px;margin-top: 40px" >注册</el-button>
                            <!--                        <el-button type="primary" @click="sendRegister" style="width: 280px;margin-top: 40px" v-if="$store.getters.getUserInfo.role==roles.STUDENT">注册</el-button>-->
                            <el-button type="primary" @click="goLogin" style="width: 100px;margin-top: 40px">返回登录</el-button>
                        </div>
                    </div>
                    <div class="error"><h3>{{errorMsg}}</h3></div>
                    <div style="padding: 55px 20px"><h4>{{successTips}}</h4></div>
                    <div v-if="showReturnLoginbtn"  class="showReturnLoginbtn">
                        <el-button type="success" round @click="returnLoginBtn" >返回登录</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import router from '@/router/index';
    import {getCountByName, userRegister} from '../../api/register';
    import {memberRoleList,langSelectList} from "@/utils/const";
    import {roles} from '@/utils/const'
    import {basicComentApi} from '@/api/user'

    let validateEmail = (rule, value,callback) =>{
        // let isEmail=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
        let isEmail=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value == '') {
            callback(new Error('请输入邮箱'));
        }else if (value.length > 25) {
            // callback(new Error('长度太长'));
            callback(new Error('格式不正确，长度过长'));
        } else if (!isEmail.test(value)) {
            callback(new Error('请输入正确邮箱格式'));
        }
        callback();
    }



    export default {
        created() {

        },
        data() {
            return {
                roles,
                langSelectList,
                memberRoleList,
                router,
                showRegisterForm:true,
                errorMsg:'',
                successTips:'',
                showReturnLoginbtn:false,
                note: {
                    backgroundPosition: "absolute",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                },
                labelPosition: 'right',
                remember:true,
                localStorageUser: '',
                localStoragePassword: '',
                OrgList:[],
                encryption: "kmjky", //加密追加的字符串
                account: {
                    name: '',
                    fullName: '',
                    role: '',
                    sex: '',
                    password: '',
                    checkPass: '',
                    phone: '',
                    email: '',
                    language: '',
                },
                rules:{
                    name: [{ required: true, validator: this.validateName, trigger: 'blur' }],
                    fullName: [{ required: true, message: '请输入全名', trigger: 'blur' },
                        { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
                    role: [{ required: true, message: '请选择身份', trigger: 'change' }],
                    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                    password: [{ required: true, validator: this.validatePass, trigger: 'blur' }],
                    checkPass: [{ required: true, validator: this.validatePass2, trigger: 'blur' }],
                    phone: [{ required: true, validator: this.validatePhone, trigger: 'blur' }],
                    email: [{ required: true, validator: this.validateEmail, trigger: 'blur' }],
                    language: [{ required: true, message: '请选择使用语言', trigger: 'change' }],
                }
            }
        },
        mounted() {

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

        methods: {
            //用户名验证
            validateName : function(rule, value, callback) {
                var isName=/^[a-zA-Z0-9_-]{2,16}$/;
                if (value == '') {
                    callback(new Error('请输入用户名'));
                } else if (!isName.test(value)) {
                    callback(new Error('包含非法字符,或字符长度错误'));
                } else {
                    getCountByName({name:value})
                        .then((res) => {
                            console.log('validateName-res',res);
                            if( res.code == this.$success ){
                                callback();
                            } else {
                                callback(new Error('用户名已被注册'));
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.$message({
                                message: '初始化错误！',
                                type: 'error'
                            });
                        })
                }
            },
            //电话号码验证
            validatePhone : function(rule, value, callback) {
                var isPhone=/((^\+86|0086)\s+)*1[3-9]\d{9}$/;
                if (value == '') {
                    callback(new Error('请输入手机号码'));
                }
                else if (!isPhone.test(value)) {
                    console.log(value);
                    callback(new Error('手机号码格式错误,请重新输入'));
                }
                else {
                    basicComentApi.getCountByPhone({phone:value})
                        .then((res) => {
                            console.log('validatePhone-res',res);
                            if( res.code == this.$success ){
                                callback();
                            } else {
                                callback(new Error('手机号码已被占用'));
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.$message({
                                message: '初始化错误！',
                                type: 'error'
                            });
                        })
                }
            },
            //邮箱号码验证
            validateEmail : function(rule, value, callback) {
                var isEmail=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (value == '') {
                    callback(new Error('请输入邮箱号码'));
                } else if (!isEmail.test(value)) {
                    console.log(value);
                    callback(new Error('邮箱格式不正确,请重新输入'));
                } else {
                    basicComentApi.getCountByEmail({email:value})
                        .then((res) => {
                            if( res.code == this.$success ){
                                callback();
                            } else {
                                callback(new Error('邮箱号码已被占用'));
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.$message({
                                message: '初始化错误！',
                                type: 'error'
                            });
                        })
                }
            },
            validatePass :function (rule, value, callback)  {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.account.checkPass !== '') {
                        this.$refs.registerForm.validateField('checkPass');
                    }
                    callback();
                }
            },
            validatePass2:function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.account.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },
            sendRegister:function() {
                this.$refs.registerForm.validate((valid)=>{
                    if (valid) {
                        userRegister(this.account)
                            .then((res) => {
                                if( res.code == this.$success ){
                                    // ----------- 初始化用户数据 --------------------------
                                    // this.$message({
                                    //     message: '注册成功！',
                                    //     type: 'success'
                                    // });
                                    this.showRegisterForm=false;
                                    this.showReturnLoginbtn=true;
                                    this.successTips="注册成功,请前往邮箱进行激活！";
                                } else {
                                    // this.registerFail();
                                    // this.$message.error(res.message||'注册失败！');
                                    // this.errorMsg=   "注册失败,请检查！"
                                    // 多语言处理 按多语言取内容
                                    let mess = this.getLangServerMess(res.messageCode);
                                    this.$message({
                                        type: 'error',
                                        message: res.message || mess ||"操作失败！"
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                this.$message({
                                    message: '注册错误！',
                                    type: 'error'
                                });
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            goLogin: function () {
                this.$router.push('/login');
            },

            //重置信息
            // resetForm(account) {
            //     this.$refs["registerForm"].resetFields();
            // },

            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            // 回车自动搜索
            enterSearch:function(e){
                e.target.blur();
                this.sendRegister();
            },
            //注册成功,返回注册页面
            returnLoginBtn(){
                this.$router.push('/login');
            }

        }
    }

</script>

<style lang="scss">

    .register {
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
            .register_main {
                display: inline-block;
                margin: 0 auto;
                width: 1190px;
                text-align: left;
                & > .register-box {
                    margin:0 auto;
                    width: 600px;
                    /*height: 740px;*/
                    background-color: #eeeeee;
                    border-radius: 9px;
                    h3 {
                        font-weight: 500;
                        line-height: 80px;
                        font-size: 25px;
                        color: #418a5a;
                        text-align: center;
                    }
                    h4{
                        text-align: center;
                        font-weight: 500;
                        color: #2fb21a;
                    }
                    .showReturnLoginbtn{
                        text-align: center;padding-bottom: 30px
                    }
                    .form-input {
                        width: 320px;
                        margin: 20px 20px 0 90px;
                    }
                }
            }
        }

    }

</style>
