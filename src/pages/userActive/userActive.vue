<template>
    <div class="page_user_active">
        <div class="cont">
            <div class="user_active_main">
                <div class="user_active_box">
                    <div class="head_box"><h3>用户激活</h3></div>
                    <div v-loading="loading" element-loading-text="激活中" element-loading-spinner="el-icon-loading"></div>
<!--                    <h3 :visible.sync="videoVisible">激活成功</h3>-->
                    <div class="error"><h3>{{errorMsg}}</h3></div>
                    <div><h3>{{successTips}}</h3></div>
                    <div v-if="showReturnbtn" style="padding-bottom: 30px">
                        <el-button type="success" round @click="returnLoginPage">返回登录</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {getActivated} from "@/api/user"
    export default {
        name: "userActive",
        data() {
            return {
                form: {},
                email:'',
                labelPosition: 'right',
                loading:true,
                showReturnbtn:false,
                errorMsg:'',
                successTips:''
            }

        },
        methods: {
            submit(){

            }
        },
        mounted(){
            //validateCode
            let validateCode = this.$route.query.validateCode;
            console.log('validateCode',validateCode);
            getActivated(validateCode).then((result)=>{
                console.log('result',result);
                if(result.code==this.$success){
                    console.log("result",result);
                    this.loading=false;
                    this.showReturnbtn=true;
                    this.successTips='激活成功';
                }else{
                    this.errorMsg = "激活失败,请检查！"
                }
            }).catch((err)=>{
                console.log('err',err);
            })
        },
        methods:{
            returnLoginPage(){
                this.$router.push('/login')
            }
        }

    }
</script>

<style lang="scss">
    .page_user_active {
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

            .user_active_main {
                display: inline-block;
                margin: 0 auto;
                text-align: center;
                width: 22%;

                & > .user_active_box {
                    /*margin-left: 830px;*/
                    max-width: 420px;
                    width: 120%;
                    margin: 0 auto;
                    /*height: 300px;*/
                    background-color: #eeeeee;
                    border-radius: 9px;

                    h3 {
                        font-weight: 500;
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
            }
        }

    }
</style>
