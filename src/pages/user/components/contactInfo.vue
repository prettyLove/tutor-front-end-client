<template>
    <div class="page_contact_info">
        <el-row :gutter="12">
            <el-col :span="12">
                <div>
                    <el-form ref="form" :model="contactInfoForm" label-width="90px">
                        <el-form-item label="联系方式：">
                            <el-input v-model="contactInfoForm.phone" placeholder="请输入联系方式" ></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱号码：">
                            <el-input v-model="contactInfoForm.email" placeholder="请输入邮箱号码" ></el-input>
                        </el-form-item>
                        <el-form-item label="地址信息：">
                            <el-input v-model="contactInfoForm.address" placeholder="请输入地址信息" ></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button @click="saveInfo(contactInfoForm)">保存</el-button>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import viewBase from '../../common/viewBase'
    import {memberRoleList, roles, langSelectList} from "@/utils/const";
    import {basicComentApi,basicComentgetUser} from "@/api/user";

    export default {
        extends:viewBase,
        name: "contactInfo",
        data() {
            return {
                roles,
                memberRoleList,
                langSelectList,
                contactInfoForm:{},
            }
        },
        mounted() {
            this.basicComentUser();
        },
        methods: {
            basicComentUser:function(){
                let vm=this;
                basicComentApi.basicComentgetUser().then((result)=>{
                    console.log('result',result);
                    if(result.code==vm.$success){
                        console.log('result',result);
                        this.contactInfoForm=result.data;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            saveInfo:function (params) {
                console.log("params",params);
                // todo
                // api
                basicComentApi.basicComentSave(params).then((result)=>{
                    console.log('result',result);
                    if(result.code==this.$success){
                        this.$message({
                            type: 'success',
                            message: "更新成功"
                        });
                    }else {
                        this.$message({
                            type: 'error',
                            message: "更新失败"
                        });
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    .page_contact_info {

    }
</style>
