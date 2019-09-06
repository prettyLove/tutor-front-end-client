<template>
    <div class="page_retrueve_password">
        <div class="cont">
            <div class="retrueve_password_main">
                <div class="retrueve_password_box" v-if="msg==''&&errorMsg==''" >
                    <div class="head-box"><h3>重置密码</h3></div>
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" style="" class="el-form" >
                        <el-input v-model="form.password" @keyup.enter.native="enterSearch" type="password" class="el-input" style=""
                                  placeholder="请输入密码 6~12位">
                            <template slot="prepend">
                                <font-awesome-icon icon="lock" style="color: #418a5a"></font-awesome-icon>
                            </template>
                            queryRoleMenus
                        </el-input>
                        <el-input v-model="form.confirmPassword" @keyup.enter.native="enterSearch" type="password"
                                  style="text-align:center;width: 280px" placeholder="请再次输入确认密码">
                            <template slot="prepend">
                                <font-awesome-icon icon="lock" style="color: #418a5a"></font-awesome-icon>
                            </template>
                            queryRoleMenus
                        </el-input>
                    </el-form>
                    <div style="margin-top: 40px; text-align: center;">
                        <el-button type="info" @click="returnLogin">取消</el-button>
                        <el-button type="primary" @click="submitRetrievePassword">提交</el-button>
                    </div>

                </div>

                <template v-else>
                    <div class="retrueve_password" >
<!--                        <div ><h3>{{successTips}}</h3></div>-->
                        <div class="error"><h3>{{errorMsg}}</h3></div>
                        <div class="success"><h3>{{msg}}</h3></div>
                        <div >
                            <el-button type="success" round @click="returnLogin">返回登录</el-button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {findPasswordUpdate} from '@/api/user';
    export default {
        name: "retrievePassword",
        data() {
            return {
                form: {},
                labelPosition: 'right',
                validateCode:'',
                formValue:'',
                resetSuccessVisible:false,
                successTips:'',
                msg:"",
                errorMsg:"",
            }
        },
        methods: {
            submitRetrievePassword() {
                this.msg = "";
                this.errorMsg = "";
                if (this.form.password !== this.form.confirmPassword) {
                    this.$alert("两次输入的密码不一样,请检查");
                    return;
                }
                let reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/;
                if(!reg.test(this.form.password)){
                    this.$alert("密码必须是包含大写字母、小写字母、数字 ,长度在6~16之间");
                }else{
                    console.log("send...")

                    let params ={
                        password:this.form.password,
                        confirmPassword:this.form.confirmPassword,
                        validateCode:this.validateCode
                    };
                    findPasswordUpdate(params).then((result)=>{
                        console.log('result',result);
                        if(result.code==this.$success){
                            this.resetSuccessVisible=true;
                            this.msg="密码重置成功,是否返回登录页面";
                        }else{
                            this.errorMsg = "链接失败，请检查！"
                        }
                    }).catch((err)=>{
                        console.log('err',err);
                    })
                }
            },
            returnLogin(){
                this.$router.push('/login');
            }
        },
        mounted() {
            this.validateCode = this.$route.query.validateCode;
            console.log('validateCode',this.validateCode);
        }

    }
</script>

<style lang="scss">
    .page_retrueve_password {
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

            .retrueve_password_main {
                display: inline-block;
                margin: 0 auto;
                text-align: center;

                & > .retrueve_password_box {
                    /*margin-left: 830px;*/
                    max-width: 420px;
                    margin: 0 auto;
                    height: 420px;
                    padding-left: 20px;
                    padding-right: 20px;
                    background-color: #eeeeee;
                    border-radius: 9px;

                    h3 {
                        font-weight: 400;
                        line-height: 120px;
                        font-size: 25px;
                        color: #418a5a;
                        text-align: center;
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
                &>.retrueve_password{
                    max-width: 420px;
                    min-width: 320px;
                    margin: 0 auto;
                    min-height: 240px;
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-bottom: 40px;
                    padding-top: 40px;
                    background-color: #eeeeee;
                    border-radius: 9px;

                    .error {
                        font-weight: 500;
                        line-height: 120px;
                        font-size: 25px;
                        color: #ff0000;
                        text-align: center;
                    }
                    .success {
                        font-weight: 500;
                        line-height: 120px;
                        font-size: 25px;
                        text-align: center;
                    }
                }
            }
        }

    }
</style>
