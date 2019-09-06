<template>
    <div class="page_forget_password">
        <div class="cont">
            <div class="forget_password_main" >
                <div class="forget_password_box">
                    <div class="head_box" v-if="showHh"><h3>找回密码</h3></div>
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" style="" class="el-form" v-if="showForm">
                        <el-input v-model="form.email" @keyup.enter.native="enterSearch" class="el-input"
                                  placeholder="请输入验证邮箱">
                            <template slot="prepend">
                                <font-awesome-icon icon="envelope" style="color: #418a5a"></font-awesome-icon>
                            </template>
                            queryRoleMenus
                        </el-input>
                    </el-form>
                    <div style="color:#ff3126">{{msg}}</div>
                    <div style=" margin-top: 40px;text-align: center;" v-if="showDiv">
                        <el-button  type="info" @click="returnLogin">取消</el-button>
                        <el-button type="primary" @click="submitForgetPassword">提交</el-button>
                    </div>
                    <div class="error"><h3>{{errorMsg}}</h3></div>
                    <div style="padding: 55px 20px"><h3>{{successTips}}</h3></div>
                    <div v-if="showReturnbtn">
                        <el-button type="success" round @click="returnLogin">返回登录</el-button>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {findPasswordEmail} from '@/api/user';
    import {validateEmail} from '@/utils/validate';
    export default {
        name: "forgetPassword",
        data() {
            return {
                form: {},
                labelPosition: 'right',
                validateEmail,
                msg:'',
                code:'',
                showForm:true,
                showDiv:true,
                showHh:true,
                showReturnbtn:false,
                successTips:'',
                errorMsg:''
            }

        },
        methods: {
            submitForgetPassword(){
                this.msg="";
                this.errorMsg = "";
                let email=this.form.email;
                if(validateEmail(email)){
                    findPasswordEmail({email:email}).then((result)=>{
                        if(result.code==this.$success){
                            this.showForm=false;
                            this.showDiv=false;
                            this.showHh=false;
                            this.successTips='请登录邮箱点击验证';
                            this.showReturnbtn=true;
                            console.log('result',result);
                        }else{
                            this.errorMsg = "发送失败,请检查！"
                        }
                    }).catch((err)=>{
                        console.log('err',err);
                    })
                }else{
                    this.msg="您输入的邮箱不合法,请检查！"
                }

            },
            returnLogin(){
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="scss" >
    .page_forget_password {
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

            .forget_password_main {
                display: inline-block;
                margin: 0 auto;
                text-align: center;

                & > .forget_password_box {
                    /*margin-left: 830px;*/
                    max-width: 420px;
                    width: 120%;
                    margin: 0 auto;
                    height: 420px;
                    background-color: #eeeeee;
                    border-radius: 9px;

                    h3 {
                        font-weight: 500;
                        line-height: 120px;
                        font-size: 25px;
                        color: #418a5a;
                        text-align: center;
                    }
                    .error{
                       h3{color:#ff0000;}
                    }

                    .el-form {
                        margin-top: 10px;

                        .el-input {
                            text-align: center;
                            width: 280px;
                            margin-bottom: 20px
                        }
                    }

                    .el-button + .el-button {
                        margin-left: 0px;
                    }
                }
            }
        }

    }
</style>
